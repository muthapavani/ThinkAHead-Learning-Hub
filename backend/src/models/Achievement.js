const mongoose = require('mongoose');
const achievementSchema = new mongoose.Schema({
  id: { type: String, unique: true, index: true }, title: String, description: String,
  icon: String, category: String, unlocked: Boolean, unlockedAt: String
}, { timestamps: true });
module.exports = mongoose.model('Achievement', achievementSchema);
