// Lightweight daily job runner — no extra dependency (no node-cron) needed.
// Handles: subscription expiry reminders, subscription-expired notices, and
// "come back and finish your course" progress reminders.
const User = require('../models/User');
const Course = require('../models/Course');
const Progress = require('../models/Progress');
const Notification = require('../models/Notification');
const {
  sendSubscriptionExpiryReminderEmail,
  sendSubscriptionExpiredEmail,
  sendCourseProgressReminderEmail
} = require('./email');

const notify = (userId, doc) => Notification.create({ userId, time: 'Just now', read: false, ...doc }).catch(e => console.error('[scheduler] notify failed:', e.message));

const DAY_MS = 24 * 60 * 60 * 1000;
const EXPIRY_REMINDER_DAYS = Number(process.env.SUBSCRIPTION_EXPIRY_REMINDER_DAYS || 7);
const PROGRESS_REMINDER_AFTER_DAYS = Number(process.env.PROGRESS_REMINDER_AFTER_DAYS || 5);
const REMINDER_COOLDOWN_DAYS = Number(process.env.PROGRESS_REMINDER_COOLDOWN_DAYS || 7);

function daysBetween(a, b) { return Math.round((a.getTime() - b.getTime()) / DAY_MS); }

async function runSubscriptionChecks() {
  const now = new Date();
  const users = await User.find({ 'subscription.expiresDate': { $ne: null, $ne: '' } });
  for (const u of users) {
    const sub = u.subscription;
    if (!sub?.expiresDate) continue;
    const expires = new Date(`${sub.expiresDate}T23:59:59`);
    if (Number.isNaN(expires.getTime())) continue;

    if (sub.active && expires < now) {
      // Just expired — deactivate and notify once.
      sub.active = false;
      const alreadyNotified = sub.expiredEmailSentAt && daysBetween(now, new Date(sub.expiredEmailSentAt)) < 1;
      if (!alreadyNotified) {
        sub.expiredEmailSentAt = now;
        void sendSubscriptionExpiredEmail(u).catch(() => {});
        void notify(u._id, { category: 'Subscription', title: 'Membership expired', message: `Your Annual Membership expired on ${sub.expiresDate}. Renew to keep your access.`, actionUrl: '/student/subscription', source: 'subscription_expired' });
      }
      await u.save();
      continue;
    }

    if (sub.active) {
      const daysLeft = daysBetween(expires, now);
      if (daysLeft >= 0 && daysLeft <= EXPIRY_REMINDER_DAYS) {
        const lastSent = sub.expiryReminderSentAt ? new Date(sub.expiryReminderSentAt) : null;
        const alreadySentToday = lastSent && daysBetween(now, lastSent) < 1;
        if (!alreadySentToday) {
          sub.expiryReminderSentAt = now;
          await u.save();
          void sendSubscriptionExpiryReminderEmail(u, daysLeft).catch(() => {});
          void notify(u._id, { category: 'Subscription', title: 'Membership expiring soon', message: `Your Annual Membership expires in ${daysLeft} day(s) on ${sub.expiresDate}.`, actionUrl: '/student/subscription', source: 'subscription_expiry_reminder' });
        }
      }
    }
  }
}

async function runProgressReminders() {
  const now = new Date();
  const staleBefore = new Date(now.getTime() - PROGRESS_REMINDER_AFTER_DAYS * DAY_MS);
  const rows = await Progress.find({
    isCompleted: false,
    percent: { $gt: 0, $lt: 100 },
    updatedAt: { $lt: staleBefore }
  });
  if (!rows.length) return;
  const courseIds = [...new Set(rows.map(r => r.courseId))];
  const userIds = [...new Set(rows.map(r => r.userId.toString()))];
  const [courses, users] = await Promise.all([
    Course.find({ id: { $in: courseIds } }).select('id title').lean(),
    User.find({ _id: { $in: userIds } })
  ]);
  const courseById = new Map(courses.map(c => [c.id, c]));
  const userById = new Map(users.map(u => [u._id.toString(), u]));

  for (const p of rows) {
    const lastSent = p.progressReminderSentAt ? new Date(p.progressReminderSentAt) : null;
    if (lastSent && daysBetween(now, lastSent) < REMINDER_COOLDOWN_DAYS) continue;
    const user = userById.get(p.userId.toString());
    const course = courseById.get(p.courseId);
    if (!user || !course) continue;
    p.progressReminderSentAt = now;
    await p.save();
    void sendCourseProgressReminderEmail(user, course, p.percent).catch(() => {});
    void notify(user._id, { category: 'Course Updates', title: 'Continue your course', message: `You're ${p.percent}% through ${course.title}. Pick up where you left off.`, actionUrl: `/student/course/${course.id}`, source: 'progress_reminder' });
  }
}

async function runDailyJobs() {
  try { await runSubscriptionChecks(); } catch (e) { console.error('[scheduler] subscription checks failed:', e.message); }
  try { await runProgressReminders(); } catch (e) { console.error('[scheduler] progress reminders failed:', e.message); }
}

function startScheduler() {
  // Run shortly after boot, then once every 24 hours.
  setTimeout(() => { void runDailyJobs(); }, 30 * 1000);
  setInterval(() => { void runDailyJobs(); }, DAY_MS);
  console.log('[scheduler] daily email reminder jobs scheduled');
}

module.exports = { startScheduler, runDailyJobs, runSubscriptionChecks, runProgressReminders };
