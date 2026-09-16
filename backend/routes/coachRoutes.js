const express = require("express");
const StudyPlan = require("../models/StudyPlan");
const Problem = require("../models/Problem");
const AptitudeAttempt = require("../models/AptitudeAttempt");
const Resume = require("../models/Resume");
const verifyToken = require("../middleware/auth");
const { generatePersonalizedPlan } = require("../services/geminiService");

const router = express.Router();

// GET /api/coach/active - Get current active study plan
router.get("/active", verifyToken, async (req, res) => {
  try {
    const plan = await StudyPlan.findOne({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(plan || null);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch study plan", error: error.message });
  }
});

// POST /api/coach/generate - Generate personalized AI study plan based on user metrics
router.post("/generate", verifyToken, async (req, res) => {
  try {
    const { targetRole, durationDays, hoursPerDay } = req.body;
    const userId = req.userId;

    // 1. Gather DSA metrics
    const problems = await Problem.find({ userId });
    const totalProblems = problems.length;
    const solvedTopics = [...new Set(problems.map((p) => p.topic).filter(Boolean))];
    const difficultyBreakdown = { Easy: 0, Medium: 0, Hard: 0 };
    problems.forEach((p) => {
      const diff = p.difficulty || "Easy";
      if (difficultyBreakdown[diff] !== undefined) difficultyBreakdown[diff]++;
    });

    // 2. Gather Aptitude metrics
    const attempts = await AptitudeAttempt.find({ userId });
    let aptitudeAverage = 0;
    let aptitudeWeakest = "Quantitative";
    if (attempts.length > 0) {
      const totalPct = attempts.reduce((acc, a) => acc + a.percentage, 0);
      aptitudeAverage = Math.round(totalPct / attempts.length);

      // Find lowest category
      const catAverages = {};
      attempts.forEach((a) => {
        if (!catAverages[a.category]) catAverages[a.category] = { total: 0, count: 0 };
        catAverages[a.category].total += a.percentage;
        catAverages[a.category].count += 1;
      });

      let minAvg = Infinity;
      Object.keys(catAverages).forEach((cat) => {
        const avg = catAverages[cat].total / catAverages[cat].count;
        if (avg < minAvg) {
          minAvg = avg;
          aptitudeWeakest = cat;
        }
      });
    }

    // 3. Gather Resume metrics
    const latestResume = await Resume.findOne({ userId }).sort({ createdAt: -1 });
    const resumeAtsScore = latestResume ? latestResume.atsScore : 0;

    // 4. Generate plan via Gemini AI
    const days = parseInt(durationDays, 10) === 30 ? 30 : 7;
    const hours = parseInt(hoursPerDay, 10) || 3;
    const role = targetRole || "Software Development Engineer";

    const aiPlan = await generatePersonalizedPlan({
      targetRole: role,
      durationDays: days,
      hoursPerDay: hours,
      currentStats: {
        totalProblems,
        solvedTopics,
        difficultyBreakdown,
        aptitudeAverage,
        aptitudeWeakest,
        resumeAtsScore
      }
    });

    // 5. Save to MongoDB
    const savedPlan = await StudyPlan.create({
      userId,
      targetRole: role,
      durationDays: days,
      hoursPerDay: hours,
      diagnostics: aiPlan.diagnostics,
      dailySchedule: aiPlan.dailySchedule,
      completionPercentage: 0
    });

    res.status(201).json(savedPlan);
  } catch (error) {
    res.status(500).json({ message: "Failed to generate study plan", error: error.message });
  }
});

// PUT /api/coach/tasks/:dayNumber - Toggle completion of day milestone
router.put("/tasks/:dayNumber", verifyToken, async (req, res) => {
  try {
    const dayNum = parseInt(req.params.dayNumber, 10);
    const plan = await StudyPlan.findOne({ userId: req.userId }).sort({ createdAt: -1 });
    if (!plan) {
      return res.status(404).json({ message: "No active study plan found" });
    }

    const dayEntry = plan.dailySchedule.find((d) => d.dayNumber === dayNum);
    if (!dayEntry) {
      return res.status(404).json({ message: "Day entry not found" });
    }

    dayEntry.completed = !dayEntry.completed;

    const completedCount = plan.dailySchedule.filter((d) => d.completed).length;
    plan.completionPercentage = Math.round((completedCount / plan.dailySchedule.length) * 100);

    await plan.save();
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: "Failed to update milestone", error: error.message });
  }
});

module.exports = router;
