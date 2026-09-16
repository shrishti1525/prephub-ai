const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, default: "My Resume", trim: true },
  targetRole: { type: String, required: true, trim: true },
  resumeText: { type: String, required: true },
  atsScore: { type: Number, required: true, min: 0, max: 100 },
  strengths: [{ type: String }],
  missingKeywords: [{ type: String }],
  suggestions: [{ type: String }],
  categoryScores: {
    skillsMatch: { type: Number, default: 70 },
    experienceImpact: { type: Number, default: 70 },
    readability: { type: Number, default: 75 }
  },
  createdAt: { type: Date, default: Date.now }
});

const Resume = mongoose.model("Resume", resumeSchema);

module.exports = Resume;
