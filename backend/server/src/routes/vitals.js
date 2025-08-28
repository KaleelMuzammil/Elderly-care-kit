const express = require("express");
const Vital = require("../models/Vital");
const auth = require("../mw/auth"); // middleware to check JWT

const router = express.Router();

// @route   POST /api/vitals
// @desc    Add a new vital record
// @access  Private (JWT required)
router.post("/", auth, async (req, res) => {
  try {
    const { heartRate, spo2, temperature } = req.body;

    if (!heartRate || !spo2 || !temperature) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const vital = await Vital.create({
      user: req.user.id, // comes from JWT middleware
      heartRate,
      spo2,
      temperature,
    });

    res.json(vital);
  } catch (err) {
    console.error("Error adding vital:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/vitals/latest
// @desc    Get latest vital record
// @access  Private
router.get("/latest", auth, async (req, res) => {
  try {
    const vital = await Vital.findOne({ user: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    if (!vital) {
      return res.status(404).json({ error: "No vitals yet" });
    }

    res.json(vital);
  } catch (err) {
    console.error("Error fetching vitals:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
