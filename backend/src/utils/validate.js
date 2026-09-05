const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function requireFields(body, fields) {
  const errors = fields.filter(f => body[f] === undefined || body[f] === null || String(body[f]).trim() === '').map(f => `${f} is required.`);
  if (errors.length) {
    const err = new Error('Validation failed.');
    err.status = 400; err.details = errors; throw err;
  }
}
function validateEmail(email) {
  if (!emailRegex.test(String(email || '').toLowerCase())) { const err = new Error('Please provide a valid email address.'); err.status=400; throw err; }
}
function validatePassword(password) {
  if (!password || password.length < 8) { const err = new Error('Password must be at least 8 characters.'); err.status=400; throw err; }
}
module.exports = { requireFields, validateEmail, validatePassword };
