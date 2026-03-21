require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const pathRoutes = require("./routes/pathRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Connect to MongoDB before serving requests so controllers can safely read and write data.
/* ---------------------------
   Connect to MongoDB
---------------------------- */
connectDB();

// Allow the frontend app to call this API from a different origin during development.
// Parse JSON request bodies so form values are available on req.body.
/* ---------------------------
   Middleware
---------------------------- */
app.use(cors());
app.use(express.json());

// Basic health-check route to confirm that the API server is running.
/* ---------------------------
   Test Route
---------------------------- */
app.get("/", (req, res) => {
  res.send("SkillRoute API is running");
});

// Authentication routes handle signup, login, and profile-related actions.
// Learning path routes handle roadmap creation, retrieval, updates, and deletion.
/* ---------------------------
   API Routes
---------------------------- */
app.use("/api/auth", authRoutes);
app.use("/api", pathRoutes);

// Start listening only after middleware and routes are configured.
/* ---------------------------
   Server Start
---------------------------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
