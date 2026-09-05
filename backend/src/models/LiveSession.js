const mongoose = require('mongoose');
const liveSessionSchema = new mongoose.Schema({
  id: { type: String, unique: true, index: true }, title: String,
  speaker: { name: String, title: String, avatar: String },
  category: String, date: String, time: String, duration: String,
  status: { type: String, enum: ['upcoming','recorded'] },
  joinUrl: String, replayUrl: String, registeredCount: { type: Number, default: 0 },
  registeredUserIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  description: String
}, { timestamps: true });
module.exports = mongoose.model('LiveSession', liveSessionSchema);
