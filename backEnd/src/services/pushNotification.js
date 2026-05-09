import { Expo } from "expo-server-sdk";

const expo = new Expo();

export const sendPushNotification = async (
  pushToken,
  title,
  body,
  data = {}
) => {
  try {
    if (!Expo.isExpoPushToken(pushToken)) {
      console.log("❌ Invalid push token:", pushToken);
      return;
    }

    const messages = [
      {
        to: pushToken,
        sound: "default",
        title,
        body,
        data,
      },
    ];

    const chunks = expo.chunkPushNotifications(messages);

    let tickets = [];

    for (const chunk of chunks) {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    }

    console.log("📩 Push Tickets:", tickets);

    return tickets;
  } catch (err) {
    console.error("❌ Push Error:", err);
  }
};