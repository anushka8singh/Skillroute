const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const { signup, login, updateNickname } = require("../controllers/authController");

// Create a new user account.
router.post("/signup", signup);
// Authenticate an existing user and return a JWT.
router.post("/login", login);
// Protected profile update route; runs auth middleware before controller logic.
router.patch("/nickname", protect, updateNickname);

module.exports = router;
