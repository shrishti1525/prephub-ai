const express = require("express");
const Note = require("../models/Note");
const verifyToken = require("../middleware/auth");

const router = express.Router();

// GET /api/notes - Get all notes for user
router.get("/", verifyToken, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId }).sort({ dateAdded: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notes", error: error.message });
  }
});

// POST /api/notes - Add note
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Note title is required" });
    }

    const newNote = await Note.create({
      title,
      content: content || "",
      userId: req.userId
    });

    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ message: "Failed to add note", error: error.message });
  }
});

// PUT /api/notes/:id - Update note
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.userId });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (req.body.title !== undefined) note.title = req.body.title;
    if (req.body.content !== undefined) note.content = req.body.content;

    await note.save();
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: "Failed to update note", error: error.message });
  }
});

// DELETE /api/notes/:id - Delete note
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete note", error: error.message });
  }
});

module.exports = router;
