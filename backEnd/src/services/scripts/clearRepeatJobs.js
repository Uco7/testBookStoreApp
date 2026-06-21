import { reminderQueue } from "../reminderQueue.js";

const jobs = await reminderQueue.getRepeatableJobs();

for (const job of jobs) {
  await reminderQueue.removeRepeatableByKey(job.key);
  console.log("Removed:", job.key);
}

console.log("✅ All repeat jobs cleared");
process.exit();