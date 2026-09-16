const mongoose = require("mongoose");

const aptitudeAttemptSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  category: { type: String, required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  percentage: { type: Number, required: true },
  timeTakenSeconds: { type: Number, default: 0 },
  dateTaken: { type: Date, default: Date.now }
});

const AptitudeAttempt = mongoose.model("AptitudeAttempt", aptitudeAttemptSchema);

module.exports = AptitudeAttempt;
