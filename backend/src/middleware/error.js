function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(err, req, res, next) {
  console.error(err);
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    // Name the offending field in the message itself - the client usually only
    // shows `message`, and "Validation failed." alone is impossible to act on.
    return res.status(400).json({ success: false, message: `Validation failed: ${errors.join(' | ')}`, errors });
  }
  if (err.name === 'CastError') return res.status(400).json({ success: false, message: `Invalid value for "${err.path}": expected ${err.kind}.` });
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'value';
    return res.status(409).json({ success: false, message: `A record with that ${field} already exists.` });
  }
  const status = err.status || 500;
  res.status(status).json({ success: false, message: status === 500 ? 'Internal server error.' : err.message, errors: err.details });
}
module.exports = { notFound, errorHandler };
