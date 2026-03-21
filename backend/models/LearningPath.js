const mongoose = require("mongoose");

// Each learning path contains smaller step documents embedded inside the path.
const StepSchema = new mongoose.Schema({
  // Title is the learner-facing description of what to study next.
  title: {
    type: String,
    required: true
  },
  // Resource is the URL the frontend opens for that step.
  resource: {
    type: String,
    default: ""
  },
  // Completion is tracked per step so progress can be calculated accurately.
  completed: {
    type: Boolean,
    default: false
  }
});

const LearningPathSchema = new mongoose.Schema(
  {
    // This links each roadmap to the user who created it.
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    // goal is the user's learning request, such as "Learn React from scratch".
    goal: {
      type: String,
      required: true
    },
    // Steps are embedded because they belong only to this single learning path.
    steps: [StepSchema]
  },
  {
    // createdAt and updatedAt are useful for sorting newest paths first.
    timestamps: true
  }
);

module.exports = mongoose.model("LearningPath", LearningPathSchema);
