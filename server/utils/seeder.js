import dotenv from "dotenv";
import User from "../models/User.js";
import Job from "../models/Job.js";
import { connectDB } from "../config/db.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    // ⚠️ Danger zone: wipe collections
    await User.deleteMany({});
    console.log("🧹 Cleared Users collection");

    await Job.deleteMany({});
    console.log("🧹 Cleared Jobs collection");

    // 🔹 Step 1: Seed default jobs
    const jobData = [
      {
        title: "Administrator",
        description: "System administrator with full privileges",
      },
      { title: "Manager", description: "Manages teams and workflows" },
      { title: "Developer", description: "Builds and maintains features" },
    ];

    const seededJobs = {};
    for (const job of jobData) {
      const newJob = await Job.create(job);
      console.log(`✅ Job created: ${newJob.title}`);
      seededJobs[job.title] = newJob;
    }

    // 🔹 Step 2: Seed admin user
    const admin = new User({
      name: "Admin User",
      username: "admin",
      email: "admin@example.com",
      password: "password123", // pre-save hook will hash
      role: "admin",
      isAdmin: true,
      job: seededJobs["Administrator"]._id, // 👈 Reference Administrator job
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
