const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const verifyToken = require("../middleware/auth");

const router = express.Router();

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET || "prephub_super_secret_key_2026",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Signup successful",
      token,
      user: { _id: newUser._id, name: newUser.name, email: newUser.email }
    });
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "prephub_super_secret_key_2026",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { _id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

// POST /api/auth/google
router.post("/google", async (req, res) => {
  try {
    const { name, email, googleId, avatar } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Google account email is required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });

    if (user) {
      let updated = false;
      if (googleId && !user.googleId) {
        user.googleId = googleId;
        updated = true;
      }
      if (avatar && !user.avatar) {
        user.avatar = avatar;
        updated = true;
      }
      if (updated) {
        await user.save();
      }
    } else {
      const displayName = name && name.trim() ? name.trim() : normalizedEmail.split('@')[0];
      user = await User.create({
        name: displayName,
        email: normalizedEmail,
        googleId: googleId || `google_${Date.now()}`,
        avatar: avatar || "",
        authProvider: "google"
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "prephub_super_secret_key_2026",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Google login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        authProvider: user.authProvider
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Google authentication failed", error: error.message });
  }
});

// GET /api/auth/me
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user profile", error: error.message });
  }
});

module.exports = router;
