const mongoose = require("mongoose");

const roundSchema = new mongoose.Schema({
  roundName: { type: String, required: true },
  questionsAsked: { type: String, default: "" },
  experience: { type: String, default: "" }
});

const interviewExperienceSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  authorName: { type: String, default: "Anonymous Candidate", trim: true },
  company: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  batchYear: { type: String, default: "2026" },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    default: "Medium"
  },
  verdict: {
    type: String,
    enum: ["Selected", "Rejected", "Pending"],
    default: "Selected"
  },
  rounds: [roundSchema],
  tips: { type: String, default: "" },
  upvotes: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

const InterviewExperience = mongoose.model(
  "InterviewExperience",
  interviewExperienceSchema
);

module.exports = InterviewExperience;
