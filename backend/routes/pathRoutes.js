const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createLearningPath,
  getLearningPaths,
  completeStep,
  deletePath
} = require("../controllers/pathController");

// All learning path routes are protected.
// Flow: request -> protect middleware -> controller -> MongoDB -> JSON response.
router.post("/path", protect, createLearningPath);
// Create a new AI-generated learning path for the logged-in user.
router.get("/path", protect, getLearningPaths);
// Fetch only the current user's saved learning paths.
router.patch("/step/:pathId/:stepIndex", protect, completeStep);
// Toggle completion for one step inside one learning path.
router.delete("/path/:id", protect, deletePath);
// Delete a path that belongs to the logged-in user.

module.exports = router;
