const mongoose = require('mongoose');

// The single programme-wide assessment taken after every course is finished.
// Completing it is what issues the certificate, and the score is printed on
// it. There is no pass mark - the score is a record, not a hurdle.
// Stored as one document with a fixed key so it can be fetched without an id.
const masterQuizSchema = new mongoose.Schema({
  key: { type: String, default: 'master', unique: true, index: true },
  title: { type: String, default: 'Final Assessment' },
  description: { type: String, default: '' },
  durationMinutes: { type: Number, default: 30 },
  maxAttempts: { type: Number, default: 3 },
  published: { type: Boolean, default: false },
  questions: [{
    id: String,
    question: String,
    options: [String],
    correctAnswer: Number,
    explanation: String
  }]
}, { timestamps: true });

masterQuizSchema.statics.load = async function () {
  let doc = await this.findOne({ key: 'master' });
  if (!doc) doc = await this.create({ key: 'master' });
  return doc;
};

module.exports = mongoose.model('MasterQuiz', masterQuizSchema);
