const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  id: { type: String, unique: true, index: true },
  certificateNumber: { type: String, unique: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  studentName: String,
  studentEmail: String,
  courseId: String,
  courseName: String,
  issueDate: String,
  qrCodeUrl: String,
  directorName: String,
  founderName: String,
  verified: { type: Boolean, default: true },
  overallAssessmentScore: { type: Number, default: 0 },
  // Score from the final assessment, printed on the certificate itself.
  finalAssessmentScore: { type: Number, default: 0 },
  finalAssessmentDate: String,
  assessmentScores: [{ courseId: String, courseTitle: String, score: Number, total: Number, percentage: Number }]
}, { timestamps: true });
module.exports = mongoose.model('Certificate', certificateSchema);
