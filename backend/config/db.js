const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Use the connection string from environment variables so secrets stay outside the code.
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    // Stop the app if MongoDB is unavailable because most routes depend on it.
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
