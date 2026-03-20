const LearningPath = require("../models/LearningPath");
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1"
});

/* -----------------------------
Create Learning Path (AI)
----------------------------- */
const createLearningPath = async (req, res) => {
  try {
    const { goal } = req.body;
    const userId = req.user.userId;

    if (!goal) {
      return res.status(400).json({ error: "Goal is required" });
    }

    const completion = await client.chat.completions.create({
      model: "openai/gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an expert teacher who creates structured learning roadmaps."
        },
        {
          role: "user",
          content: `Create a learning roadmap for: ${goal}.

Return ONLY valid JSON in this format:

[
  { "title": "Step title", "resource": "Suggested learning resource" }
]

Maximum 5 steps.`
        }
      ]
    });

    const text = completion.choices?.[0]?.message?.content || "";

    let steps = [];

    try {
      steps = JSON.parse(text);
    } catch {
      console.log("AI returned non JSON:", text);
      steps = [
        { title: "Research the topic", resource: "Google / YouTube" },
        { title: "Study the fundamentals", resource: "Official documentation" },
        { title: "Practice with small projects", resource: "GitHub examples" }
      ];
    }

    const newPath = new LearningPath({
      user: userId,
      goal,
      steps
    });

    const savedPath = await newPath.save();

    res.status(201).json(savedPath);
  } catch (error) {
    console.error("Create Path Error:", error.message);
    res.status(500).json({ error: "Failed to generate learning path" });
  }
};

/* -----------------------------
Get All Learning Paths for Logged-in User
----------------------------- */
const getLearningPaths = async (req, res) => {
  try {
    const userId = req.user.userId;

    const paths = await LearningPath.find({ user: userId }).sort({ createdAt: -1 });

    res.json(paths);
  } catch (error) {
    console.error("Get Paths Error:", error.message);
    res.status(500).json({ error: "Failed to fetch learning paths" });
  }
};

/* -----------------------------
Mark Step Completed for Logged-in User
----------------------------- */
const completeStep = async (req, res) => {
  try {
    const { pathId, stepIndex } = req.params;
    const userId = req.user.userId;

    // Find only user's own path
    const path = await LearningPath.findOne({
      _id: pathId,
      user: userId
    });

    if (!path) {
      return res.status(404).json({ error: "Learning path not found" });
    }

    // Check if step exists
    if (!path.steps[stepIndex]) {
      return res.status(404).json({ error: "Step not found" });
    }

    // ✅ Mark step as completed
    path.steps[stepIndex].completed = true;

    // Save changes
    await path.save();

    res.json(path);

  } catch (error) {
    console.error("Complete Step Error:", error.message);
    res.status(500).json({ error: "Failed to update step" });
  }
};
/* -----------------------------
Delete Learning Path for Logged-in User
----------------------------- */
const deletePath = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const deletedPath = await LearningPath.findOneAndDelete({
      _id: id,
      user: userId
    });

    if (!deletedPath) {
      return res.status(404).json({ error: "Learning path not found" });
    }

    res.json({ message: "Learning path deleted successfully" });
  } catch (error) {
    console.error("Delete Path Error:", error.message);
    res.status(500).json({ error: "Failed to delete learning path" });
  }
};

module.exports = {
  createLearningPath,
  getLearningPaths,
  completeStep,
  deletePath
};