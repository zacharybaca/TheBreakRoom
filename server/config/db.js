import mongoose from "mongoose";
import "dotenv/config";

const uri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;

export async function connectDB() {
  try {
    await mongoose.connect(uri, { dbName });
    console.log(`✅ Connected to MongoDB Atlas → ${dbName}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
}
