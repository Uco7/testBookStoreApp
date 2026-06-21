



import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

const dayMap = {
  Sunday: 1,
  Monday: 2,
  Tuesday: 3,
  Wednesday: 4,
  Thursday: 5,
  Friday: 6,
  Saturday: 7,
};

// =========================
// SCHEDULE OFFLINE TIMETABLE
// Cancels any existing notifications for this id,
// then schedules new weekly triggers for each study day.
// Persists notification ids + state to AsyncStorage.
// =========================
export const scheduleOfflineTimetable = async (timetable) => {
  try {
    const id = timetable._id;

    await hardCancelTimetableNotifications(id);

    const [hour, minute] = timetable.reminderTime.split(":").map(Number);

    const days =
      timetable.reminderType === "daily"
        ? Object.keys(dayMap)
        : timetable.studyDays || [];

    const ids = [];

    for (const day of days) {
      const weekday = dayMap[day];
      if (!weekday) continue;

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title:
            timetable.planType === "premium"
              ? `⏰ Study time: ${timetable.bookTitle}`
              : `📚 Reminder: ${timetable.bookTitle}`,

          body: timetable.notificationMessage || "Study time",

          sound:
            timetable.planType === "premium" ? "alarm_sound" : "default",

          data: {
            timetableId: id,
            mode: timetable.mode,
          },
        },

        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday,
          hour,
          minute,
        },
      });

      ids.push(notificationId);
    }

    await AsyncStorage.setItem(
      `timetable-${id}`,
      JSON.stringify({
        ids,
        mode: "offline",
        active: true,
        muted: false,
      })
    );

    console.log(`📅 Scheduled ${ids.length} notification(s) for timetable:`, id);
    return ids;
  } catch (err) {
    console.log("Offline schedule error:", err.message);
    return [];
  }
};

// =========================
// HARD CANCEL
// Cancels all local notifications for a timetable and removes
// its AsyncStorage entry. Used by stop, delete, and reactivate.
// =========================
export const hardCancelTimetableNotifications = async (id) => {
  try {
    const stored = await AsyncStorage.getItem(`timetable-${id}`);

    if (stored) {
      const data = JSON.parse(stored);

      if (data?.ids?.length) {
        await Promise.all(
          data.ids.map((notificationId) =>
            Notifications.cancelScheduledNotificationAsync(notificationId)
          )
        );
      }
    }

    // Safety net: scan all scheduled notifications for this timetable id
    const all = await Notifications.getAllScheduledNotificationsAsync();

    const matches = all.filter(
      (n) => n.content?.data?.timetableId === id
    );

    await Promise.all(
      matches.map((n) =>
        Notifications.cancelScheduledNotificationAsync(n.identifier)
      )
    );

    await AsyncStorage.removeItem(`timetable-${id}`);

    console.log("🧹 HARD CANCEL COMPLETE:", id);
  } catch (err) {
    console.log("Hard cancel error:", err.message);
  }
};

// =========================
// MUTE LOCAL NOTIFICATIONS
// Cancels notifications on device without touching the server.
// The timetable stays active on the server. Marks muted=true in
// AsyncStorage so the detail screen can reflect the correct state.
// =========================
export const muteLocalNotifications = async (id) => {
  try {
    // Cancel all scheduled notifications for this timetable
    const stored = await AsyncStorage.getItem(`timetable-${id}`);

    if (stored) {
      const data = JSON.parse(stored);

      if (data?.ids?.length) {
        await Promise.all(
          data.ids.map((notificationId) =>
            Notifications.cancelScheduledNotificationAsync(notificationId)
          )
        );
      }
    }

    // Safety net scan
    const all = await Notifications.getAllScheduledNotificationsAsync();
    const matches = all.filter((n) => n.content?.data?.timetableId === id);
    await Promise.all(
      matches.map((n) =>
        Notifications.cancelScheduledNotificationAsync(n.identifier)
      )
    );

    // Mark as muted — keep the entry so unmute knows it was active
    await AsyncStorage.setItem(
      `timetable-${id}`,
      JSON.stringify({
        ids: [],
        mode: "offline",
        active: true,   // still active on the server
        muted: true,    // locally silenced
      })
    );

    console.log("🔕 Notifications muted locally:", id);
  } catch (err) {
    console.log("Mute local error:", err.message);
    throw err;
  }
};

// =========================
// UNMUTE LOCAL NOTIFICATIONS
// Re-schedules notifications from the timetable data.
// Requires the full timetable object (same shape as scheduleOfflineTimetable).
// =========================
export const unmuteLocalNotifications = async (timetable) => {
  try {
    const ids = await scheduleOfflineTimetable(timetable);
    console.log("🔔 Notifications unmuted locally:", timetable._id);
    return ids;
  } catch (err) {
    console.log("Unmute local error:", err.message);
    throw err;
  }
};

// =========================
// IS LOCALLY MUTED
// Returns true if notifications for this timetable are currently
// muted on the device (server state is irrelevant here).
// =========================
export const isLocallyMuted = async (id) => {
  try {
    const stored = await AsyncStorage.getItem(`timetable-${id}`);
    if (!stored) return false;
    const data = JSON.parse(stored);
    return data.muted === true;
  } catch (err) {
    console.log("isLocallyMuted error:", err.message);
    return false;
  }
};