import dotenv from "dotenv";
import User from "../models/User.js";
import Job from "../models/Job.js";
import { connectDB } from "../config/db.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    // 🔹 Step 1: Seed default jobs
    const jobData = [
      { title: "Administrator", description: "System administrator with full privileges" },
      { title: "Manager", description: "Manages teams and workflows" },
      { title: "Developer", description: "Builds and maintains features" },
    ];

    const seededJobs = {};
    for (const job of jobData) {
      let existingJob = await Job.findOne({ title: job.title });
      if (!existingJob) {
        existingJob = await Job.create(job);
        console.log(`✅ Job created: ${existingJob.title}`);
      } else {
        console.log(`⚠️ Job already exists: ${existingJob.title}`);
      }
      // store refs for later use
      seededJobs[job.title] = existingJob;
    }

    // 🔹 Step 2: Seed admin user if not already present
    const adminEmail = "admin@example.com";
    const adminExists = await User.findOne({ email: adminEmail });

    if (adminExists) {
      console.log("⚠️ Admin user already exists");
    } else {
      const admin = new User({
        name: "Admin User",
        username: "admin",
        email: adminEmail,
        password: "password123", // pre-save hook will hash
        role: "admin",
        isAdmin: true,
        job: seededJobs["Administrator"]._id, // 👈 Reference seeded job
      });

      await admin.save();
      console.log("✅ Admin user created successfully");
    }

    process.exit();
  } catch (err) {
    console.error("❌ Error seeding admin:", err.message);
    process.exit(1);
  }
};

seedAdmin();
