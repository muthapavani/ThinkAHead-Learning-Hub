function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(err, req, res, next) {
  console.error(err);
  if (err.name === 'ValidationError') return res.status(400).json({ success: false, message: 'Validation failed.', errors: Object.values(err.errors).map(e => e.message) });
  if (err.code === 11000) return res.status(409).json({ success: false, message: 'A record with that value already exists.' });
  const status = err.status || 500;
  res.status(status).json({ success: false, message: status === 500 ? 'Internal server error.' : err.message, errors: err.details });
}
module.exports = { notFound, errorHandler };
