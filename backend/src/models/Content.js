const mongoose = require('mongoose');
const contentSchema = new mongoose.Schema({
  kind: { type: String, enum: ['faq','testimonial'], index: true },
  payload: mongoose.Schema.Types.Mixed
}, { timestamps: true });
module.exports = mongoose.model('Content', contentSchema);
