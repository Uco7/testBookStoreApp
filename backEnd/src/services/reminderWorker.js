

// import { Worker } from "bullmq";
// import { connection } from "./redis.js";
// import User from "../models/user.js";
// import { sendPushNotification } from "./pushNotification.js";
// import UserTimetable from "../models/userTimetable.js";




// export const reminderWorker = new Worker(
//   "reminders",
//   async (job) => {
//     try {
//       console.log("📨 JOB RUNNING:", job.id);

//       const {
//         timetableId,
//         userId,
//         mode,
//         bookTitle,
//         notificationMessage,
//         step,
//         total,
//       } = job.data;

//       if (!userId || !timetableId) {
//         console.log("❌ Missing required job data");
//         return;
//       }

//       const user = await User.findById(userId);
//       if (!user?.pushToken) {
//         console.log("❌ No pushToken:", userId);
//         return;
//       }

//       const timetable = await UserTimetable.findById(timetableId);
//       if (!timetable || !timetable.isActive) {
//         console.log("⛔ Timetable inactive, skipping");
//         return;
//       }

//       const title =
//         mode === "alarm"
//           ? `⏰ Study time on: ${bookTitle}`
//           : `📚 Reminder on: ${bookTitle}`;

//       const body =
//         notificationMessage?.trim() ||
//         (bookTitle ? `Study: ${bookTitle}` : "Study Time");

//       console.log("📋 Notification content:", { title, body });

//       const result = await sendPushNotification(
//         user.pushToken,
//         title,
//         body,
//         {
//           timetableId,
//           mode,
//           bookTitle,
//           step,
//           total,
//         }
//       );

//       console.log("📤 PUSH RESULT:", result);

//     } catch (err) {
//       console.log("❌ WORKER ERROR:", err);
//     }
//   },
//   {
//     connection,
//     concurrency: 5,
//   }
// );



import { Worker } from "bullmq";
import { connection } from "./redis.js";
import User from "../models/user.js";
import { sendPushNotification } from "./pushNotification.js";
import UserTimetable from "../models/userTimetable.js";

export const reminderWorker = new Worker(
  "reminders",
  async (job) => {
    try {
      console.log("📨 JOB RUNNING:", job.id);

      const {
        timetableId,
        userId,
        mode,
        bookTitle,
        notificationMessage,
        step,
        total,
      } = job.data;

      // =========================
      // ❌ VALIDATION
      // =========================
      if (!userId || !timetableId) {
        console.log("❌ Missing required job data");
        return;
      }

      // =========================
      // 👤 GET USER
      // =========================
      const user = await User.findById(userId);

      if (!user?.pushToken) {
        console.log("❌ No pushToken:", userId);
        return;
      }

      // =========================
      // 📅 GET TIMETABLE
      // =========================
      const timetable = await UserTimetable.findById(timetableId);

      if (!timetable) {
        console.log("❌ Timetable not found");
        return;
      }

      // =========================
      // 🚫 OFFLINE MODE GUARD
      // =========================
     if (timetable.deliveryMode === "offline" && !timetable.allowPushFallback) {
  console.log("📴 Fully offline timetable — skipping push worker");
  return;
}

      // =========================
      // ⛔ INACTIVE GUARD
      // =========================
      if (!timetable.isActive) {
        console.log("⛔ Timetable inactive, skipping");
        return;
      }

      // =========================
      // 📢 TITLE LOGIC
      // =========================
      const title =
        mode === "alarm"
          ? `⏰ Study time: ${bookTitle}`
          : `📚 Reminder: ${bookTitle}`;

      const body =
        notificationMessage?.trim() ||
        (bookTitle ? `Study: ${bookTitle}` : "Study Time");

      console.log("📋 Notification content:", { title, body });

      // =========================
      // 🚀 SEND PUSH NOTIFICATION
      // =========================
      const result = await sendPushNotification(
        user.pushToken,
        title,
        body,
        {
          timetableId,
          mode,
          bookTitle,
          step,
          total,
        }
      );

      console.log("📤 PUSH RESULT:", result);

    } catch (err) {
      console.log("❌ WORKER ERROR:", err.message);
    }
  },
  {
    connection,
    concurrency: 5,
  }
);