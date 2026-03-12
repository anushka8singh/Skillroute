const mongoose = require("mongoose");

const StepSchema = new mongoose.Schema({
  title: String,
  resource: String,
  completed: {
    type: Boolean,
    default: false
  }
});

const LearningPathSchema = new mongoose.Schema({
  goal: String,
  steps: [StepSchema]
});

module.exports = mongoose.model("LearningPath", LearningPathSchema);