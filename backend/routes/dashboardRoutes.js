const express = require("express");
const Problem = require("../models/Problem");
const Note = require("../models/Note");
const AptitudeAttempt = require("../models/AptitudeAttempt");
const Resume = require("../models/Resume");
const InterviewExperience = require("../models/InterviewExperience");
const verifyToken = require("../middleware/auth");

const router = express.Router();

// GET /api/dashboard - Centralized analytics data
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;

    // 1. Problems Aggregation
    const problems = await Problem.find({ userId });
    const totalProblems = problems.length;

    const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
    const statusCounts = { Solved: 0, "In Progress": 0, Revision: 0 };
    const topicMap = {};

    problems.forEach((p) => {
      const diff = p.difficulty || "Easy";
      if (difficultyCounts[diff] !== undefined) {
        difficultyCounts[diff]++;
      } else {
        difficultyCounts[diff] = 1;
      }

      const st = p.status || "Solved";
      if (statusCounts[st] !== undefined) {
        statusCounts[st]++;
      } else {
        statusCounts[st] = 1;
      }

      const t = p.topic || "General";
      topicMap[t] = (topicMap[t] || 0) + 1;
    });

    const topicDistribution = Object.keys(topicMap).map((topic) => ({
      topic,
      count: topicMap[topic]
    })).sort((a, b) => b.count - a.count).slice(0, 8);

    // 2. Aptitude Attempts Aggregation
    const attempts = await AptitudeAttempt.find({ userId });
    const totalAttempts = attempts.length;
    let avgAptitude = 0;

    const catStats = {
      Quantitative: { totalScore: 0, totalQuestions: 0 },
      Logical: { totalScore: 0, totalQuestions: 0 },
      Verbal: { totalScore: 0, totalQuestions: 0 }
    };

    if (totalAttempts > 0) {
      const totalPct = attempts.reduce((acc, curr) => acc + curr.percentage, 0);
      avgAptitude = Math.round(totalPct / totalAttempts);

      attempts.forEach((att) => {
        if (catStats[att.category]) {
          catStats[att.category].totalScore += att.score;
          catStats[att.category].totalQuestions += att.totalQuestions;
        }
      });
    }

    const aptitudeCategoryPerformance = Object.keys(catStats).map((cat) => {
      const { totalScore, totalQuestions } = catStats[cat];
      const accuracy = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;
      return { category: cat, accuracy };
    });

    // 3. Resume Metrics
    const resumes = await Resume.find({ userId }).sort({ createdAt: -1 });
    const totalResumes = resumes.length;
    const latestResume = resumes[0] || null;
    const latestAtsScore = latestResume ? latestResume.atsScore : 0;

    // 4. Notes & Interview Experiences
    const noteCount = await Note.countDocuments({ userId });
    const myExperiencesCount = await InterviewExperience.countDocuments({ userId });
    const totalCommunityExperiences = await InterviewExperience.countDocuments();

    // 5. Overall Placement Readiness Index (0 - 100)
    // Formula: DSA solved (cap at 40 pts for 50 problems) + Aptitude score (up to 30 pts) + Resume score (up to 30 pts)
    const dsaWeight = Math.min(40, Math.round((totalProblems / 30) * 40));
    const aptitudeWeight = Math.round((avgAptitude / 100) * 30);
    const resumeWeight = latestResume ? Math.round((latestAtsScore / 100) * 30) : 0;
    const readinessIndex = Math.min(100, dsaWeight + aptitudeWeight + resumeWeight);

    res.json({
      message: "Dashboard analytics loaded",
      readinessIndex,
      problems: {
        total: totalProblems,
        difficultyCounts: [
          { name: "Easy", count: difficultyCounts.Easy, color: "#10b981" },
          { name: "Medium", count: difficultyCounts.Medium, color: "#f59e0b" },
          { name: "Hard", count: difficultyCounts.Hard, color: "#ef4444" }
        ],
        statusCounts,
        topicDistribution
      },
      aptitude: {
        totalAttempts,
        avgPercentage: avgAptitude,
        categoryPerformance: aptitudeCategoryPerformance
      },
      resume: {
        totalResumes,
        latestAtsScore,
        latestTargetRole: latestResume?.targetRole || null,
        latestId: latestResume?._id || null
      },
      community: {
        myExperiencesCount,
        totalCommunityExperiences
      },
      noteCount
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load dashboard analytics", error: error.message });
  }
});

module.exports = router;
