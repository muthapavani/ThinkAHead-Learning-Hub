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
    const verificationToken=randomToken();
    const verificationOtp=randomOtp();
    user.emailVerificationTokenHash=hash(verificationToken);
    user.emailVerificationExpires=new Date(Date.now()+Number(process.env.EMAIL_VERIFICATION_TTL_MINUTES||60)*60000);
    user.emailVerificationOtpHash=hash(verificationOtp);
    user.emailVerificationOtpExpires=new Date(Date.now()+ttlMinutes*60000);
    user.otpAttempts=0;
    await user.save();
    await Promise.all([
      sendVerificationEmail(user,verificationToken).catch(e => console.error('[auth/register] verification email failed:', e.message)),
      sendOtpEmail(user,verificationOtp,'verification').catch(e => console.error('[auth/register] verification OTP email failed:', e.message)),
      sendAdminNotification('New student registration', `<p><strong>${user.name}</strong> registered with ${user.email}.</p><p>Registration time: ${new Date().toLocaleString('en-IN',{timeZone:process.env.EMAIL_TIMEZONE||'Asia/Kolkata'})}</p>`, `New student registration: ${user.name} (${user.email}).`)
    ]);
    res.status(201).json({success:true,message:'Account created. Check your email for the verification link or OTP.',requiresEmailVerification:true,token:signToken(user),user:publicUser(user)});
  } catch(e){next(e)}
});

router.post('/login', async (req,res,next)=>{
  try {
    requireFields(req.body,['email','password']); validateEmail(req.body.email);
    const email=req.body.email.trim().toLowerCase();
    const user=await User.findOne({email}).select('+passwordHash');
    if(!user || !user.passwordHash || !(await bcrypt.compare(req.body.password,user.passwordHash))) return res.status(401).json({success:false,message:'Invalid email or password.'});
    const loginResult={success:true,token:signToken(user),user:publicUser(user),requiresEmailVerification:!user.emailVerified};
    res.json(loginResult);
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

router.post('/verify-email', requireAuth, async (req,res,next)=>{
  try {
    if(req.user.emailVerified) return res.json({success:true,user:publicUser(req.user),alreadyVerified:true});
    const user=await User.findById(req.user._id);
    if(!user.emailVerified){user.emailVerified=true;user.emailVerificationTokenHash=undefined;user.emailVerificationExpires=undefined;user.emailVerificationOtpHash=undefined;user.emailVerificationOtpExpires=undefined;user.otpAttempts=0;await user.save();void sendWelcomeEmail(user);void sendAdminNotification('Student email verified', `<p><strong>${user.name}</strong> verified ${user.email}.</p>`, `Student email verified: ${user.name} (${user.email}).`);}
    res.json({success:true,user:publicUser(user)});
  } catch(e){next(e)}
});

router.get('/verify-email-link', async (req,res,next)=>{
  try {
    if(!req.query.token) return res.status(400).send('Verification token is required.');
    const tokenHash=hash(String(req.query.token));
    const user=await User.findOne({emailVerificationTokenHash:tokenHash,emailVerificationExpires:{$gt:new Date()}});
    if(!user) return res.status(400).send('This verification link is invalid or expired. Please request a new verification email.');
    user.emailVerified=true;user.emailVerificationTokenHash=undefined;user.emailVerificationExpires=undefined;user.emailVerificationOtpHash=undefined;user.emailVerificationOtpExpires=undefined;user.otpAttempts=0;await user.save();
    await Promise.all([sendWelcomeEmail(user),sendAdminNotification('Student email verified', `<p><strong>${user.name}</strong> verified ${user.email}.</p>`, `Student email verified: ${user.name} (${user.email}).`)]);
    res.send(`<html><body style="font-family:Arial;text-align:center;padding:60px"><h2>Email verified successfully</h2><p>You can return to ThinkAHead Learning Hub and continue.</p><a href="${process.env.CLIENT_URL||'http://localhost:3000'}" style="display:inline-block;padding:12px 18px;background:#2563eb;color:white;text-decoration:none;border-radius:8px">Open Learning Hub</a></body></html>`);
  } catch(e){next(e)}
});

router.post('/verify-email-otp', async (req,res,next)=>{
  try {
    requireFields(req.body,['email','otp']);validateEmail(req.body.email);
    const user=await User.findOne({email:req.body.email.trim().toLowerCase()});
    if(!user || user.emailVerified || !user.emailVerificationOtpHash || !user.emailVerificationOtpExpires || user.emailVerificationOtpExpires<=new Date()) return res.status(400).json({success:false,message:'OTP is invalid or expired.'});
    if((user.otpAttempts||0)>=5)return res.status(429).json({success:false,message:'Too many OTP attempts. Please request a new code.'});
    if(hash(String(req.body.otp).trim())!==user.emailVerificationOtpHash){user.otpAttempts=(user.otpAttempts||0)+1;await user.save();return res.status(400).json({success:false,message:'OTP is invalid or expired.'});}
    user.emailVerified=true;user.emailVerificationTokenHash=undefined;user.emailVerificationExpires=undefined;user.emailVerificationOtpHash=undefined;user.emailVerificationOtpExpires=undefined;user.otpAttempts=0;await user.save();
    await Promise.all([sendWelcomeEmail(user),sendAdminNotification('Student email verified', `<p><strong>${user.name}</strong> verified ${user.email}.</p>`, `Student email verified: ${user.name} (${user.email}).`)]);
    res.json({success:true,message:'Email verified successfully.',user:publicUser(user)});
  } catch(e){next(e)}
});

router.post('/resend-verification', async (req,res,next)=>{
  try {
    requireFields(req.body,['email']);validateEmail(req.body.email);
    const user=await User.findOne({email:req.body.email.trim().toLowerCase()});
    if(user && !user.emailVerified){const token=randomToken();const otp=randomOtp();user.emailVerificationTokenHash=hash(token);user.emailVerificationExpires=new Date(Date.now()+Number(process.env.EMAIL_VERIFICATION_TTL_MINUTES||60)*60000);user.emailVerificationOtpHash=hash(otp);user.emailVerificationOtpExpires=new Date(Date.now()+ttlMinutes*60000);user.otpAttempts=0;await user.save();await Promise.all([sendVerificationEmail(user,token),sendOtpEmail(user,otp,'verification')]);}
    res.json({success:true,message:'If the account exists, a new verification email and OTP have been sent.'});
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
    void sendWelcomeEmail(user);void sendAdminNotification('Student email verified', `<p><strong>${user.name}</strong> verified ${user.email}.</p>`, `Student email verified: ${user.name} (${user.email}).`);
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
      void sendAdminNotification('New student registration', `<p><strong>${user.name}</strong> registered using Google with ${user.email}.</p>`, `New Google student registration: ${user.name} (${user.email}).`);
    }
    res.json({success:true,token:signToken(user),user:publicUser(user)});
  } catch(e){
    if(e?.message?.toLowerCase?.().includes('token') || e?.message?.toLowerCase?.().includes('audience') || e?.code === 'ERR_JWT_EXPIRED') return res.status(401).json({success:false,message:'Google credential is invalid or expired. Please try Google Sign-In again.'});
    next(e);
  }
});

module.exports=router;
