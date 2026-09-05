const mongoose = require('mongoose');
const contactSchema = new mongoose.Schema({
  name: String, email: String, message: String, status: { type: String, default: 'new' }
}, { timestamps: true });
const newsletterSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true, trim: true }
}, { timestamps: true });
module.exports = {
  Contact: mongoose.model('Contact', contactSchema),
  Newsletter: mongoose.model('Newsletter', newsletterSchema)
};
