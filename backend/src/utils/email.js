const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');

const brand = process.env.EMAIL_BRAND_NAME || 'ThinkAHead Learning Hub';
const clientUrl = (process.env.CLIENT_URL || 'http://localhost:3000').split(',')[0].trim();
const publicApiUrl = (process.env.PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const randomOtp = () => String(crypto.randomInt(100000, 1000000));
const randomToken = () => crypto.randomBytes(32).toString('hex');
const ttlMinutes = Number(process.env.EMAIL_OTP_TTL_MINUTES || 10);

// --- Resend (HTTPS email API) config -----------------------------------------
// Render's free tier blocks outbound SMTP ports (25/465/587), so plain
// Nodemailer+SMTP cannot connect from a free web service. Resend sends mail
// over normal HTTPS (port 443), which is never blocked, so it works on any tier.
function emailConfig() {
  const apiKey = String(process.env.RESEND_API_KEY || '').trim();
  const user = String(process.env.SMTP_USER || '').trim(); // kept for backward compatibility with existing env vars
  const from = String(process.env.SMTP_FROM || process.env.RESEND_FROM || `${brand} <onboarding@resend.dev>`).trim();
  return { apiKey, user, from };
}

function isConfigured() {
  const c = emailConfig();
  return Boolean(c.apiKey);
}

async function verifyEmailTransport() {
  if (!isConfigured()) return { ok: false, skipped: true, reason: 'RESEND_API_KEY is not configured' };
  console.log('[email] Resend API key configured, ready to send.');
  return { ok: true };
}

function layout(title, body) {
  return `<!doctype html><html><body style="margin:0;background:#eef2f7;font-family:Arial,Helvetica,sans-serif;color:#0f172a">
  <div style="max-width:600px;margin:32px auto;padding:0 14px">
    <div style="background:#ffffff;border:1px solid #dbe3ee;border-radius:22px;overflow:hidden;box-shadow:0 12px 40px rgba(15,23,42,.10)">
      <div style="height:6px;background:linear-gradient(90deg,#2563eb,#06b6d4,#10b981)"></div>
      <div style="padding:40px 36px;text-align:center">
        <h1 style="font-size:23px;line-height:1.3;margin:0 0 18px;color:#0f172a;text-align:center">${escapeHtml(title)}</h1>
        <div style="text-align:center;font-size:15px;line-height:1.7;color:#334155">${body}</div>
      </div>
      <div style="height:1px;background:#e2e8f0;margin:0 36px"></div>
      <div style="padding:28px 30px;text-align:center">
        <img src="cid:thinkahead-logo" alt="${escapeHtml(brand)}" style="display:inline-block;width:150px;max-width:55%;height:auto;object-fit:contain;margin-bottom:12px">
        <div style="color:#334155;font-size:13px;font-weight:700">${escapeHtml(brand)}</div>
        <div style="color:#94a3b8;font-size:11.5px;margin-top:6px;line-height:1.6">Human Capability Development<br>This is an automated email. Please do not reply to this message.</div>
      </div>
    </div>
  </div>
  </body></html>`;
}

async function sendEmail({to, subject, html, text, attachments}) {
  if (!to) throw new Error('Email recipient is missing.');
  const c = emailConfig();
  if (!c.apiKey) {
    throw new Error('Resend is not configured. Set RESEND_API_KEY (and optionally SMTP_FROM) in the environment.');
  }

  // Embed the logo as a Resend attachment (referenced by cid in the HTML <img> tag).
  const logoPath = path.join(__dirname, '../../../public/assets/images/logo.png');
  const defaultAttachments = fs.existsSync(logoPath)
    ? [{ filename: 'thinkahead-logo.png', content: fs.readFileSync(logoPath).toString('base64'), content_id: 'thinkahead-logo' }]
    : [];
  const extraAttachments = (attachments || []).map(a => ({
    filename: a.filename,
    content: a.content ? (Buffer.isBuffer(a.content) ? a.content.toString('base64') : a.content)
      : (a.path && fs.existsSync(a.path) ? fs.readFileSync(a.path).toString('base64') : undefined),
    content_id: a.cid || undefined
  })).filter(a => a.content);

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${c.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: c.from,
      to: String(to).split(',').map(x => x.trim()).filter(Boolean),
      subject,
      html,
      text,
      attachments: [...defaultAttachments, ...extraAttachments]
    })
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.message || `Resend API error (status ${response.status})`;
    throw new Error(message);
  }
  console.log(`[email] sent "${subject}" to ${to} (${data.id})`);
  return { messageId: data.id, accepted: [to], rejected: [] };
}

async function safeSendEmail(args) {
  try { return await sendEmail(args); }
  catch (error) { console.error(`[email] failed to send "${args.subject}" to ${args.to}:`, error.message); return { error: error.message }; }
}

async function adminEmails() {
  const configuredAdmin = (process.env.ADMIN_NOTIFICATION_EMAIL || '').trim();
  if (configuredAdmin) return [configuredAdmin];
  return User.find({ role: 'admin' }).select('email').lean().then(rows => rows.map(x => x.email).filter(Boolean));
}
async function sendAdminNotification(subject, html, text) {
  const recipients = await adminEmails();
  if (!recipients.length) return { skipped: true, reason: 'no-admin-recipient' };
  return safeSendEmail({ to: recipients.join(','), subject: `[${brand}] ${subject}`, html: layout(subject, html), text });
}

// User-facing emails intentionally use sendEmail (not safeSendEmail) so SMTP failures are visible.
async function sendOtpEmail(user, otp, purpose = 'verification') {
  const label = purpose === 'password-reset' ? 'password reset' : purpose === 'login-otp' ? 'login verification' : 'email verification';
  return sendEmail({ to:user.email, subject:`${brand} – Your ${label} OTP`, html:layout(`Your ${label} code`, `<p style="font-size:15px;line-height:1.6">Hi ${escapeHtml(user.name)},</p><p>Use this code. It expires in <strong>${ttlMinutes} minutes</strong>.</p><div style="font-size:32px;letter-spacing:9px;font-weight:800;text-align:center;padding:18px;background:#eff6ff;border-radius:14px;color:#1d4ed8">${otp}</div><p style="font-size:12px;color:#64748b">Never share this code.</p>`), text:`Hi ${user.name}, your ${label} OTP is ${otp}. It expires in ${ttlMinutes} minutes.` });
}
async function sendVerificationEmail(user, token) {
  const link = `${publicApiUrl}/api/auth/verify-email-link?token=${encodeURIComponent(token)}`;
  return sendEmail({ to:user.email, subject:`${brand} – Verify your email`, html:layout('Verify your email address', `<p>Hi ${escapeHtml(user.name)},</p><p>Please verify your email address to activate your account.</p><p><a href="${link}" style="display:inline-block;padding:13px 20px;border-radius:10px;background:#2563eb;color:#fff;text-decoration:none;font-weight:700">Verify Email</a></p>`), text:`Verify your ${brand} email: ${link}` });
}
async function sendWelcomeEmail(user) { return sendEmail({ to:user.email, subject:`Welcome to ${brand}!`, html:layout('Welcome aboard!', `<p>Hi ${escapeHtml(user.name)},</p><p>Your email is verified and your ${escapeHtml(brand)} learner account is ready.</p><p><a href="${clientUrl}" style="display:inline-block;padding:13px 20px;border-radius:10px;background:#0f766e;color:#fff;text-decoration:none;font-weight:700">Open Learning Hub</a></p>`), text:`Welcome to ${brand}, ${user.name}! Your email is verified and your learner account is ready.` }); }
async function sendPasswordResetEmail(user, token) {
  const link = `${clientUrl.replace(/\/$/,'')}/?resetToken=${encodeURIComponent(token)}&email=${encodeURIComponent(user.email)}`;
  return sendEmail({ to:user.email, subject:`${brand} – Reset your password`, html:layout('Reset your password', `<p>Hi ${escapeHtml(user.name)},</p><p>We received a request to reset your password.</p><p><a href="${link}" style="display:inline-block;padding:13px 20px;border-radius:10px;background:#4f46e5;color:#fff;text-decoration:none;font-weight:700">Reset Password</a></p>`), text:`Reset your ${brand} password: ${link}` });
}
async function sendCourseCompletionEmail(user, course) { return sendEmail({ to:user.email, subject:`${brand} – Course completed: ${course.title}`, html:layout('Course completed 🎉', `<p>Congratulations, ${escapeHtml(user.name)}!</p><p>You successfully completed <strong>${escapeHtml(course.title)}</strong>.</p>`), text:`Congratulations ${user.name}! You completed ${course.title}.` }); }
async function sendContactAcknowledgement(contact) { return sendEmail({to:contact.email,subject:`${brand} – We received your message`,html:layout('Thanks for contacting us',`<p>Hi ${escapeHtml(contact.name)},</p><p>We received your message and will review it shortly.</p>`),text:`Hi ${contact.name}, we received your message and will review it shortly.`}); }

// Whether a user has opted in to (non-critical) email notifications. Security/transactional
// emails (password changed, payment receipts, etc.) are sent regardless of this flag.
function wantsNotifications(user) { return user?.emailNotifications !== false; }

async function sendCourseStartedEmail(user, course) {
  if (!wantsNotifications(user)) return { skipped: true, reason: 'notifications-off' };
  return safeSendEmail({ to:user.email, subject:`${brand} – You started: ${course.title}`, html:layout('Your course has started 🚀', `<p>Hi ${escapeHtml(user.name)},</p><p>You've enrolled in <strong>${escapeHtml(course.title)}</strong>. Jump back in any time to keep your progress moving.</p><p><a href="${clientUrl}" style="display:inline-block;padding:13px 20px;border-radius:10px;background:#2563eb;color:#fff;text-decoration:none;font-weight:700">Start Learning</a></p>`), text:`Hi ${user.name}, you've enrolled in ${course.title}. Open ${clientUrl} to start learning.` });
}

async function sendCourseProgressReminderEmail(user, course, percent) {
  if (!wantsNotifications(user)) return { skipped: true, reason: 'notifications-off' };
  return safeSendEmail({ to:user.email, subject:`${brand} – Continue ${course.title} (${percent}% done)`, html:layout("Pick up where you left off", `<p>Hi ${escapeHtml(user.name)},</p><p>You're <strong>${percent}%</strong> through <strong>${escapeHtml(course.title)}</strong>. You've been away for a few days — a little momentum goes a long way.</p><p><a href="${clientUrl}" style="display:inline-block;padding:13px 20px;border-radius:10px;background:#0891b2;color:#fff;text-decoration:none;font-weight:700">Resume Course</a></p>`), text:`Hi ${user.name}, you're ${percent}% through ${course.title}. Resume at ${clientUrl}.` });
}

async function sendPasswordChangedEmail(user) {
  return sendEmail({ to:user.email, subject:`${brand} – Your password was changed`, html:layout('Password changed', `<p>Hi ${escapeHtml(user.name)},</p><p>This confirms your ${escapeHtml(brand)} account password was just changed.</p><p style="font-size:13px;color:#64748b">If you didn't make this change, please contact support immediately and reset your password.</p>`), text:`Hi ${user.name}, your ${brand} password was just changed. If this wasn't you, contact support immediately.` });
}

async function sendCertificateAvailableEmail(user, certificate) {
  if (!wantsNotifications(user)) return { skipped: true, reason: 'notifications-off' };
  return sendEmail({ to:user.email, subject:`${brand} – Your certificate is ready 🎓`, html:layout('Certificate available', `<p>Congratulations, ${escapeHtml(user.name)}!</p><p>Your <strong>${escapeHtml(certificate?.courseName || 'ThinkAHead')}</strong> certificate has been generated and is ready to view or download.</p><p><a href="${clientUrl}" style="display:inline-block;padding:13px 20px;border-radius:10px;background:#7c3aed;color:#fff;text-decoration:none;font-weight:700">View Certificate</a></p>`), text:`Congratulations ${user.name}! Your certificate (${certificate?.certificateNumber || ''}) is ready at ${clientUrl}.` });
}

async function sendSubscriptionSuccessEmail(user, payment) {
  const amountLabel = payment?.amount ? `₹${payment.amount}` : '';
  return sendEmail({ to:user.email, subject:`${brand} – Membership activated ✅`, html:layout('Annual Membership activated', `<p>Hi ${escapeHtml(user.name)},</p><p>Your payment was successful and your <strong>Annual Membership</strong> is now active${amountLabel?` (${escapeHtml(amountLabel)})`:''}.</p><p>Plan: <strong>${escapeHtml(user.subscription?.plan||'Annual Premium')}</strong><br>Valid until: <strong>${escapeHtml(user.subscription?.expiresDate||'')}</strong></p><p><a href="${clientUrl}" style="display:inline-block;padding:13px 20px;border-radius:10px;background:#16a34a;color:#fff;text-decoration:none;font-weight:700">Go to Dashboard</a></p>`), text:`Hi ${user.name}, your payment was successful and your Annual Membership is active until ${user.subscription?.expiresDate||''}.` });
}

async function sendSubscriptionFailedEmail(user, reason) {
  return sendEmail({ to:user.email, subject:`${brand} – Payment failed`, html:layout('Payment could not be completed', `<p>Hi ${escapeHtml(user.name)},</p><p>We couldn't process your membership payment${reason?`: <em>${escapeHtml(reason)}</em>`:'.'}</p><p>No amount has been deducted for this failed attempt. You can try again any time.</p><p><a href="${clientUrl}" style="display:inline-block;padding:13px 20px;border-radius:10px;background:#dc2626;color:#fff;text-decoration:none;font-weight:700">Try Again</a></p>`), text:`Hi ${user.name}, your membership payment failed${reason?`: ${reason}`:'.'} You can retry any time at ${clientUrl}.` });
}

async function sendSubscriptionExpiredEmail(user) {
  return safeSendEmail({ to:user.email, subject:`${brand} – Your membership has expired`, html:layout('Membership expired', `<p>Hi ${escapeHtml(user.name)},</p><p>Your Annual Membership expired on <strong>${escapeHtml(user.subscription?.expiresDate||'')}</strong>. Renew now to keep access to your premium courses and certificates.</p><p><a href="${clientUrl}" style="display:inline-block;padding:13px 20px;border-radius:10px;background:#b91c1c;color:#fff;text-decoration:none;font-weight:700">Renew Membership</a></p>`), text:`Hi ${user.name}, your ThinkAHead membership expired on ${user.subscription?.expiresDate||''}. Renew at ${clientUrl}.` });
}

async function sendSubscriptionExpiryReminderEmail(user, daysLeft) {
  if (!wantsNotifications(user)) return { skipped: true, reason: 'notifications-off' };
  return safeSendEmail({ to:user.email, subject:`${brand} – Membership expires in ${daysLeft} day${daysLeft===1?'':'s'}`, html:layout('Your membership is expiring soon', `<p>Hi ${escapeHtml(user.name)},</p><p>Your Annual Membership expires on <strong>${escapeHtml(user.subscription?.expiresDate||'')}</strong> (${daysLeft} day${daysLeft===1?'':'s'} from now). Renew before it lapses to avoid losing access.</p><p><a href="${clientUrl}" style="display:inline-block;padding:13px 20px;border-radius:10px;background:#d97706;color:#fff;text-decoration:none;font-weight:700">Renew Now</a></p>`), text:`Hi ${user.name}, your membership expires in ${daysLeft} day(s) on ${user.subscription?.expiresDate||''}. Renew at ${clientUrl}.` });
}

module.exports = {
  configured:isConfigured, isConfigured, verifyEmailTransport, ttlMinutes, hash, randomOtp, randomToken, sendEmail, safeSendEmail, sendAdminNotification,
  sendOtpEmail, sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendCourseCompletionEmail, sendContactAcknowledgement,
  sendCourseStartedEmail, sendCourseProgressReminderEmail, sendPasswordChangedEmail, sendCertificateAvailableEmail,
  sendSubscriptionSuccessEmail, sendSubscriptionFailedEmail, sendSubscriptionExpiredEmail, sendSubscriptionExpiryReminderEmail
};
