const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  topic: { type: String, required: true, trim: true },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    default: "Easy"
  },
  status: {
    type: String,
    enum: ["Solved", "In Progress", "Revision"],
    default: "Solved"
  },
  problemUrl: { type: String, default: "" },
  notes: { type: String, default: "" },
  starred: { type: Boolean, default: false },
  userId: { type: String, required: true },
  dateAdded: { type: Date, default: Date.now }
});

const Problem = mongoose.model("Problem", problemSchema);

module.exports = Problem;