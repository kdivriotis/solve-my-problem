const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUrl =
    process.env.MONGO_URL || `mongodb://localhost:27018/user_data`;
  mongoose
    .connect(mongoUrl)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));
};

module.exports = connectDB;
