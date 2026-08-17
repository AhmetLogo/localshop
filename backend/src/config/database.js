const mongoose = require("mongoose");

async function connectDatabase() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }

  mongoose.connection.on("connected", () => {
    console.log("[database] MongoDB connected");
  });

  mongoose.connection.on("error", (err) => {
    console.error("[database] MongoDB connection error:", err.message);
  });

  await mongoose.connect(uri);
}

module.exports = { connectDatabase };
