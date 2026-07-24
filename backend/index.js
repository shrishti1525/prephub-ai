const User = require("./models/User");
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const mongoURI = process.env.MONGO_URI;

const app = express();
app.use(express.json());

async function connectDB() {
    try {
        await mongoose.connect(mongoURI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("MongoDB connection error:", error);
    }
}
connectDB();

app.post("/api/signup", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10); 
        const newUser = await User.create({ 
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        res.send(newUser);
    } catch (error) { 
        res.status(400).send({ message: "Signup failed", error: error.message });
    }
});
     app.post("/api/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).send({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(400).send({ message: "Incorrect password" });
        }
       const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.send({ message: "Login successful", token: token, user: user });
        } catch (error) {
        res.status(400).send({ message: "Login failed", error: error.message });
    }
});
function verifyToken(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).send({ message: "No token provided" });
    }
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        res.status(401).send({ message: "Invalid token" });
    }
}
app.get("/api/dashboard", verifyToken, (req, res) => {
    res.send({ message: "Welcome to your dashboard!" });
});

app.listen(5000, () => {
    console.log("Server started on port 5000");
});
   
