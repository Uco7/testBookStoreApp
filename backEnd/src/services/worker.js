import cron from "node-cron";
import { schedulerService } from "./schedulerService.js";

export const startScheduler = () => {
  cron.schedule("* * * * *", async () => {
    try {
      await schedulerService();
    } catch (err) {
      console.log("❌ Scheduler error:", err.message);
    }
  });

  console.log("🚀 Scheduler started (1 min interval)");
};