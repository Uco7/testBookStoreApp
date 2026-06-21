

import * as Notifications from "expo-notifications"; // ← THIS WAS MISSING
import { scheduleLocalNotification } from "./notificationService";

export async function scheduleTimetableLocally(timetable) {
  const [baseHour, baseMinute] = timetable.reminderTime
    .split(":")
    .map(Number);

  const isPremium = timetable.planType === "premium";
  const noticeCount = timetable.noticeCount || 1;
  const SPACING_MINUTES = 5;

  // Cancel old notifications before scheduling new ones
  await cancelTimetableNotifications(timetable._id, noticeCount);

  const scheduledIds = [];

  for (let i = 0; i < noticeCount; i++) {
    const totalMinutes = baseHour * 60 + baseMinute + i * SPACING_MINUTES;
    const hour = Math.floor(totalMinutes / 60) % 24;
    const minute = totalMinutes % 60;

    const notificationId = `${timetable._id}-reminder-${i}`;

    const noticeLabel = noticeCount > 1 ? ` (${i + 1}/${noticeCount})` : "";

    const title = isPremium
      ? `⏰ Study Time${noticeLabel}`
      : `📚 Study Reminder${noticeLabel}`;

    const result = await scheduleLocalNotification({
      id: notificationId,
      title,
      body: timetable.notificationMessage || "Time to study",
      hour,
      minute,
      isPremium,
      timetableId: timetable._id,
    });

    scheduledIds.push(result);

    console.log(
      `✅ Notice ${i + 1}/${noticeCount} → ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
    );
  }

  return scheduledIds;
}

async function cancelTimetableNotifications(timetableId, noticeCount) {
  for (let i = 0; i < noticeCount; i++) {
    const notificationId = `${timetableId}-reminder-${i}`;
    await Notifications.cancelScheduledNotificationAsync(notificationId).catch(
      () => {}
    );
  }
  console.log(`🗑️ Cancelled old notifications for timetable: ${timetableId}`);
}