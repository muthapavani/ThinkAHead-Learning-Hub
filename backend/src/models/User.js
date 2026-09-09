const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  active: { type: Boolean, default: false },
  plan: { type: String, enum: ['Annual Premium', 'Monthly Premium', 'Free Trial'], default: 'Free Trial' },
  startDate: String,
  expiresDate: String,
  unlockedMonths: { type: Number, min: 1, max: 12, default: 1 },
  amount: { type: Number, min: 0, default: 0 },
  expiryReminderSentAt: { type: Date, default: null },
  expiredEmailSentAt: { type: Date, default: null }
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  phone: { type: String, trim: true, maxlength: 30 },
  passwordHash: { type: String, select: false },
  role: { type: String, enum: ['student', 'admin'], default: 'student', index: true },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  googleId: { type: String, index: true, sparse: true },
  emailVerified: { type: Boolean, default: false },
  welcomeEmailSentAt: { type: Date, default: null },
  avatar: { type: String, default: '' },
  profilePhoto: { type: Buffer, default: undefined },
  profilePhotoMimeType: { type: String, default: '' },
  bio: { type: String, maxlength: 1000, default: '' },
  emailNotifications: { type: Boolean, default: true },
  enrolledCourseIds: [{ type: String }],
  completedCourseIds: [{ type: String }],
  subscription: { type: subscriptionSchema, default: () => ({}) },
  streakDays: { type: Number, default: 0 },
  totalHours: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  unlockedBadgeIds: [{ type: String }],
  resetPasswordTokenHash: String,
  resetPasswordExpires: Date,
  emailVerificationTokenHash: String,
  // One-time token handed out after the email link is opened, so that tab can
  // start a real session instead of sending the person back to the login form.
  // Result of the programme-wide final assessment. Attempts are capped, so the
  // count has to survive on the learner record rather than in the browser.
  masterAssessment: {
    attempts: { type: Number, default: 0 },
    bestPercentage: { type: Number, default: 0 },
    lastPercentage: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    lastAttemptAt: Date
  },
  sessionClaimTokenHash: String,
  sessionClaimExpires: Date,
  // Secret handed only to the browser that submitted the registration form, so
  // that tab can be signed in once the email is verified on another device.
  pendingSessionTokenHash: String,
  pendingSessionExpires: Date,
  emailVerificationExpires: Date,
  emailVerificationOtpHash: String,
  emailVerificationOtpExpires: Date,
  passwordResetOtpHash: String,
  passwordResetOtpExpires: Date,
  otpAttempts: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
