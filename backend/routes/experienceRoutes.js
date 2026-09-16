const express = require("express");
const InterviewExperience = require("../models/InterviewExperience");
const User = require("../models/User");
const verifyToken = require("../middleware/auth");

const router = express.Router();

// GET /api/experiences - List community interview experiences
router.get("/", verifyToken, async (req, res) => {
  try {
    const { company, role, verdict, search } = req.query;
    const query = {};

    if (company) query.company = { $regex: company, $options: "i" };
    if (role) query.role = { $regex: role, $options: "i" };
    if (verdict) query.verdict = verdict;
    if (search) {
      query.$or = [
        { company: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
        { tips: { $regex: search, $options: "i" } }
      ];
    }

    const experiences = await InterviewExperience.find(query).sort({ createdAt: -1 });
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch interview experiences", error: error.message });
  }
});

// POST /api/experiences - Share interview experience
router.post("/", verifyToken, async (req, res) => {
  try {
    const { company, role, batchYear, difficulty, verdict, rounds, tips } = req.body;
    if (!company || !role) {
      return res.status(400).json({ message: "Company and role are required" });
    }

    const user = await User.findById(req.userId);
    const authorName = user ? user.name : "Anonymous Candidate";

    const newExperience = await InterviewExperience.create({
      userId: req.userId,
      authorName,
      company,
      role,
      batchYear: batchYear || "2026",
      difficulty: difficulty || "Medium",
      verdict: verdict || "Selected",
      rounds: Array.isArray(rounds) ? rounds : [],
      tips: tips || ""
    });

    res.status(201).json(newExperience);
  } catch (error) {
    res.status(500).json({ message: "Failed to share interview experience", error: error.message });
  }
});

// PUT /api/experiences/:id/upvote - Toggle upvote
router.put("/:id/upvote", verifyToken, async (req, res) => {
  try {
    const experience = await InterviewExperience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }

    const userIdStr = req.userId.toString();
    const index = experience.upvotes.indexOf(userIdStr);

    if (index > -1) {
      experience.upvotes.splice(index, 1); // remove upvote
    } else {
      experience.upvotes.push(userIdStr); // add upvote
    }

    await experience.save();
    res.json({ upvotesCount: experience.upvotes.length, upvoted: index === -1 });
  } catch (error) {
    res.status(500).json({ message: "Failed to toggle upvote", error: error.message });
  }
});

// DELETE /api/experiences/:id - Delete own experience
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const experience = await InterviewExperience.findOne({ _id: req.params.id, userId: req.userId });
    if (!experience) {
      return res.status(404).json({ message: "Interview experience not found or unauthorized" });
    }

    await InterviewExperience.deleteOne({ _id: req.params.id });
    res.json({ message: "Experience deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete experience", error: error.message });
  }
});

module.exports = router;
