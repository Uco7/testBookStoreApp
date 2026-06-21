// import { Worker } from "bullmq";
// import { connection } from "./redis.js";
// import UserTimetable from "../models/userTimetable.js";
// import User from "../models/user.js";
// import { sendPushNotification } from "./pushNotification.js";

// export const startNotificationWorker = () => {
//   const worker = new Worker(
//     "notifications",
//     async (job) => {
//       const { timetableId } = job.data;

//       const timetable = await UserTimetable.findById(timetableId);
//       if (!timetable?.isActive) return;

//       const user = await User.findById(timetable.userId);
//       if (!user?.pushToken) return;

//       const isPremiumAlarm = timetable.mode === "alarm";

//       await sendPushNotification({
//         pushToken: user.pushToken,
//         title: "📚 Study Reminder",
//         body: "Time to continue your reading session",
//         data: {
//           timetableId,
//           mode: timetable.mode,
//           isPremiumAlarm, // 👈 IMPORTANT FLAG
//         },
//       });

//       timetable.lastTriggeredAt = new Date();
//       await timetable.save();
//     },
//     { connection, concurrency: 10 }
//   );

//   worker.on("completed", (job) => {
//     console.log("✅ Job completed:", job.id);
//   });

//   worker.on("failed", (job, err) => {
//     console.log("❌ Job failed:", job?.id, err.message);
//   });

//   console.log("🚀 Notification worker running");
// };