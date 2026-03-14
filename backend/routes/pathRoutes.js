const express = require("express");
const router = express.Router();

const {
  createLearningPath,
  getLearningPaths,
  completeStep,
  deletePath
} = require("../controllers/pathController");

router.post("/path", createLearningPath);

router.get("/path", getLearningPaths);

router.patch("/step/:pathId/:stepIndex", completeStep);

router.delete("/path/:id", deletePath);

module.exports = router;