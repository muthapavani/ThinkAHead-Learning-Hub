const mongoose = require('mongoose');
const replySchema = new mongoose.Schema({
  id: String, author: { userId: mongoose.Schema.Types.ObjectId, name: String, role: String, avatar: String },
  content: String, createdAt: String, likes: { type: Number, default: 0 }
}, { _id: false });
const forumPostSchema = new mongoose.Schema({
  id: { type: String, unique: true, index: true },
  author: { userId: mongoose.Schema.Types.ObjectId, name: String, role: String, avatar: String },
  title: String, category: String, content: String, createdAt: String,
  likes: { type: Number, default: 0 }, likedByUserIds: [{ type: mongoose.Schema.Types.ObjectId }],
  replies: [replySchema]
}, { timestamps: true });
module.exports = mongoose.model('ForumPost', forumPostSchema);
