const jwt = require('jsonwebtoken');
const User = require('../models/User');

function signToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
}

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ success: false, message: 'Authentication required.' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ success: false, message: 'Session is no longer valid.' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ success: false, message: 'You do not have permission for this resource.' });
    next();
  };
}

// Blocks any account whose email address has not been confirmed yet. Google
// accounts are verified by Google itself, so they always pass. Must run after
// requireAuth, which is what puts req.user in place.
function requireVerifiedEmail(req, res, next) {
  if (req.user && req.user.emailVerified !== true) {
    return res.status(403).json({
      success: false,
      code: 'EMAIL_NOT_VERIFIED',
      email: req.user.email,
      message: 'Please verify your email address before continuing.'
    });
  }
  next();
}

module.exports = { signToken, requireAuth, requireRole, requireVerifiedEmail };
