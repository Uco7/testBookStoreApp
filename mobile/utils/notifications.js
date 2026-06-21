// import * as Device from "expo-device";
// import * as Notifications from "expo-notifications";
// import Constants from "expo-constants";
// import { Platform } from "react-native";

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//   }),
// });

// export async function registerForPushNotificationsAsync() {
//   if (!Device.isDevice) return null;

//   let token;

//   if (Platform.OS === "android") {
//     await Notifications.setNotificationChannelAsync("default", {
//       name: "default",
//       importance: Notifications.AndroidImportance.MAX,
//     });
//   }

//   const { status: existingStatus } =
//     await Notifications.getPermissionsAsync();

//   let finalStatus = existingStatus;

//   if (existingStatus !== "granted") {
//     const { status } =
//       await Notifications.requestPermissionsAsync();
//     finalStatus = status;
//   }

//   if (finalStatus !== "granted") return null;

//   const projectId =
//     Constants.expoConfig?.extra?.eas?.projectId ??
//     Constants.easConfig?.projectId;
//     console.log("Project ID for Push Notifications:", projectId);

//   token = (
//     await Notifications.getExpoPushTokenAsync({ projectId })
//   ).data;

//   console.log("Push Token:", token);

//   return token;
// }


import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotificationsAsync() {
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
}