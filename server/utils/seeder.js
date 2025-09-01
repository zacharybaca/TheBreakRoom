import dotenv from "dotenv";
import User from "../models/User.js";
import Job from "../models/Job.js";
import { connectDB } from "../config/db.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    // ensure admin job exists
    let adminJob = await Job.findOne({ title: "Administrator" });
    if (!adminJob) {
      adminJob = new Job({
        title: "Administrator",
        description: "System administrator with full privileges",
      });
      await adminJob.save();
      console.log("✅ Job created:", adminJob.title);
    }

    // check if admin user already exists
    const adminExists = await User.findOne({ email: "admin@example.com" });
    if (adminExists) {
      console.log("⚠️ Admin user already exists");
      process.exit();
    }

    const admin = new User({
      name: "Admin User",
      username: "admin",
      email: "admin@example.com",
      password: "password123", // will get hashed in pre-save
      role: "admin",
      isAdmin: true,
      job: adminJob._id, // 🔑 link Job by ObjectId
    });

    await admin.save();
    console.log("✅ Admin user created successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding admin:", err.message);
    process.exit(1);
  }
};

seedAdmin();
