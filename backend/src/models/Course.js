const mongoose = require('mongoose');

// Declared as its own schema on purpose. Written inline, the "type" key would
// be read by Mongoose as a SchemaType declaration, turning the whole entry into
// a plain String - which made every course save fail with
// "Cast to [string] failed ... at path resources.0".
const resourceSchema = new mongoose.Schema({
  id: String,
  title: String,
  type: String,
  fileName: String,
  fileSize: String,
  category: String,
  downloadUrl: String,
  contentSummary: String,
  published: { type: Boolean, default: false }
}, { _id: false });

const courseSchema = new mongoose.Schema({
  id: { type: String, unique: true, index: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: String,
  shortDescription: String,
  fullDescription: String,
  thumbnail: String,
  bannerImage: String,
  totalDuration: String,
  lessonsCount: Number,
  isFree: Boolean,
  monthUnlock: Number,
  level: String,
  rating: Number,
  reviewsCount: Number,
  instructor: {
    name: String, title: String, avatar: String, experience: String
  },
  modules: [{
    id: String,
    title: String,
    lessons: [{
      id: String, title: String, duration: String, durationSeconds: Number,
      videoUrl: String, videoUrls: { type: [String], default: [] }, description: String, keyPoints: [String], order: Number
    }]
  }],
  resources: [resourceSchema],
  assignments: [{
    id: String, title: String, dueDate: String, points: Number, description: String,
    guidelines: [String]
  }],
  // Taken before any lesson, purely to gauge the learner's starting level.
  // It is never gated and never affects completion.
  startingQuiz: {
    id: String, title: String, durationMinutes: Number, passingScorePercentage: Number,
    questions: [{
      id: String, question: String, options: [String], correctAnswer: Number, explanation: String
    }]
  },
  // The final quiz. Passing it completes the course and earns the certificate.
  quiz: {
    id: String, title: String, durationMinutes: Number, passingScorePercentage: Number,
    questions: [{
      id: String, question: String, options: [String], correctAnswer: Number, explanation: String
    }]
  },
  learningOutcomes: [String]
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
