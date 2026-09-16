const mongoose = require("mongoose");

const aptitudeQuestionSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ["Quantitative", "Logical", "Verbal"],
    required: true
  },
  topic: { type: String, required: true, trim: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOptionIndex: { type: Number, required: true },
  explanation: { type: String, default: "" },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    default: "Medium"
  },
  createdAt: { type: Date, default: Date.now }
});

const AptitudeQuestion = mongoose.model("AptitudeQuestion", aptitudeQuestionSchema);

module.exports = AptitudeQuestion;
