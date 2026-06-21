
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function scheduleLocalNotification({
  id,
  title,
  body,
  hour,
  minute,
  isPremium,
  timetableId,
}) {
  // Build next future date for this hour:minute
  const now = new Date();
  const triggerDate = new Date();

  triggerDate.setHours(hour);
  triggerDate.setMinutes(minute);
  triggerDate.setSeconds(0);
  triggerDate.setMilliseconds(0);

  // If time already passed today, push to tomorrow
  if (triggerDate <= now) {
    triggerDate.setDate(triggerDate.getDate() + 1);
  }

  console.log(
    `🕐 Scheduling "${title}" at ${triggerDate.toLocaleString()} (hour: ${hour}, minute: ${minute})`
  );

  // Android uses "daily" trigger, iOS uses "calendar" trigger
  const trigger =
    Platform.OS === "android"
      ? {
          type: "daily",
          hour,
          minute,
          channelId: isPremium ? "premium-alarm" : "default",
        }
      : {
          type: "calendar",
          hour,
          minute,
          second: 0,
          repeats: true,
        };

  return await Notifications.scheduleNotificationAsync({
    identifier: id,

    content: {
      title,
      body,
      sound: isPremium ? "alarm_sound.wav" : undefined,
      data: { timetableId },
    },

    trigger,
  });
}


// Pause notifications locally (no server call)
export const muteLocalNotifications = async (id) => {
  await hardCancelTimetableNotifications(id);
  // Mark as muted in storage so reactivate knows to restore
  const stored = await AsyncStorage.getItem(`timetable-${id}`);
  const data = stored ? JSON.parse(stored) : {};
  await AsyncStorage.setItem(`timetable-${id}`, JSON.stringify({
    ...data,
    ids: [],
    active: false,
    muted: true,
  }));
};

// Restore notifications locally
export const unmuteLocalNotifications = async (timetable) => {
  return await scheduleOfflineTimetable(timetable);
};

// Check local mute state
export const isLocallyMuted = async (id) => {
  try {
    const stored = await AsyncStorage.getItem(`timetable-${id}`);
    if (!stored) return false;
    const data = JSON.parse(stored);
    return data.muted === true;
  } catch { return false; }
};