const LearningPath = require("../models/LearningPath");
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1"
});

/* -----------------------------
Create Learning Path (AI)
-----------------------------*/
const createLearningPath = async (req, res) => {
  try {
    const { goal } = req.body;

    if (!goal) {
      return res.status(400).json({ error: "Goal is required" });
    }

    const completion = await client.chat.completions.create({
      model: "openai/gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert teacher who creates structured learning roadmaps."
        },
        {
          role: "user",
          content: `Create a learning roadmap for: ${goal}.

Return ONLY JSON:

[
 { "title": "Step title", "resource": "Suggested resource" }
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
      steps = [
        { title: "Research topic", resource: "Google / YouTube" }
      ];
    }

    const newPath = new LearningPath({ goal, steps });

    const savedPath = await newPath.save();

    res.status(201).json(savedPath);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate learning path" });
  }
};

/* -----------------------------
Get All Learning Paths
-----------------------------*/
const getLearningPaths = async (req, res) => {
  try {
    const paths = await LearningPath.find();

    res.json(paths);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* -----------------------------
Mark Step Completed
-----------------------------*/
const completeStep = async (req, res) => {
  try {
    const { pathId, stepIndex } = req.params;

    const path = await LearningPath.findById(pathId);

    if (!path) {
      return res.status(404).json({ error: "Learning path not found" });
    }

    path.steps[stepIndex].completed = true;

    await path.save();

    res.json(path);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* -----------------------------
Delete Learning Path
-----------------------------*/
const deletePath = async (req, res) => {
  try {
    const { id } = req.params;

    await LearningPath.findByIdAndDelete(id);

    res.json({ message: "Learning path deleted" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createLearningPath,
  getLearningPaths,
  completeStep,
  deletePath
};