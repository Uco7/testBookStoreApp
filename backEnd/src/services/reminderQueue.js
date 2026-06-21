
// // ======================end================
// import { Queue } from "bullmq";
// import { connection } from "./redis.js";

// export const reminderQueue = new Queue("reminders", {
//   connection,
//   defaultJobOptions: {
//     removeOnComplete: true,
//     removeOnFail: false,
//   },
// });


import { Queue } from "bullmq";
import { connection } from "./redis.js";

export const reminderQueue = new Queue("reminders", {
  connection,

  // =========================
  // 🔧 DEFAULT JOB BEHAVIOUR
  // =========================
  defaultJobOptions: {
    removeOnComplete: {
      age: 3600, // keep for 1 hour for debugging
      count: 1000,
    },

    removeOnFail: {
      age: 24 * 3600, // keep failed jobs for 1 day
    },

    attempts: 3,

    backoff: {
      type: "exponential",
      delay: 5000,
    },
  },
});