const express = require("express");
const multer = require("multer");
const Resume = require("../models/Resume");
const verifyToken = require("../middleware/auth");
const { analyzeResume } = require("../services/geminiService");

let pdfParse = null;
try {
  pdfParse = require("pdf-parse");
} catch (e) {
  console.warn("pdf-parse not loaded:", e.message);
}

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// POST /api/resumes/analyze - Analyze uploaded PDF or pasted text
router.post("/analyze", verifyToken, upload.single("resumeFile"), async (req, res) => {
  try {
    let resumeText = req.body.resumeText || "";
    const title = req.body.title || "My Resume";
    const targetRole = req.body.targetRole || "Software Development Engineer";

    // If PDF file uploaded, extract text from buffer
    if (req.file) {
      if (req.file.mimetype === "application/pdf" && pdfParse) {
        try {
          const pdfData = await pdfParse(req.file.buffer);
          resumeText = pdfData.text || "";
        } catch (pdfErr) {
          console.warn("PDF parse error:", pdfErr.message);
          return res.status(400).json({ message: "Could not read PDF. Try copying and pasting resume text directly." });
        }
      } else {
        // Plain text file or buffer toString
        resumeText = req.file.buffer.toString("utf8");
      }
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({
        message: "Resume content is too short or empty. Please provide at least 50 characters of resume text."
      });
    }

    // Run AI / ATS evaluation
    const analysis = await analyzeResume(resumeText, targetRole);

    // Save to database
    const savedResume = await Resume.create({
      userId: req.userId,
      title,
      targetRole,
      resumeText: resumeText.slice(0, 10000), // store reasonable slice
      atsScore: analysis.atsScore,
      strengths: analysis.strengths,
      missingKeywords: analysis.missingKeywords,
      suggestions: analysis.suggestions,
      categoryScores: analysis.categoryScores
    });

    res.status(201).json(savedResume);
  } catch (error) {
    res.status(500).json({ message: "Failed to analyze resume", error: error.message });
  }
});

// GET /api/resumes - List all saved resumes for user
router.get("/", verifyToken, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch resumes", error: error.message });
  }
});

// GET /api/resumes/:id - Get specific resume
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.userId });
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch resume", error: error.message });
  }
});

// DELETE /api/resumes/:id - Delete resume
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deleted = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!deleted) {
      return res.status(404).json({ message: "Resume not found" });
    }
    res.json({ message: "Resume deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete resume", error: error.message });
  }
});

module.exports = router;
