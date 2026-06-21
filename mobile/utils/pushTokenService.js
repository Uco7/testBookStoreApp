import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

export async function getExpoPushToken() {
  try {
    if (!Device.isDevice) return null;

    const { status: existing } =
      await Notifications.getPermissionsAsync();

    let final = existing;

    if (final !== "granted") {
      const { status } =
        await Notifications.requestPermissionsAsync();
      final = status;
    }

    if (final !== "granted") return null;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync(
        "default",
        {
          name: "Study Reminders",
          importance: Notifications.AndroidImportance.DEFAULT,
        }
      );

      await Notifications.setNotificationChannelAsync(
        "premium-alarm",
        {
          name: "Premium Alarm",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 1000, 500, 1000],
          sound: "alarm_sound.wav",
          bypassDnd: true,
        }
      );
    }

    const token =
      (await Notifications.getExpoPushTokenAsync()).data;

    return token;
  } catch (err) {
    console.log("Push token error:", err.message);
    return null;
  }
}