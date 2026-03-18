const mongoose = require("mongoose");

const StepSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  resource: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
});

const LearningPathSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    goal: {
      type: String,
      required: true
    },
    steps: [StepSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("LearningPath", LearningPathSchema);