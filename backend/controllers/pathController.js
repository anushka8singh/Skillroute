const LearningPath = require('../models/LearningPath');

// @desc    Get all learning paths
// @route   GET /api/paths
// @access  Public
exports.getPaths = async (req, res) => {
  try {
    const paths = await LearningPath.find();
    res.json(paths);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a learning path
// @route   POST /api/paths
// @access  Public
exports.createPath = async (req, res) => {
  try {
    const path = new LearningPath(req.body);
    const saved = await path.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: 'Bad Request' });
  }
};
