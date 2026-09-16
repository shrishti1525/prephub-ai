const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Seeds
const { seedAptitudeData } = require("./seeds/seedAptitude");

// Route Modules
const authRoutes = require("./routes/authRoutes");
const problemRoutes = require("./routes/problemRoutes");
const aptitudeRoutes = require("./routes/aptitudeRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const experienceRoutes = require("./routes/experienceRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const noteRoutes = require("./routes/noteRoutes");
const coachRoutes = require("./routes/coachRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "PrepHub AI API",
    dbState: mongoose.connection.readyState === 1 ? "connected" : "connecting/disconnected",
    time: new Date()
  });
});

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/aptitude", aptitudeRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/experiences", experienceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/coach", coachRoutes);

// Backward Compatibility Aliases
app.use("/api", authRoutes);

const PORT = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI;
const LOCAL_MONGO = "mongodb://127.0.0.1:27017/prephub";

async function connectDatabase() {
  const options = {
    serverSelectionTimeoutMS: 4000 // Quick timeout to fallback if Atlas IP is blocked
  };

  if (mongoURI) {
    try {
      console.log("Attempting MongoDB connection via MONGO_URI...");
      await mongoose.connect(mongoURI, options);
      console.log("Connected to MongoDB successfully via MONGO_URI");
      await seedAptitudeData();
      return;
    } catch (err) {
      console.warn("Could not connect via MONGO_URI (possibly Atlas IP whitelist or network issue):", err.message);
      try {
        await mongoose.disconnect();
      } catch (_) {}
    }
  }

  try {
    console.log("Falling back to local MongoDB server on 127.0.0.1:27017...");
    await mongoose.connect(LOCAL_MONGO, { serverSelectionTimeoutMS: 3000 });
    console.log("Connected to local MongoDB (mongodb://127.0.0.1:27017/prephub) successfully");
    await seedAptitudeData();
  } catch (localErr) {
    console.error("Failed to connect to local MongoDB:", localErr.message);
  }
}

connectDatabase();

app.listen(PORT, () => {
  console.log(`PrepHub AI Server is running on port ${PORT}`);
});

module.exports = app;
