const express = require("express");
const AptitudeQuestion = require("../models/AptitudeQuestion");
const AptitudeAttempt = require("../models/AptitudeAttempt");
const verifyToken = require("../middleware/auth");

const router = express.Router();

// GET /api/aptitude/questions - List questions (practice mode)
router.get("/questions", verifyToken, async (req, res) => {
  try {
    const { category, topic, difficulty } = req.query;
    const query = {};
    if (category) query.category = category;
    if (topic) query.topic = topic;
    if (difficulty) query.difficulty = difficulty;

    const questions = await AptitudeQuestion.find(query);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch aptitude questions", error: error.message });
  }
});

// GET /api/aptitude/quiz - Get a timed quiz question set (without exposing correct answers)
router.get("/quiz", verifyToken, async (req, res) => {
  try {
    const { category, count = 5 } = req.query;
    const match = category && category !== "Mixed" ? { category } : {};
    
    // Sample random questions
    const questions = await AptitudeQuestion.aggregate([
      { $match: match },
      { $sample: { size: parseInt(count, 10) || 5 } },
      {
        $project: {
          category: 1,
          topic: 1,
          difficulty: 1,
          question: 1,
          options: 1
        }
      }
    ]);

    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Failed to create quiz", error: error.message });
  }
});

// POST /api/aptitude/submit - Submit quiz answers, evaluate, and save attempt
router.post("/submit", verifyToken, async (req, res) => {
  try {
    const { category, answers, timeTakenSeconds } = req.body;
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: "Answers array is required" });
    }

    const questionIds = answers.map((a) => a.questionId);
    const questions = await AptitudeQuestion.find({ _id: { $in: questionIds } });
    const questionMap = new Map(questions.map((q) => [q._id.toString(), q]));

    let correctCount = 0;
    const review = answers.map((ans) => {
      const q = questionMap.get(ans.questionId.toString());
      if (!q) return null;

      const isCorrect = q.correctOptionIndex === ans.selectedOptionIndex;
      if (isCorrect) correctCount++;

      return {
        questionId: q._id,
        question: q.question,
        topic: q.topic,
        category: q.category,
        options: q.options,
        selectedOptionIndex: ans.selectedOptionIndex,
        correctOptionIndex: q.correctOptionIndex,
        isCorrect,
        explanation: q.explanation
      };
    }).filter(Boolean);

    const totalQuestions = review.length;
    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    const attempt = await AptitudeAttempt.create({
      userId: req.userId,
      category: category || "Mixed",
      score: correctCount,
      totalQuestions,
      percentage,
      timeTakenSeconds: timeTakenSeconds || 0
    });

    res.json({
      score: correctCount,
      totalQuestions,
      percentage,
      attemptId: attempt._id,
      review
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to evaluate quiz", error: error.message });
  }
});

// GET /api/aptitude/attempts - User attempt history
router.get("/attempts", verifyToken, async (req, res) => {
  try {
    const attempts = await AptitudeAttempt.find({ userId: req.userId }).sort({ dateTaken: -1 }).limit(20);
    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch attempt history", error: error.message });
  }
});

module.exports = router;
