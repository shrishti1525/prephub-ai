const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    topic: { type: String, required: true },
    difficulty: { type: String, required: true },
    userId: { type: String, required: true },
    dateAdded: { type: Date, default: Date.now }
});

const Problem = mongoose.model("Problem", problemSchema);

module.exports = Problem;