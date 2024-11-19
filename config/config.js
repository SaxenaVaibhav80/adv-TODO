const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const url = process.env.URL;

const connectDB = async () => {
  try {
    await mongoose.connect(url);
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
  }
};

connectDB();
