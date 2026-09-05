const mongoose = require('mongoose');
const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  category: String, title: String, message: String, time: String,
  read: { type: Boolean, default: false }, actionUrl: String,
  source: { type: String, default: 'system' }
}, { timestamps: true });
module.exports = mongoose.model('Notification', notificationSchema);
