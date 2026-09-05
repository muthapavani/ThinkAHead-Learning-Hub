const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
  id: String, senderId: String, text: String, time: String, isSender: Boolean
}, { _id: false });
const chatThreadSchema = new mongoose.Schema({
  id: { type: String, unique: true, index: true },
  participantUserId: mongoose.Schema.Types.ObjectId,
  user: { id: String, name: String, avatar: String, role: String, online: Boolean },
  lastMessage: String, lastMessageTime: String, unreadCount: Number,
  messages: [messageSchema]
}, { timestamps: true });
module.exports = mongoose.model('ChatThread', chatThreadSchema);
