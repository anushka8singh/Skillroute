const LearningPath = require("../models/LearningPath");
const OpenAI = require("openai");

const client = new OpenAI({
  // OpenRouter exposes an OpenAI-compatible API, so the OpenAI SDK can still be used here.
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1"
});

// Normalize AI output so it always matches the LearningPath schema structure.
const normalizeSteps = (steps) =>
  (Array.isArray(steps) ? steps : []).map((step, index) => ({
    title:
      typeof step?.title === "string" && step.title.trim()
        ? step.title.trim()
        : `Step ${index + 1}`,
    completed: Boolean(step?.completed)
  }));

/* -----------------------------
Create Learning Path (AI)
----------------------------- */
const createLearningPath = async (req, res) => {
  try {
    const { goal } = req.body;
    // req.user is attached by authMiddleware after the JWT is verified.
    const userId = req.user.userId;

    if (!goal) {
      return res.status(400).json({ error: "Goal is required" });
    }

    // Request flow:
    // frontend goal -> controller -> AI roadmap generation -> MongoDB save -> JSON response.
    const completion = await client.chat.completions.create({
      model: "openai/gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an expert technical mentor who creates complete structured learning roadmaps from beginner to advanced."
        },
        {
          role: "user",
          content: `Create a complete step-by-step learning roadmap for ${goal}.

Include all important topics from beginner to advanced.
Structure the roadmap similar to roadmap.sh.

Return ONLY a JSON array in this format:
[
  { "title": "Step name" }
]

Rules:
- do not include explanations
- do not include numbering
- do not include markdown
- do not include links
- each item must only contain a title field`
        }
      ]
    });

    const text = completion.choices?.[0]?.message?.content || "";

    let steps = [];

    try {
      // The prompt asks for JSON so the response can be parsed directly into step objects.
      steps = JSON.parse(text);
    } catch {
      console.log("AI returned non JSON:", text);
      // Fallback steps keep the feature working even if the AI response is malformed.
      steps = [
        { title: "Learn Fundamentals" },
        { title: "Practice Basics" },
        { title: "Build Small Projects" }
      ];
    }

    // Clean the AI output before saving so the frontend always receives consistent data.
    const normalizedSteps = normalizeSteps(steps);

    const newPath = new LearningPath({
      user: userId,
      goal,
      steps: normalizedSteps
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

    // Find learning paths that belong only to the logged-in user.
    // This prevents users from seeing other users' data.
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

    // Look up only the current user's path so another user's path cannot be updated.
    const path = await LearningPath.findOne({
      _id: pathId,
      user: userId
    });

    if (!path) {
      return res.status(404).json({ error: "Learning path not found" });
    }

    // Make sure the requested step index exists before toggling it.
    if (!path.steps[stepIndex]) {
      return res.status(404).json({ error: "Step not found" });
    }

    // Toggle completion so the same endpoint can mark a step complete or incomplete.
    path.steps[stepIndex].completed = !path.steps[stepIndex].completed;

    // Saving the parent document persists the updated embedded step array.
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

    // Delete only if the path belongs to the logged-in user.
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
