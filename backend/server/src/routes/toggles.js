const express = require("express");
const auth = require("../mw/auth");     // MUST be: module.exports = authFunction
const Toggle = require("../models/Toggle");

const router = express.Router();
const KEY = "toggleSwitch";

/**
 * GET /api/toggles/toggleSwitch
 * Returns { value: boolean }
 */
router.get("/toggleSwitch", auth, async (req, res) => {
  try {
    let t = await Toggle.findOne({ user: req.user.id, key: KEY }).lean();
    if (!t) {
      // create default for first-time users
      t = await Toggle.create({ user: req.user.id, key: KEY, value: false });
    }
    res.json({ value: Boolean(t.value) });
  } catch (err) {
    console.error("GET toggle error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * PUT /api/toggles/toggleSwitch
 * Body: { value: boolean }
 * Returns { value: boolean }
 */
router.put("/toggleSwitch", auth, async (req, res) => {
  try {
    const { value } = req.body || {};
    if (typeof value !== "boolean") {
      return res.status(400).json({ message: "value must be boolean" });
    }

    const updated = await Toggle.findOneAndUpdate(
      { user: req.user.id, key: KEY },
      { $set: { value } },
      { new: true, upsert: true }
    ).lean();

    res.json({ value: Boolean(updated.value) });
  } catch (err) {
    console.error("PUT toggle error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
