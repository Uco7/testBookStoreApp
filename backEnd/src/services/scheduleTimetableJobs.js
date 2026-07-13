

// // // ======================= IGNORE BELOW THIS LINE ======================


// // import { reminderQueue } from "./reminderQueue.js";
// // import moment from "moment";

// // const dayMap = {
// //   Sunday: 0,
// //   Monday: 1,
// //   Tuesday: 2,
// //   Wednesday: 3,
// //   Thursday: 4,
// //   Friday: 5,
// //   Saturday: 6,
// // };

// // export const scheduleTimetableJobs = async (timetable) => {
// //   const {
// //     _id,
// //     userId,
// //     reminderTime,
// //     noticeCount = 1,
// //     studyDays = [],
// //     reminderType,
// //     mode,
// //         notificationMessage, // ✅ NEW

// //     bookTitle,
// //   } = timetable;

// //   const base = moment(reminderTime, "HH:mm");

// //   const days =
// //     reminderType === "daily" || studyDays.length === 0
// //       ? Object.keys(dayMap)
// //       : studyDays;

// //   for (const day of days) {
// //     const weekday = dayMap[day];

// //     for (let i = 0; i < noticeCount; i++) {
// //       const triggerTime = moment(base).add(i * 5, "minutes");

// //       await reminderQueue.add(
// //         "send-reminder",
// //         {
// //          timetableId: _id, // ✅ ADD THIS

// //           userId,
// //           mode,
// //           bookTitle,
// //           step: i + 1,
// //           total: noticeCount,
// //               notificationMessage: timetable.notificationMessage,

// //         },
// //         {
// //           repeat: {
// //             pattern: `${triggerTime.minute()} ${triggerTime.hour()} * * ${weekday}`,
// //             tz: "Africa/Lagos",
// //           },
// //           jobId: `${_id}-${day}-${i}`,
// //         }
// //       );
// //     }
// //   }

// //   console.log("✅ Timetable scheduled:", _id);
// // };




// import { reminderQueue } from "./reminderQueue.js";
// import moment from "moment";

// const dayMap = {
//   Sunday: 0,
//   Monday: 1,
//   Tuesday: 2,
//   Wednesday: 3,
//   Thursday: 4,
//   Friday: 5,
//   Saturday: 6,
// };

// export const scheduleTimetableJobs = async (timetable) => {
//   const {
//     _id,
//     userId,
//     reminderTime,
//     noticeCount = 1,
//     studyDays = [],
//     reminderType,
//     mode,
//     notificationMessage,
//     bookTitle,
//   } = timetable;

//   if (!reminderTime) {
//     throw new Error("Invalid reminderTime");
//   }

//   const base = moment(reminderTime, "HH:mm");

//   if (!base.isValid()) {
//     throw new Error("Invalid reminderTime format (expected HH:mm)");
//   }

//   const days =
//     reminderType === "daily" || studyDays.length === 0
//       ? Object.keys(dayMap)
//       : studyDays;

//   const jobIds = [];

//   for (const day of days) {
//     const weekday = dayMap[day];

//     if (weekday === undefined) {
//       console.log("⚠️ Skipping invalid day:", day);
//       continue;
//     }

//     for (let i = 0; i < noticeCount; i++) {
//       const triggerTime = moment(base).add(i * 5, "minutes");

//       const jobId = `${_id}-${day}-${i}`;

//       try {
//         // prevent duplicates
//         const existing = await reminderQueue.getJob(jobId);
//         if (existing) {
//           await existing.remove();
//         }

//         await reminderQueue.add(
//           "send-reminder",
//           {
//             timetableId: _id,
//             userId,
//             mode,
//             bookTitle,
//             step: i + 1,
//             total: noticeCount,
//             notificationMessage,
//           },
//           {
//             jobId,
//             repeat: {
//               pattern: `${triggerTime.minute()} ${triggerTime.hour()} * * ${weekday}`,
//               tz: "Africa/Lagos",
//             },
//           }
//         );

//         jobIds.push(jobId);

//       } catch (err) {
//         console.log("❌ Job add failed:", err.message);
//       }
//     }
//   }

//   return jobIds;
// };




// import { reminderQueue } from "./reminderQueue.js";
// import moment from "moment";

// const dayMap = {
//   Sunday: 0,
//   Monday: 1,
//   Tuesday: 2,
//   Wednesday: 3,
//   Thursday: 4,
//   Friday: 5,
//   Saturday: 6,
// };

// export const scheduleTimetableJobs = async (timetable) => {
//   const {
//     _id,
//     userId,
//     reminderTime,
//     noticeCount = 1,
//     studyDays = [],
//     reminderType,
//     mode,
//     notificationMessage,
//     bookTitle,
//     deliveryMode = "online",
//   } = timetable;

//   // =========================
//   // 🚫 OFFLINE SHORT CIRCUIT
//   // =========================
//   // if (deliveryMode === "offline") {
//   //   console.log("📴 Offline mode — skipping BullMQ scheduling");
//   //   return [];
//   // }

//   if (!reminderTime) {
//     throw new Error("Invalid reminderTime");
//   }

//   const base = moment(reminderTime, "HH:mm");

//   if (!base.isValid()) {
//     throw new Error("Invalid reminderTime format (expected HH:mm)");
//   }

//   const days =
//     reminderType === "daily" || studyDays.length === 0
//       ? Object.keys(dayMap)
//       : studyDays;

//   const jobIds = [];

//   for (const day of days) {
//     const weekday = dayMap[day];

//     if (weekday === undefined) continue;

//     for (let i = 0; i < noticeCount; i++) {
//       const triggerTime = moment(base).add(i * 5, "minutes");

//       const jobId = `${_id}-${day}-${i}`;

//       try {
//         const existing = await reminderQueue.getJob(jobId);
//         if (existing) await existing.remove();

//         await reminderQueue.add(
//           "send-reminder",
//           {
//             timetableId: _id,
//             userId,
//             mode,
//             bookTitle,
//             step: i + 1,
//             total: noticeCount,
//             notificationMessage,
//           },
//           {
//             jobId,
//             repeat: {
//               pattern: `${triggerTime.minute()} ${triggerTime.hour()} * * ${weekday}`,
//               tz: "Africa/Lagos",
//             },
//           }
//         );

//         jobIds.push(jobId);
//       } catch (err) {
//         console.log("❌ Job add failed:", err.message);
//       }
//     }
//   }

//   console.log("✅ Timetable scheduled (online):", _id);

//   return jobIds;
// };



import { reminderQueue } from "./reminderQueue.js";
import moment from "moment";

const dayMap = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

// =========================
// CANCEL ALL REPEATABLE JOBS FOR A TIMETABLE
// BullMQ repeat definitions live separately from regular jobs in
// Redis. reminderQueue.getJob(jobId) + job.remove() does NOT remove
// them — you have to look them up via getRepeatableJobs() and remove
// by key, or they keep firing on schedule forever.
// =========================
export const cancelTimetableJobs = async (timetableId) => {
  try {
    const idStr = String(timetableId);
    const repeatables = await reminderQueue.getRepeatableJobs();

    const toRemove = repeatables.filter(
      (r) => r.id === idStr || r.id?.startsWith(`${idStr}-`)
    );

    await Promise.all(
      toRemove.map((r) => reminderQueue.removeRepeatableByKey(r.key))
    );

    console.log(
      `🧹 Cancelled ${toRemove.length} repeatable job(s) for timetable:`,
      idStr
    );

    return toRemove.length;
  } catch (err) {
    console.log("❌ cancelTimetableJobs error:", err.message);
    return 0;
  }
};

export const scheduleTimetableJobs = async (timetable) => {
  const {
    _id,
    userId,
    reminderTime,
    noticeCount = 1,
    studyDays = [],
    reminderType,
    mode,
    notificationMessage,
    bookTitle,
  } = timetable;

  if (!reminderTime) {
    throw new Error("Invalid reminderTime");
  }

  const base = moment(reminderTime, "HH:mm");

  if (!base.isValid()) {
    throw new Error("Invalid reminderTime format (expected HH:mm)");
  }

  // Clean slate first — prevents an old pattern (e.g. previous
  // reminderTime/days) from surviving alongside the new one.
  await cancelTimetableJobs(_id);

  const days =
    reminderType === "daily" || studyDays.length === 0
      ? Object.keys(dayMap)
      : studyDays;

  const jobIds = [];

  for (const day of days) {
    const weekday = dayMap[day];
    if (weekday === undefined) continue;

    for (let i = 0; i < noticeCount; i++) {
      const triggerTime = moment(base).add(i * 5, "minutes");
      const jobId = `${_id}-${day}-${i}`;

      try {
        await reminderQueue.add(
          "send-reminder",
          {
            timetableId: _id,
            userId,
            mode,
            bookTitle,
            step: i + 1,
            total: noticeCount,
            notificationMessage,
          },
          {
            jobId,
            repeat: {
              pattern: `${triggerTime.minute()} ${triggerTime.hour()} * * ${weekday}`,
              tz: "Africa/Lagos",
            },
          }
        );

        jobIds.push(jobId);
      } catch (err) {
        console.log("❌ Job add failed:", err.message);
      }
    }
  }

  console.log("✅ Timetable scheduled (online):", _id);

  return jobIds;
};