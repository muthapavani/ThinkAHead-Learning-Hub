const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  courseId: { type: String, required: true, index: true },
  percent: { type: Number, min: 0, max: 100, default: 0 },
  completedLessonIds: [String],
  currentLessonId: String,
  notes: { type: Map, of: String, default: {} },
  assignmentSubmissions: { type: Map, of: new mongoose.Schema({
    submittedAt: String, fileContent: String, fileName: String, textResponse: String,
    status: { type: String, enum: ['submitted','graded'], default: 'submitted' },
    score: Number, feedback: String
  }, { _id: false }), default: {} },
  quizResult: {
    score: Number, total: Number, percentage: Number, passed: Boolean, takenAt: String
  },
  startingQuizResult: {
    score: Number, total: Number, percentage: Number, passed: Boolean, takenAt: String
  },
  isCompleted: { type: Boolean, default: false },
  completedDate: String,
  certificateEarned: { type: Boolean, default: false },
  certificateId: String,
  progressReminderSentAt: { type: Date, default: null }
}, { timestamps: true });

progressSchema.index({ userId: 1, courseId: 1 }, { unique: true });
module.exports = mongoose.model('Progress', progressSchema);
