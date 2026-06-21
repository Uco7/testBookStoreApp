import { Queue } from "bullmq";
import { connection } from "./redis.js";

export const reminderQueue = new Queue("reminders", {
  connection,
});