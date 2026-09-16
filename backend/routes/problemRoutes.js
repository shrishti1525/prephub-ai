const express = require("express");
const Problem = require("../models/Problem");
const verifyToken = require("../middleware/auth");
const { getDsaHint } = require("../services/geminiService");

const router = express.Router();

// GET /api/problems - List all user problems with optional search/filter
router.get("/", verifyToken, async (req, res) => {
  try {
    const { topic, difficulty, status, search } = req.query;
    const query = { userId: req.userId };

    if (topic) query.topic = topic;
    if (difficulty) query.difficulty = difficulty;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { topic: { $regex: search, $options: "i" } }
      ];
    }

    const problems = await Problem.find(query).sort({ dateAdded: -1 });
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch problems", error: error.message });
  }
});

// POST /api/problems - Add new problem
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, topic, difficulty, problemUrl, status, notes, starred } = req.body;
    if (!title || !topic) {
      return res.status(400).json({ message: "Title and topic are required" });
    }

    const newProblem = await Problem.create({
      title,
      topic,
      difficulty: difficulty || "Easy",
      status: status || "Solved",
      problemUrl: problemUrl || "",
      notes: notes || "",
      starred: !!starred,
      userId: req.userId
    });

    res.status(201).json(newProblem);
  } catch (error) {
    res.status(500).json({ message: "Failed to add problem", error: error.message });
  }
});

// PUT /api/problems/:id - Update problem (status, star, notes, details)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const problem = await Problem.findOne({ _id: req.params.id, userId: req.userId });
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const fields = ["title", "topic", "difficulty", "status", "problemUrl", "notes", "starred"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        problem[field] = req.body[field];
      }
    });

    await problem.save();
    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: "Failed to update problem", error: error.message });
  }
});

// DELETE /api/problems/:id - Delete problem
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const result = await Problem.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!result) {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.json({ message: "Problem deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete problem", error: error.message });
  }
});

// POST /api/problems/hint - AI hint generation
router.post("/hint", verifyToken, async (req, res) => {
  try {
    const { title, topic, difficulty } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Problem title is required" });
    }

    const hintData = await getDsaHint(title, topic || "General", difficulty || "Medium");
    res.json(hintData);
  } catch (error) {
    res.status(500).json({ message: "Failed to generate AI hint", error: error.message });
  }
});

module.exports = router;
