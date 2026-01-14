import cron from "node-cron";
import User from "../models/User.js";

// Configuration: Days before deactivation
const INACTIVITY_LIMIT_DAYS = 90;

const startCleanupJob = () => {
  // Schedule task to run every day at midnight (00:00)
  // Cron syntax: Minute Hour DayOfMonth Month DayOfWeek
  cron.schedule("0 0 * * *", async () => {
    console.log("⏰ Running daily inactivity check...");

    try {
      // 1. Calculate the cutoff date
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - INACTIVITY_LIMIT_DAYS);

      // 2. Find and update users
      // Criteria: lastActive is older than cutoff AND they are currently active
      const result = await User.updateMany(
        {
          lastActive: { $lt: cutoffDate },
          isActive: true,
          role: { $ne: "admin" }, // Safety: Never deactivate admins automatically!
        },
        {
          $set: { isActive: false },
        },
      );

      if (result.modifiedCount > 0) {
        console.log(
          `📉 Deactivated ${result.modifiedCount} users due to inactivity.`,
        );
      } else {
        console.log("✅ No inactive users found today.");
      }
    } catch (error) {
      console.error("❌ Error running inactivity cleanup:", error);
    }
  });
};

export default startCleanupJob;
