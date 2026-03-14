const LearningPath = require("../models/LearningPath");
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1"
});

const createLearningPath = async (req, res) => {
  try {
    const { goal } = req.body;

    if (!goal) {
      return res.status(400).json({ error: "Goal is required" });
    }

    const completion = await client.chat.completions.create({
      model: "openai/gpt-3.5-turbo", // stable OpenRouter model
      messages: [
        {
          role: "system",
          content: "You are an expert teacher who creates structured learning roadmaps."
        },
        {
          role: "user",
          content: `Create a learning roadmap for: ${goal}.

Return ONLY JSON in this format:

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

      // fallback steps so API doesn't break
      steps = [
        { title: "Research the topic", resource: "Google / YouTube" },
        { title: "Study fundamentals", resource: "Official documentation" },
        { title: "Practice with small projects", resource: "GitHub examples" }
      ];
    }

    const newPath = new LearningPath({
      goal,
      steps
    });

    const savedPath = await newPath.save();

    res.status(201).json({
      goal: savedPath.goal,
      steps: savedPath.steps.map(step => ({
        title: step.title,
        resource: step.resource
      }))
    });

  } catch (error) {
    console.error("AI Error:", error.message);

    res.status(500).json({
      error: "Failed to generate learning roadmap"
    });
  }
};

module.exports = { createLearningPath };