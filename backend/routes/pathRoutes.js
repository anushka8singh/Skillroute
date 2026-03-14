const express = require("express");
const router = express.Router();

const { createLearningPath } = require("../controllers/pathController");

router.post("/path", createLearningPath);

module.exports = router;