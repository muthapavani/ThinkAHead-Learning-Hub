const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { signToken, requireAuth } = require('../middleware/auth');
const { requireFields, validateEmail, validatePassword } = require('../utils/validate');
const { OAuth2Client } = require('google-auth-library');
const { safeSendEmail, sendAdminNotification, sendOtpEmail, sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail, sendPasswordChangedEmail, randomOtp, randomToken, hash, ttlMinutes } = require('../utils/email');
const googleClientId = (process.env.GOOGLE_CLIENT_ID || '').trim();
const googleClientIdValid = /^[0-9A-Za-z_-]+\.apps\.googleusercontent\.com$/.test(googleClientId);
const googleClient = googleClientIdValid ? new OAuth2Client(googleClientId) : null;

const router = express.Router();
const publicUser = user => ({
  id: user._id.toString(), name: user.name, email: user.email, phone: user.phone || '',
  role: user.role, avatar: user.profilePhoto?.length ? `data:${user.profilePhotoMimeType||'image/jpeg'};base64,${Buffer.from(user.profilePhoto).toString('base64')}` : '', bio: user.bio || '',
  enrolledCourseIds: user.enrolledCourseIds || [], completedCourseIds: user.completedCourseIds || [],
  subscription: user.subscription, streakDays: user.streakDays || 0, totalHours: user.totalHours || 0,
  points: user.points || 0, unlockedBadgeIds: user.unlockedBadgeIds || [], emailVerified: !!user.emailVerified, emailNotifications: user.emailNotifications !== false
});

router.post('/register', async (req,res,next) => {
  try {
    requireFields(req.body,['name','email','password']); validateEmail(req.body.email); validatePassword(req.body.password);
    const email=req.body.email.trim().toLowerCase();
    if(await User.findOne({email})) return res.status(409).json({success:false,message:'An account with this email already exists.'});
    const passwordHash=await bcrypt.hash(req.body.password,12);
    const user=await User.create({
      name:req.body.name.trim(), email, phone:req.body.phone?.trim() || '', passwordHash:passwordHash,
      role:'student', emailVerified:false, avatar:'',
      bio:'Enthusiastic learner developing human capabilities across industry and life.',
      enrolledCourseIds:['course-1','course-2'], completedCourseIds:[], subscription:{active:false,plan:'Free Trial',startDate:new Date().toISOString().slice(0,10),expiresDate:'',unlockedMonths:1,amount:0},
      streakDays:0,totalHours:0,points:0,unlockedBadgeIds:['badge-1']
    });
    // Verification is link-only: one email, one click. No OTP is issued here.
    const verificationToken=randomToken();
    // Secret for this browser only. It lets the tab that registered pick up a
    // session once the link is opened, even if that happens on another device.
    const pendingSessionToken=randomToken();
    user.pendingSessionTokenHash=hash(pendingSessionToken);
    user.pendingSessionExpires=new Date(Date.now()+Number(process.env.EMAIL_VERIFICATION_TTL_MINUTES||60)*60000);
    user.emailVerificationTokenHash=hash(verificationToken);
    user.emailVerificationExpires=new Date(Date.now()+Number(process.env.EMAIL_VERIFICATION_TTL_MINUTES||60)*60000);
    user.otpAttempts=0;
    await user.save();
    // Admins are told once, after the email is verified - an unverified signup
    // is not yet a real student, and every extra mail eats the daily quota.
    await sendVerificationEmail(user,verificationToken).catch(e => console.error('[auth/register] verification email failed:', e.message));
    // No session token is issued here on purpose. An account that has not
    // confirmed its email address must not be able to reach the dashboard,
    // and a token in localStorage would survive a page reload.
    res.status(201).json({success:true,message:'Account created. Open the verification link we just emailed you.',requiresEmailVerification:true,email:user.email,pendingToken:pendingSessionToken});
  } catch(e){next(e)}
});

router.post('/login', async (req,res,next)=>{
  try {
    requireFields(req.body,['email','password']); validateEmail(req.body.email);
    const email=req.body.email.trim().toLowerCase();
    const user=await User.findOne({email}).select('+passwordHash');
    if(!user || !user.passwordHash || !(await bcrypt.compare(req.body.password,user.passwordHash))) return res.status(401).json({success:false,message:'Invalid email or password.'});
    if(!user.emailVerified){
      // Correct password, but the email is still unconfirmed: send them to the
      // verification screen without a token so no session can be restored.
      return res.json({success:true,requiresEmailVerification:true,email:user.email,message:'Please verify your email address to continue.'});
    }
    res.json({success:true,token:signToken(user),user:publicUser(user),requiresEmailVerification:false});
  } catch(e){next(e)}
});

router.get('/me', requireAuth, async (req,res)=>res.json({success:true,user:publicUser(req.user)}));

router.post('/forgot-password', async (req,res,next)=>{
  try {
    requireFields(req.body,['email']); validateEmail(req.body.email);
    const email=req.body.email.trim().toLowerCase();
    const user=await User.findOne({email});
    // Always return the same response shape to avoid revealing whether an account exists.
    if(!user) return res.json({success:true,message:'If that email exists, a password reset code has been sent.'});
    // Use one clear reset flow: OTP first, then issue a short-lived reset token only
    // after the OTP is successfully verified. This avoids multiple reset links/tokens
    // invalidating each other when the user clicks "Forgot password" more than once.
    const otp=randomOtp();
    user.resetPasswordTokenHash=undefined;
    user.resetPasswordExpires=undefined;
    user.passwordResetOtpHash=hash(otp);
    user.passwordResetOtpExpires=new Date(Date.now()+ttlMinutes*60000);
    user.otpAttempts=0;
    await user.save();
    await sendOtpEmail(user,otp,'password-reset');
    res.json({success:true,message:'If that email exists, a password reset OTP has been sent.'});
  } catch(e){next(e)}
});

router.post('/verify-password-reset-otp', async (req,res,next)=>{
  try {
    requireFields(req.body,['email','otp']); validateEmail(req.body.email);
    const user=await User.findOne({email:req.body.email.trim().toLowerCase()});
    if(!user || !user.passwordResetOtpHash || !user.passwordResetOtpExpires || user.passwordResetOtpExpires<=new Date()) return res.status(400).json({success:false,message:'OTP is invalid or expired.'});
    if((user.otpAttempts||0)>=5) return res.status(429).json({success:false,message:'Too many OTP attempts. Please request a new code.'});
    if(hash(String(req.body.otp).trim())!==user.passwordResetOtpHash){user.otpAttempts=(user.otpAttempts||0)+1;await user.save();return res.status(400).json({success:false,message:'OTP is invalid or expired.'});}
    const token=randomToken();
    user.resetPasswordTokenHash=hash(token);
    user.resetPasswordExpires=new Date(Date.now()+10*60000);
    user.passwordResetOtpHash=undefined; user.passwordResetOtpExpires=undefined; user.otpAttempts=0;
    await user.save();
    res.json({success:true,message:'OTP verified. You can now set a new password.',resetToken:token});
  } catch(e){next(e)}
});

router.post('/resend-password-reset-otp', async (req,res,next)=>{
  try {
    requireFields(req.body,['email']); validateEmail(req.body.email);
    const user=await User.findOne({email:req.body.email.trim().toLowerCase()});
    if(user){const otp=randomOtp();user.passwordResetOtpHash=hash(otp);user.passwordResetOtpExpires=new Date(Date.now()+ttlMinutes*60000);user.otpAttempts=0;await user.save();await sendOtpEmail(user,otp,'password-reset');}
    res.json({success:true,message:'If that email exists, a new reset OTP has been sent.'});
  } catch(e){next(e)}
});

router.post('/reset-password', async (req,res,next)=>{
  try {
    requireFields(req.body,['email','token','newPassword']); validateEmail(req.body.email); validatePassword(req.body.newPassword);
    const hashToken=hash(req.body.token);
    const user=await User.findOne({email:req.body.email.trim().toLowerCase(),resetPasswordTokenHash:hashToken,resetPasswordExpires:{$gt:new Date()}}).select('+passwordHash');
    if(!user) return res.status(400).json({success:false,message:'Reset token is invalid or expired.'});
    user.passwordHash=await bcrypt.hash(req.body.newPassword,12); user.resetPasswordTokenHash=undefined; user.resetPasswordExpires=undefined; user.passwordResetOtpHash=undefined; user.passwordResetOtpExpires=undefined; user.otpAttempts=0; await user.save();
    void sendPasswordChangedEmail(user);
    res.json({success:true,message:'Password updated successfully.'});
  } catch(e){next(e)}
});

// The old POST /verify-email endpoint was removed. It flipped emailVerified to
// true for any authenticated caller without checking a token or an OTP, so a
// single request could bypass verification entirely. Verification now happens
// only through /verify-email-link, the link sent in the email.

// Lets the verification screen notice that the person already used the link in
// their email, so it can stop asking for an OTP. Never reveals whether an
// address is registered: unknown addresses simply come back as not verified.
router.get('/verification-status', async (req,res,next)=>{
  try {
    const email=String(req.query.email||'').trim().toLowerCase();
    if(!email) return res.json({success:true,verified:false});
    const user=await User.findOne({email}).select('emailVerified').lean();
    res.json({success:true,verified:Boolean(user?.emailVerified)});
  } catch(e){next(e)}
});

// Exchanges the one-time token from the verification link for a session. The
// token is single use, expires in 10 minutes, and only ever reaches the person
// who opened the link in their own inbox.
router.post('/claim-session', async (req,res,next)=>{
  try {
    const token=String(req.body.token||'').trim();
    if(!token) return res.status(400).json({success:false,message:'Missing token.'});
    const user=await User.findOne({sessionClaimTokenHash:hash(token),sessionClaimExpires:{$gt:new Date()}});
    if(!user) return res.status(400).json({success:false,message:'This link has already been used or has expired. Please sign in.'});
    user.sessionClaimTokenHash=undefined;user.sessionClaimExpires=undefined;await user.save();
    res.json({success:true,token:signToken(user),user:publicUser(user)});
  } catch(e){next(e)}
});

// The frontend calls this with the token from the email. Keeping the browser on
// the Vercel domain avoids the Safe Browsing interstitial that shared hosting
// subdomains such as onrender.com sometimes trigger.
router.post('/verify-email-token', async (req,res,next)=>{
  try {
    const raw=String(req.body.token||'').trim();
    if(!raw) return res.status(400).json({success:false,message:'Verification token is required.'});
    const user=await User.findOne({emailVerificationTokenHash:hash(raw),emailVerificationExpires:{$gt:new Date()}});
    if(!user) return res.status(400).json({success:false,message:'This verification link is invalid or has expired. Please request a new one.'});
    user.emailVerified=true;user.emailVerificationTokenHash=undefined;user.emailVerificationExpires=undefined;user.emailVerificationOtpHash=undefined;user.emailVerificationOtpExpires=undefined;user.otpAttempts=0;await user.save();
    await Promise.all([
      sendWelcomeEmail(user).catch(e=>console.error('[auth/verify] welcome email failed:',e.message)),
      sendAdminNotification('New user registered', `<p>A new student has completed registration and verified their email.</p><table style="margin:16px auto;text-align:left;font-size:14px"><tr><td style="padding:4px 12px 4px 0;color:#64748b">Name</td><td><strong>${user.name}</strong></td></tr><tr><td style="padding:4px 12px 4px 0;color:#64748b">Email</td><td>${user.email}</td></tr><tr><td style="padding:4px 12px 4px 0;color:#64748b">Phone</td><td>${user.phone||'-'}</td></tr><tr><td style="padding:4px 12px 4px 0;color:#64748b">Signed up via</td><td>${user.authProvider==='google'?'Google':'Email'}</td></tr><tr><td style="padding:4px 12px 4px 0;color:#64748b">Time</td><td>${new Date().toLocaleString('en-IN',{timeZone:process.env.EMAIL_TIMEZONE||'Asia/Kolkata'})}</td></tr></table>`, `New user registered: ${user.name} (${user.email}).`)
    ]);
    res.json({success:true,token:signToken(user),user:publicUser(user)});
  } catch(e){next(e)}
});

// Polled by the tab that registered. While the email is unverified it simply
// reports back; once the link has been opened - on this device or any other -
// it trades the browser's own secret for a session. The secret never leaves
// that browser, so nobody who merely knows the address can sign in.
router.post('/await-verification', async (req,res,next)=>{
  try {
    const pendingToken=String(req.body.pendingToken||'').trim();
    if(!pendingToken) return res.json({success:true,verified:false});
    const user=await User.findOne({pendingSessionTokenHash:hash(pendingToken),pendingSessionExpires:{$gt:new Date()}});
    if(!user) return res.json({success:true,verified:false});
    if(!user.emailVerified) return res.json({success:true,verified:false});
    user.pendingSessionTokenHash=undefined;user.pendingSessionExpires=undefined;await user.save();
    res.json({success:true,verified:true,token:signToken(user),user:publicUser(user)});
  } catch(e){next(e)}
});

router.get('/verify-email-link', async (req,res,next)=>{
  try {
    if(!req.query.token) return res.status(400).send('Verification token is required.');
    const tokenHash=hash(String(req.query.token));
    const user=await User.findOne({emailVerificationTokenHash:tokenHash,emailVerificationExpires:{$gt:new Date()}});
    if(!user) return res.status(400).send('This verification link is invalid or expired. Please request a new verification email.');
    user.emailVerified=true;user.emailVerificationTokenHash=undefined;user.emailVerificationExpires=undefined;user.emailVerificationOtpHash=undefined;user.emailVerificationOtpExpires=undefined;user.otpAttempts=0;await user.save();
    await Promise.all([sendWelcomeEmail(user),sendAdminNotification('New user registered', `<p>A new student has completed registration and verified their email.</p><table style="margin:16px auto;text-align:left;font-size:14px"><tr><td style="padding:4px 12px 4px 0;color:#64748b">Name</td><td><strong>${user.name}</strong></td></tr><tr><td style="padding:4px 12px 4px 0;color:#64748b">Email</td><td>${user.email}</td></tr><tr><td style="padding:4px 12px 4px 0;color:#64748b">Phone</td><td>${user.phone||'-'}</td></tr><tr><td style="padding:4px 12px 4px 0;color:#64748b">Signed up via</td><td>${user.authProvider==='google'?'Google':'Email'}</td></tr><tr><td style="padding:4px 12px 4px 0;color:#64748b">Time</td><td>${new Date().toLocaleString('en-IN',{timeZone:process.env.EMAIL_TIMEZONE||'Asia/Kolkata'})}</td></tr></table>`, `New user registered: ${user.name} (${user.email}).`)]);
    // Hand this tab a one-time claim token so it can open the dashboard already
    // signed in, instead of bouncing the person back to the login form.
    const claim=randomToken();
    user.sessionClaimTokenHash=hash(claim);
    user.sessionClaimExpires=new Date(Date.now()+10*60000);
    await user.save();
    const target=`${(process.env.CLIENT_URL||'http://localhost:3000').split(',')[0].trim().replace(/\/$/,'')}/?verified=1&claim=${encodeURIComponent(claim)}`;
    res.redirect(302, target);
  } catch(e){next(e)}
});

// Email verification is link-only, so there is no OTP endpoint here. The
// password-reset flow keeps its own OTP routes below.

router.post('/resend-verification', async (req,res,next)=>{
  try {
    requireFields(req.body,['email']);validateEmail(req.body.email);
    const user=await User.findOne({email:req.body.email.trim().toLowerCase()});
    if(user && !user.emailVerified){const token=randomToken();user.emailVerificationTokenHash=hash(token);user.emailVerificationExpires=new Date(Date.now()+Number(process.env.EMAIL_VERIFICATION_TTL_MINUTES||60)*60000);user.otpAttempts=0;await user.save();await sendVerificationEmail(user,token);}
    res.json({success:true,message:'If the account exists, a new verification email has been sent.'});
  } catch(e){next(e)}
});

router.post('/request-otp', async (req,res,next)=>{
  try {
    requireFields(req.body,['email']);validateEmail(req.body.email);
    const user=await User.findOne({email:req.body.email.trim().toLowerCase()});
    if(user){const otp=randomOtp();user.emailVerificationOtpHash=hash(otp);user.emailVerificationOtpExpires=new Date(Date.now()+ttlMinutes*60000);user.otpAttempts=0;await user.save();await sendOtpEmail(user,otp,'login-otp');}
    res.json({success:true,message:'If the account exists, an OTP has been sent.'});
  } catch(e){next(e)}
});

router.post('/verify-otp', async (req,res,next)=>{
  try {
    requireFields(req.body,['email','otp']); validateEmail(req.body.email);
    const user=await User.findOne({email:req.body.email.trim().toLowerCase()});
    if(!user || !user.emailVerificationOtpHash || !user.emailVerificationOtpExpires || user.emailVerificationOtpExpires<=new Date()) return res.status(400).json({success:false,message:'OTP is invalid or expired.'});
    if((user.otpAttempts||0)>=5) return res.status(429).json({success:false,message:'Too many OTP attempts. Please request a new code.'});
    if(hash(String(req.body.otp).trim())!==user.emailVerificationOtpHash){user.otpAttempts=(user.otpAttempts||0)+1;await user.save();return res.status(400).json({success:false,message:'OTP is invalid or expired.'});}
    user.emailVerified=true;user.emailVerificationOtpHash=undefined;user.emailVerificationOtpExpires=undefined;user.emailVerificationTokenHash=undefined;user.emailVerificationExpires=undefined;user.otpAttempts=0;await user.save();
    void sendWelcomeEmail(user);void sendAdminNotification('New user registered', `<p>A new student has completed registration and verified their email.</p><table style="margin:16px auto;text-align:left;font-size:14px"><tr><td style="padding:4px 12px 4px 0;color:#64748b">Name</td><td><strong>${user.name}</strong></td></tr><tr><td style="padding:4px 12px 4px 0;color:#64748b">Email</td><td>${user.email}</td></tr><tr><td style="padding:4px 12px 4px 0;color:#64748b">Phone</td><td>${user.phone||'-'}</td></tr><tr><td style="padding:4px 12px 4px 0;color:#64748b">Signed up via</td><td>${user.authProvider==='google'?'Google':'Email'}</td></tr><tr><td style="padding:4px 12px 4px 0;color:#64748b">Time</td><td>${new Date().toLocaleString('en-IN',{timeZone:process.env.EMAIL_TIMEZONE||'Asia/Kolkata'})}</td></tr></table>`, `New user registered: ${user.name} (${user.email}).`);
    res.json({success:true,message:'OTP verified successfully.',user:publicUser(user),token:signToken(user)});
  } catch(e){next(e)}
});

// Google Identity Services ID token verification. The application JWT is issued only after server-side verification.
router.post('/google', async (req,res,next)=>{
  try {
    if(!googleClientId) return res.status(503).json({success:false,message:'Google Sign-In is not configured. Add GOOGLE_CLIENT_ID to backend/.env.'});
    if(!googleClientIdValid) return res.status(503).json({success:false,message:'GOOGLE_CLIENT_ID is invalid. Use the same Web OAuth Client ID ending in .apps.googleusercontent.com in backend/.env and frontend/.env.'});
    if(!req.body.credential) return res.status(400).json({success:false,message:'Google credential is required.'});
    const ticket=await googleClient.verifyIdToken({idToken:req.body.credential,audience:googleClientId});
    const payload=ticket.getPayload();
    if(!payload?.sub || !payload.email || payload.email_verified!==true) return res.status(401).json({success:false,message:'Google account could not be verified.'});
    const email=payload.email.toLowerCase();
    let user=await User.findOne({$or:[{googleId:payload.sub},{email}]});
    let isNewGoogleUser=false;
    if(!user){
      user=await User.create({name:payload.name||email.split('@')[0],email,googleId:payload.sub,authProvider:'google',emailVerified:true,avatar:'',bio:'',enrolledCourseIds:['course-1','course-2'],completedCourseIds:[],subscription:{active:false,plan:'Free Trial',startDate:new Date().toISOString().slice(0,10),expiresDate:'',unlockedMonths:1,amount:0},streakDays:0,totalHours:0,points: 0,unlockedBadgeIds:['badge-1']});
      isNewGoogleUser=true;
    } else {
      if(!user.googleId) user.googleId=payload.sub; user.authProvider='google'; user.emailVerified=true; if(payload.name) user.name=payload.name; await user.save();
    }
    // Google accounts are already verified by Google. Send the welcome email once.
    // Existing Google users created before this fix have no welcomeEmailSentAt, so they
    // will receive the missing welcome email on their next successful Google sign-in.
    if(!user.welcomeEmailSentAt){
      try {
        await sendWelcomeEmail(user);
        user.welcomeEmailSentAt=new Date();
        await user.save();
        console.log(`[auth/google] Welcome email successfully sent to ${user.email}`);
      } catch(emailError) {
        // Do not block a valid Google login, but make the exact SMTP error visible.
        console.error(`[auth/google] Welcome email FAILED for ${user.email}:`, emailError.message);
      }
    }
    if(isNewGoogleUser){
      // Google accounts arrive already verified, so this is the one notification.
      void sendAdminNotification('New user registered', `<p>A new student has joined using Google Sign-In. Google accounts are verified on arrival.</p><table style="margin:16px auto;text-align:left;font-size:14px"><tr><td style="padding:4px 12px 4px 0;color:#64748b">Name</td><td><strong>${user.name}</strong></td></tr><tr><td style="padding:4px 12px 4px 0;color:#64748b">Email</td><td>${user.email}</td></tr><tr><td style="padding:4px 12px 4px 0;color:#64748b">Signed up via</td><td>Google</td></tr><tr><td style="padding:4px 12px 4px 0;color:#64748b">Time</td><td>${new Date().toLocaleString('en-IN',{timeZone:process.env.EMAIL_TIMEZONE||'Asia/Kolkata'})}</td></tr></table>`, `New user registered via Google: ${user.name} (${user.email}).`);
    }
    res.json({success:true,token:signToken(user),user:publicUser(user)});
  } catch(e){
    if(e?.message?.toLowerCase?.().includes('token') || e?.message?.toLowerCase?.().includes('audience') || e?.code === 'ERR_JWT_EXPIRED') return res.status(401).json({success:false,message:'Google credential is invalid or expired. Please try Google Sign-In again.'});
    next(e);
  }
});

module.exports=router;
