const mongoose = require("mongoose");

const ToggleSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true, required: true },
    key:  { type: String, required: true },  // e.g., "toggleSwitch"
    value:{ type: Boolean, default: false },
  },
  { timestamps: true }
);

// One toggle per user per key
ToggleSchema.index({ user: 1, key: 1 }, { unique: true });

module.exports = mongoose.model("Toggle", ToggleSchema);
