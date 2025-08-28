// server/src/routes/auth.js
// Requires:
//   npm i bcryptjs jsonwebtoken
// .env:
//   JWT_SECRET=your_super_secret_key

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");     // { email, password, name }
const auth = require("../mw/auth");         // module.exports = function(req,res,next){...}

const router = express.Router();

// Helper: create JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });

// POST /api/auth/register
// Public: create user and return token
router.post("/register", async (req, res) => {
  try {
    let { name, email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    email = String(email).toLowerCase().trim();
    name = (name ?? "").toString().trim();

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // Create user
    user = await User.create({ name, email, password: hashed });

    // Return token + basic user
    const token = generateToken(user._id);
    return res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Register error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/login
// Public: validate credentials and return token
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    email = String(email).toLowerCase().trim();

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      // Avoid user enumeration
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Issue token
    const token = generateToken(user._id);
    return res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

// GET /api/auth/me
// Private: returns current user info from JWT
router.get("/me", auth, async (req, res) => {
  try {
    const me = await User.findById(req.user.id).select("_id name email");
    if (!me) return res.status(404).json({ message: "User not found" });
    return res.json(me);
  } catch (err) {
    console.error("Me error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
