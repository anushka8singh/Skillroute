const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // Name is captured during signup and shown in the dashboard/profile area.
    name: {
      type: String,
      required: true
    },
    // Email is unique so each account can log in with a single identifier.
    email: {
      type: String,
      required: true,
      unique: true
    },
    // Nickname is optional and lets the user personalize how they appear in the UI.
    nickname: {
      type: String,
      trim: true,
      default: ""
    },
    // Password stores the hashed version, not the original plain text password.
    password: {
      type: String,
      required: true
    }
  },
  {
    // Timestamps help with debugging and make sorting/filtering easier later.
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);
