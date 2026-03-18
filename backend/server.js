require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const pathRoutes = require("./routes/pathRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

/* ---------------------------
   Connect to MongoDB
---------------------------- */
connectDB();

/* ---------------------------
   Middleware
---------------------------- */
app.use(cors());
app.use(express.json());

/* ---------------------------
   Test Route
---------------------------- */
app.get("/", (req, res) => {
  res.send("SkillRoute API is running");
});

/* ---------------------------
   API Routes
---------------------------- */
app.use("/api/auth", authRoutes);
app.use("/api", pathRoutes);

/* ---------------------------
   Server Start
---------------------------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});