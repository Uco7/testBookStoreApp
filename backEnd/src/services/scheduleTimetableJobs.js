

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
    deliveryMode = "online",
  } = timetable;

  // =========================
  // 🚫 OFFLINE SHORT CIRCUIT
  // =========================
  // if (deliveryMode === "offline") {
  //   console.log("📴 Offline mode — skipping BullMQ scheduling");
  //   return [];
  // }

  if (!reminderTime) {
    throw new Error("Invalid reminderTime");
  }

  const base = moment(reminderTime, "HH:mm");

  if (!base.isValid()) {
    throw new Error("Invalid reminderTime format (expected HH:mm)");
  }

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
        const existing = await reminderQueue.getJob(jobId);
        if (existing) await existing.remove();

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