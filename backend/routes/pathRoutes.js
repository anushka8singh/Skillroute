const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createLearningPath,
  getLearningPaths,
  completeStep,
  deletePath
} = require("../controllers/pathController");

// 🔐 Protected routes
router.post("/path", protect, createLearningPath);
router.get("/path", protect, getLearningPaths);
router.patch("/step/:pathId/:stepIndex", protect, completeStep);
router.delete("/path/:id", protect, deletePath);

module.exports = router;