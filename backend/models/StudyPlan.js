const mongoose = require("mongoose");

const dayScheduleSchema = new mongoose.Schema({
  dayNumber: { type: Number, required: true },
  title: { type: String, required: true },
  dsaTask: { type: String, required: true },
  aptitudeTask: { type: String, required: true },
  coreCsTask: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

const studyPlanSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  targetRole: { type: String, default: "Software Development Engineer", trim: true },
  durationDays: { type: Number, enum: [7, 30], default: 7 },
  hoursPerDay: { type: Number, default: 3 },
  diagnostics: {
    dsaGaps: [{ type: String }],
    aptitudeGaps: [{ type: String }],
    resumeStatus: { type: String, default: "" },
    keyAdvice: { type: String, default: "" }
  },
  dailySchedule: [dayScheduleSchema],
  completionPercentage: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const StudyPlan = mongoose.model("StudyPlan", studyPlanSchema);

module.exports = StudyPlan;
