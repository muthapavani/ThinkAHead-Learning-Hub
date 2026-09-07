// =============================================================
//  ThinkAHead Learning Hub - Email Utility
//  Provider: Elastic Email HTTP API (v4)  --  replaces Gmail SMTP / Nodemailer
//
//  Required environment variables (set in backend/.env and on Render):
//    ELASTIC_EMAIL_API_KEY   -> your Elastic Email API key
//    EMAIL_FROM              -> your VERIFIED sender email address
//    EMAIL_FROM_NAME         -> ThinkAHead Learning Hub
//  Optional:
//    EMAIL_LOGO_URL          -> public https URL of the logo shown in emails
//    CLIENT_URL, PUBLIC_API_URL, ADMIN_NOTIFICATION_EMAIL, EMAIL_OTP_TTL_MINUTES
//
//  NOTE: No SMTP_* variable is used any more.
// =============================================================

const crypto = require('crypto');
const User = require('../models/User');

const ELASTIC_API_BASE = 'https://api.elasticemail.com/v4';

const brand = process.env.EMAIL_BRAND_NAME || process.env.EMAIL_FROM_NAME || 'ThinkAHead Learning Hub';
const clientUrl = (process.env.CLIENT_URL || 'http://localhost:3000').split(',')[0].trim();
const publicApiUrl = (process.env.PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const randomOtp = () => String(crypto.randomInt(100000, 1000000));
const randomToken = () => crypto.randomBytes(32).toString('hex');
const ttlMinutes = Number(process.env.EMAIL_OTP_TTL_MINUTES || 10);

function emailConfig() {
  const apiKey = String(process.env.ELASTIC_EMAIL_API_KEY || '').trim();
  const rawFrom = String(process.env.EMAIL_FROM || '').trim();
  // EMAIL_FROM may be a bare address or already carry a display name, e.g.
  // 'ThinkAHead Learning Hub <hello@example.com>'. Keep only the address so the
  // name below is never applied twice, which Elastic Email rejects with a 400.
  const angled = rawFrom.match(/<\s*([^<>\s]+@[^<>\s]+)\s*>/);
  const fromEmail = (angled ? angled[1] : rawFrom.replace(/^.*?([^<>\s,]+@[^<>\s,]+).*$/, '$1')).trim();
  const nameFromEnv = String(process.env.EMAIL_FROM_NAME || '').trim();
  const nameInFrom = angled ? rawFrom.slice(0, rawFrom.indexOf('<')).trim().replace(/^"|"$/g, '') : '';
  const fromName = (nameFromEnv || nameInFrom || brand).trim();
  const from = fromName ? `${fromName} <${fromEmail}>` : fromEmail;
  return { apiKey, fromEmail, fromName, from };
}

function isConfigured() {
  const c = emailConfig();
  return Boolean(c.apiKey && c.fromEmail);
}

// Small helper so a hung network call can never freeze the request.
async function elasticFetch(path, options = {}, timeoutMs = 20000) {
  if (typeof fetch !== 'function') {
    throw new Error('Global fetch() is not available. Please run the backend on Node.js 18 or newer.');
  }
  const c = emailConfig();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(`${ELASTIC_API_BASE}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'X-ElasticEmail-ApiKey': c.apiKey,
        ...(options.headers || {})
      }
    });
  } finally {
    clearTimeout(timer);
  }
}

// Called once on server start (server.js). Name kept the same so nothing else breaks.
async function verifyEmailTransport() {
  if (!isConfigured()) {
    return { ok: false, skipped: true, reason: 'ELASTIC_EMAIL_API_KEY or EMAIL_FROM is missing' };
  }
  try {
    const res = await elasticFetch('/account', { method: 'GET' }, 10000);
    if (res.status === 401 || res.status === 403) {
      console.error('[email] Elastic Email API key was rejected (HTTP ' + res.status + ').');
      return { ok: false, error: 'Invalid or unauthorized ELASTIC_EMAIL_API_KEY' };
    }
    console.log(`[email] Elastic Email HTTP API ready. Sending as ${emailConfig().from}`);
    return { ok: true };
  } catch (error) {
    // A failed health check should not stop the server from booting.
    console.warn('[email] Elastic Email health check could not complete:', error.message);
    return { ok: false, error: error.message };
  }
}

// Email clients will not render base64 data: URIs (Gmail strips them), inline
// SVG, or cid: attachments (not supported by the Elastic Email v4 API). So the
// brand mark below is built from plain HTML and inline CSS only. It needs no
// hosting, cannot break, and renders in every client including Outlook.
//
// If EMAIL_LOGO_URL is set to a public https address, the real PNG logo is used
// instead. Anything else (empty, or an http://localhost address that Gmail's
// servers cannot reach) falls back to the wordmark.
const configuredLogoUrl = String(process.env.EMAIL_LOGO_URL || '').trim();
// The backend serves its own copy at /brand/email-logo.png, so once PUBLIC_API_URL
// is the https Render address the real logo appears with no extra setup. On
// localhost it stays http, which Gmail's image proxy cannot reach, so the
// wordmark is used instead of showing a broken image.
const logoUrl = configuredLogoUrl || `${publicApiUrl}/brand/email-logo.png`;
const useHostedLogo = /^https:\/\//i.test(logoUrl);

function brandMark() {
  if (useHostedLogo) {
    return `<img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(brand)}" width="150" style="display:inline-block;width:150px;max-width:55%;height:auto;border:0;outline:none;text-decoration:none;margin-bottom:12px">`;
  }
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 12px"><tr>
    <td style="width:46px;height:46px;border-radius:50%;background:#2563eb;text-align:center;vertical-align:middle;font-family:Arial,Helvetica,sans-serif;font-size:17px;font-weight:700;color:#ffffff;letter-spacing:1px">TA</td>
    <td style="padding-left:11px;text-align:left;font-family:Arial,Helvetica,sans-serif">
      <div style="font-size:19px;font-weight:700;line-height:1.15;color:#0f172a">Think<span style="color:#2563eb">AHead</span></div>
      <div style="font-size:9.5px;font-weight:600;letter-spacing:1.6px;color:#64748b;text-transform:uppercase">Learning Hub</div>
    </td>
  </tr></table>`;
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
        ${brandMark()}
        <div style="color:#334155;font-size:13px;font-weight:700">${escapeHtml(brand)}</div>
        <div style="color:#94a3b8;font-size:11.5px;margin-top:6px;line-height:1.6">Human Capability Development<br>This is an automated email. Please do not reply to this message.</div>
      </div>
    </div>
  </div>
  </body></html>`;
}

// Accepts the same arguments as before: { to, subject, html, text, attachments }
// "to" may be a single address, a comma separated string, or an array.
async function sendEmail({ to, subject, html, text, attachments }) {
  if (!to) throw new Error('Email recipient is missing.');
  const c = emailConfig();
  if (!c.apiKey || !c.fromEmail) {
    throw new Error('Elastic Email is not configured. Set ELASTIC_EMAIL_API_KEY and EMAIL_FROM in backend/.env (and on Render).');
  }

  const recipients = (Array.isArray(to) ? to : String(to).split(','))
    .map(x => String(x).trim())
    .filter(Boolean)
    .map(email => ({ Email: email }));
  if (!recipients.length) throw new Error('Email recipient is missing.');

  const body = [];
  if (html) body.push({ ContentType: 'HTML', Content: html, Charset: 'utf-8' });
  if (text) body.push({ ContentType: 'PlainText', Content: text, Charset: 'utf-8' });
  if (!body.length) body.push({ ContentType: 'PlainText', Content: ' ', Charset: 'utf-8' });

  const payload = {
    Recipients: recipients,
    Content: {
      From: c.from,
      Subject: subject,
      Body: body
    }
  };

  // Optional file attachments (base64). Nothing in the app uses this today.
  if (Array.isArray(attachments) && attachments.length) {
    payload.Content.Attachments = attachments.map(a => ({
      Name: a.filename || a.Name || 'attachment',
      ContentType: a.contentType || a.ContentType || 'application/octet-stream',
      BinaryContent: Buffer.isBuffer(a.content) ? a.content.toString('base64') : String(a.BinaryContent || a.content || '')
    }));
  }

  const res = await elasticFetch('/emails', { method: 'POST', body: JSON.stringify(payload) });
  const raw = await res.text();
  let data = {};
  try { data = raw ? JSON.parse(raw) : {}; } catch (_) { /* non JSON response */ }

  if (!res.ok) {
    const reason = data?.Error || data?.error || raw || `HTTP ${res.status}`;
    throw new Error(`Elastic Email rejected the message (HTTP ${res.status}): ${reason}`);
  }

  const messageId = data.MessageID || data.MessageId || data.TransactionID || 'accepted';
  const list = recipients.map(r => r.Email);
  console.log(`[email] sent "${subject}" to ${list.join(', ')} (${messageId})`);
  return { messageId, accepted: list, rejected: [] };
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

// User-facing emails intentionally use sendEmail (not safeSendEmail) so failures stay visible.
async function sendOtpEmail(user, otp, purpose = 'verification') {
  const label = purpose === 'password-reset' ? 'password reset' : purpose === 'login-otp' ? 'login verification' : 'email verification';
  return sendEmail({ to: user.email, subject: `${brand} – Your ${label} OTP`, html: layout(`Your ${label} code`, `<p style="font-size:15px;line-height:1.6">Hi ${escapeHtml(user.name)},</p><p>Use this code. It expires in <strong>${ttlMinutes} minutes</strong>.</p><div style="font-size:32px;letter-spacing:9px;font-weight:800;text-align:center;padding:18px;background:#eff6ff;border-radius:14px;color:#1d4ed8">${otp}</div><p style="font-size:12px;color:#64748b">Never share this code.</p>`), text: `Hi ${user.name}, your ${label} OTP is ${otp}. It expires in ${ttlMinutes} minutes.` });
}
async function sendVerificationEmail(user, token) {
  // Point at the frontend, not the API host. The app exchanges this token via a
  // background request, so the browser never navigates to the backend domain -
  // which is what triggers Chrome's Safe Browsing warning on shared hosts.
  const link = `${clientUrl.replace(/\/$/, '')}/?verifyToken=${encodeURIComponent(token)}`;
  const linkTtl = Number(process.env.EMAIL_VERIFICATION_TTL_MINUTES || 60);
  return sendEmail({
    to: user.email,
    subject: `${brand} - Verify your email to activate your account`,
    html: layout('Verify your email address', `
      <p>Hi ${escapeHtml(user.name)},</p>
      <p>Thanks for signing up. One last step: <strong>tap the button below to verify your email address.</strong> Your account is activated the moment you do.</p>
      <p style="margin:28px 0">
        <a href="${link}" style="display:inline-block;padding:15px 34px;border-radius:10px;background:#2563eb;color:#ffffff;text-decoration:none;font-weight:800;font-size:15px">Verify My Email</a>
      </p>
      <p style="font-size:12.5px;color:#64748b;margin:0 0 6px">Button not working? Copy this link into your browser:</p>
      <p style="font-size:11.5px;color:#2563eb;word-break:break-all;margin:0">${escapeHtml(link)}</p>
      <p style="font-size:12px;color:#94a3b8;margin-top:24px">This link expires in ${linkTtl} minutes. If you did not create this account, you can ignore this email.</p>
    `),
    text: `Hi ${user.name},\n\nThanks for signing up with ${brand}. Verify your email address to activate your account by opening this link:\n\n${link}\n\nThis link expires in ${linkTtl} minutes. If you did not create this account, you can ignore this email.`
  });
}
async function sendWelcomeEmail(user) { return sendEmail({ to: user.email, subject: `Welcome to ${brand}!`, html: layout('Welcome aboard!', `<p>Hi ${escapeHtml(user.name)},</p><p>Your email is verified and your ${escapeHtml(brand)} learner account is ready.</p><p><a href="${clientUrl}" style="display:inline-block;padding:13px 20px;border-radius:10px;background:#0f766e;color:#fff;text-decoration:none;font-weight:700">Open Learning Hub</a></p>`), text: `Welcome to ${brand}, ${user.name}! Your email is verified and your learner account is ready.` }); }
async function sendPasswordResetEmail(user, token) {
  const link = `${clientUrl.replace(/\/$/, '')}/?resetToken=${encodeURIComponent(token)}&email=${encodeURIComponent(user.email)}`;
  return sendEmail({ to: user.email, subject: `${brand} – Reset your password`, html: layout('Reset your password', `<p>Hi ${escapeHtml(user.name)},</p><p>We received a request to reset your password.</p><p><a href="${link}" style="display:inline-block;padding:13px 20px;border-radius:10px;background:#4f46e5;color:#fff;text-decoration:none;font-weight:700">Reset Password</a></p>`), text: `Reset your ${brand} password: ${link}` });
}
async function sendCourseCompletionEmail(user, course) { return sendEmail({ to: user.email, subject: `${brand} – Course completed: ${course.title}`, html: layout('Course completed 🎉', `<p>Congratulations, ${escapeHtml(user.name)}!</p><p>You successfully completed <strong>${escapeHtml(course.title)}</strong>.</p>`), text: `Congratulations ${user.name}! You completed ${course.title}.` }); }
async function sendContactAcknowledgement(contact) { return sendEmail({ to: contact.email, subject: `${brand} – We received your message`, html: layout('Thanks for contacting us', `<p>Hi ${escapeHtml(contact.name)},</p><p>We received your message and will review it shortly.</p>`), text: `Hi ${contact.name}, we received your message and will review it shortly.` }); }

// Whether a user has opted in to (non-critical) email notifications. Security/transactional
// emails (password changed, payment receipts, etc.) are sent regardless of this flag.
function wantsNotifications(user) { return user?.emailNotifications !== false; }

async function sendCourseStartedEmail(user, course) {
  if (!wantsNotifications(user)) return { skipped: true, reason: 'notifications-off' };
  return safeSendEmail({ to: user.email, subject: `${brand} – You started: ${course.title}`, html: layout('Your course has started 🚀', `<p>Hi ${escapeHtml(user.name)},</p><p>You've enrolled in <strong>${escapeHtml(course.title)}</strong>. Jump back in any time to keep your progress moving.</p><p><a href="${clientUrl}" style="display:inline-block;padding:13px 20px;border-radius:10px;background:#2563eb;color:#fff;text-decoration:none;font-weight:700">Start Learning</a></p>`), text: `Hi ${user.name}, you've enrolled in ${course.title}. Open ${clientUrl} to start learning.` });
}

async function sendCourseProgressReminderEmail(user, course, percent) {
  if (!wantsNotifications(user)) return { skipped: true, reason: 'notifications-off' };
  return safeSendEmail({ to: user.email, subject: `${brand} – Continue ${course.title} (${percent}% done)`, html: layout("Pick up where you left off", `<p>Hi ${escapeHtml(user.name)},</p><p>You're <strong>${percent}%</strong> through <strong>${escapeHtml(course.title)}</strong>. You've been away for a few days — a little momentum goes a long way.</p><p><a href="${clientUrl}" style="display:inline-block;padding:13px 20px;border-radius:10px;background:#0891b2;color:#fff;text-decoration:none;font-weight:700">Resume Course</a></p>`), text: `Hi ${user.name}, you're ${percent}% through ${course.title}. Resume at ${clientUrl}.` });
}

async function sendPasswordChangedEmail(user) {
  return sendEmail({ to: user.email, subject: `${brand} – Your password was changed`, html: layout('Password changed', `<p>Hi ${escapeHtml(user.name)},</p><p>This confirms your ${escapeHtml(brand)} account password was just changed.</p><p style="font-size:13px;color:#64748b">If you didn't make this change, please contact support immediately and reset your password.</p>`), text: `Hi ${user.name}, your ${brand} password was just changed. If this wasn't you, contact support immediately.` });
}

async function sendCertificateAvailableEmail(user, certificate) {
  if (!wantsNotifications(user)) return { skipped: true, reason: 'notifications-off' };
  return sendEmail({ to: user.email, subject: `${brand} – Your certificate is ready 🎓`, html: layout('Certificate available', `<p>Congratulations, ${escapeHtml(user.name)}!</p><p>Your <strong>${escapeHtml(certificate?.courseName || 'ThinkAHead')}</strong> certificate has been generated and is ready to view or download.</p><p><a href="${clientUrl}" style="display:inline-block;padding:13px 20px;border-radius:10px;background:#7c3aed;color:#fff;text-decoration:none;font-weight:700">View Certificate</a></p>`), text: `Congratulations ${user.name}! Your certificate (${certificate?.certificateNumber || ''}) is ready at ${clientUrl}.` });
}

async function sendSubscriptionSuccessEmail(user, payment) {
  const amountLabel = payment?.amount ? `₹${payment.amount}` : '';
  return sendEmail({ to: user.email, subject: `${brand} – Membership activated ✅`, html: layout('Annual Membership activated', `<p>Hi ${escapeHtml(user.name)},</p><p>Your payment was successful and your <strong>Annual Membership</strong> is now active${amountLabel ? ` (${escapeHtml(amountLabel)})` : ''}.</p><p>Plan: <strong>${escapeHtml(user.subscription?.plan || 'Annual Premium')}</strong><br>Valid until: <strong>${escapeHtml(user.subscription?.expiresDate || '')}</strong></p><p><a href="${clientUrl}" style="display:inline-block;padding:13px 20px;border-radius:10px;background:#16a34a;color:#fff;text-decoration:none;font-weight:700">Go to Dashboard</a></p>`), text: `Hi ${user.name}, your payment was successful and your Annual Membership is active until ${user.subscription?.expiresDate || ''}.` });
}

async function sendSubscriptionFailedEmail(user, reason) {
  return sendEmail({ to: user.email, subject: `${brand} – Payment failed`, html: layout('Payment could not be completed', `<p>Hi ${escapeHtml(user.name)},</p><p>We couldn't process your membership payment${reason ? `: <em>${escapeHtml(reason)}</em>` : '.'}</p><p>No amount has been deducted for this failed attempt. You can try again any time.</p><p><a href="${clientUrl}" style="display:inline-block;padding:13px 20px;border-radius:10px;background:#dc2626;color:#fff;text-decoration:none;font-weight:700">Try Again</a></p>`), text: `Hi ${user.name}, your membership payment failed${reason ? `: ${reason}` : '.'} You can retry any time at ${clientUrl}.` });
}

async function sendSubscriptionExpiredEmail(user) {
  return safeSendEmail({ to: user.email, subject: `${brand} – Your membership has expired`, html: layout('Membership expired', `<p>Hi ${escapeHtml(user.name)},</p><p>Your Annual Membership expired on <strong>${escapeHtml(user.subscription?.expiresDate || '')}</strong>. Renew now to keep access to your premium courses and certificates.</p><p><a href="${clientUrl}" style="display:inline-block;padding:13px 20px;border-radius:10px;background:#b91c1c;color:#fff;text-decoration:none;font-weight:700">Renew Membership</a></p>`), text: `Hi ${user.name}, your ThinkAHead membership expired on ${user.subscription?.expiresDate || ''}. Renew at ${clientUrl}.` });
}

async function sendSubscriptionExpiryReminderEmail(user, daysLeft) {
  if (!wantsNotifications(user)) return { skipped: true, reason: 'notifications-off' };
  return safeSendEmail({ to: user.email, subject: `${brand} – Membership expires in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`, html: layout('Your membership is expiring soon', `<p>Hi ${escapeHtml(user.name)},</p><p>Your Annual Membership expires on <strong>${escapeHtml(user.subscription?.expiresDate || '')}</strong> (${daysLeft} day${daysLeft === 1 ? '' : 's'} from now). Renew before it lapses to avoid losing access.</p><p><a href="${clientUrl}" style="display:inline-block;padding:13px 20px;border-radius:10px;background:#d97706;color:#fff;text-decoration:none;font-weight:700">Renew Now</a></p>`), text: `Hi ${user.name}, your membership expires in ${daysLeft} day(s) on ${user.subscription?.expiresDate || ''}. Renew at ${clientUrl}.` });
}

module.exports = {
  configured: isConfigured, isConfigured, verifyEmailTransport, ttlMinutes, hash, randomOtp, randomToken, sendEmail, safeSendEmail, sendAdminNotification,
  sendOtpEmail, sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendCourseCompletionEmail, sendContactAcknowledgement,
  sendCourseStartedEmail, sendCourseProgressReminderEmail, sendPasswordChangedEmail, sendCertificateAvailableEmail,
  sendSubscriptionSuccessEmail, sendSubscriptionFailedEmail, sendSubscriptionExpiredEmail, sendSubscriptionExpiryReminderEmail
};
