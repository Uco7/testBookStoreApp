
// // =========== ==========end================


// import IORedis from "ioredis";
// import dotenv from "dotenv";

// dotenv.config();

// export const connection = new IORedis(process.env.REDIS_URL, {
//   maxRetriesPerRequest: null,
//   enableReadyCheck: false,
// });

// connection.on("connect", () => {
//   console.log("🔌 Redis connecting...");
// });

// connection.on("ready", () => {
//   console.log("✅ Redis READY");
// });

// connection.on("error", (err) => {
//   console.log("❌ Redis error:", err.message);
// });


import IORedis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

export const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

// =========================
// 🔌 CONNECTION EVENTS
// =========================
connection.on("connect", () => {
  console.log("🔌 Redis connecting...");
});

connection.on("ready", () => {
  console.log("✅ Redis READY");
});

connection.on("reconnecting", () => {
  console.log("🔄 Redis reconnecting...");
});

connection.on("end", () => {
  console.log("⚠️ Redis connection closed");
});

connection.on("error", (err) => {
  console.log("❌ Redis error:", err.message);
});

// =========================
// 🚨 SAFETY: PREVENT CRASHES
// =========================
process.on("unhandledRejection", (err) => {
  console.log("⚠️ Unhandled Rejection:", err?.message || err);
});

process.on("uncaughtException", (err) => {
  console.log("⚠️ Uncaught Exception:", err?.message || err);
});