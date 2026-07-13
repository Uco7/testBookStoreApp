import { reminderQueue } from "../reminderQueue.js";

const jobs = await reminderQueue.getRepeatableJobs();

for (const job of jobs) {
  await reminderQueue.removeRepeatableByKey(job.key);
  console.log("Removed:", job.key);
}

console.log("✅ All repeat jobs cleared");
process.exit();


// scripts/cleanupOrphanedJobs.js


// import mongoose from "mongoose";
// import { reminderQueue } from "../reminderQueue.js";
// import UserTimetable from "../../models/userTimetable.js";

// await mongoose.connect(process.env.MONGO_URI);

// const repeatables = await reminderQueue.getRepeatableJobs();
// console.log(`Found ${repeatables.length} repeatable job(s) in Redis`);

// for (const r of repeatables) {
//   const timetableId = r.id?.split("-")[0]; // jobId format: `${_id}-${day}-${i}`
//   if (!timetableId) continue;

//   const stillActive = await UserTimetable.exists({ _id: timetableId, isActive: true });

//   if (!stillActive) {
//     await reminderQueue.removeRepeatableByKey(r.key);
//     console.log("🧹 Removed orphaned repeat:", r.id);
//   }
// }

// console.log("Done.");
// process.exit(0);