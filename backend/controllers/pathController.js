const LearningPath = require("../models/LearningPath");

const createLearningPath = async (req, res) => {
  try {
    const { goal } = req.body;

    const newPath = new LearningPath({
      goal,
      steps: []
    });

    const savedPath = await newPath.save();

    res.status(201).json(savedPath);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createLearningPath
};