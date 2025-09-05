// load env var from .env
import dotenv from "dotenv";
dotenv.config();

// import mongoose
import mongoose from "mongoose";

// connect to mongoDB
export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME;
  try {
    await mongoose.connect(uri, {
      dbName: dbName,
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
}
