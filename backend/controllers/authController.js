const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate a JWT that the frontend stores and sends back on protected requests.
// The payload includes basic user info so the UI can read it without another API call.
const createToken = (user) =>
  jwt.sign(
    {
      userId: user._id,
      name: user.name,
      email: user.email,
      nickname: user.nickname || ""
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

const signup = async (req, res) => {
  try {
    // Read signup form values sent from the frontend.
    const { name, email, password } = req.body;

    // Validate early so we do not run unnecessary database operations.
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check whether another account already uses this email.
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash the password before saving so plain text credentials never reach the database.
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    // Signup only creates the account; login is the step that returns the JWT.
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({ error: "Signup failed" });
  }
};

const login = async (req, res) => {
  try {
    // Read login credentials from the request body.
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find the user so we can compare the submitted password with the stored hash.
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // bcrypt.compare safely verifies the entered password without decrypting anything.
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Once credentials are valid, return a token the frontend can store in localStorage.
    const token = createToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        nickname: user.nickname || ""
      }
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ error: "Login failed" });
  }
};

const updateNickname = async (req, res) => {
  try {
    const { nickname } = req.body;

    // Trim whitespace so a nickname with only spaces is not treated as valid.
    const trimmedNickname = typeof nickname === "string" ? nickname.trim() : "";

    if (!trimmedNickname) {
      return res.status(400).json({ error: "Nickname is required" });
    }

    // req.user comes from JWT verification in authMiddleware.
    // That makes sure users can update only their own profile record.
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { nickname: trimmedNickname },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return a fresh token so the frontend immediately sees the updated nickname.
    const token = createToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        nickname: user.nickname || ""
      }
    });
  } catch (error) {
    console.error("Nickname update error:", error.message);
    res.status(500).json({ error: "Failed to update nickname" });
  }
};

module.exports = { signup, login, updateNickname };
