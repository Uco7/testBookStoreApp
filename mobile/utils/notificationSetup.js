import * as Notifications from "expo-notifications";
import { useEffect } from "react";

export function useNotificationChannels() {
  useEffect(() => {
    async function setup() {
      // 🔥 PREMIUM ALARM CHANNEL
      await Notifications.setNotificationChannelAsync("premium-alarm", {
        name: "Premium Alarm",
        importance: Notifications.AndroidImportance.MAX,
        sound: "alarm_sound.wav", // MUST MATCH EXACT FILE
        vibrationPattern: [0, 500, 500, 500],
        lockscreenVisibility:
          Notifications.AndroidNotificationVisibility.PUBLIC,
      });

      // DEFAULT CHANNEL
      await Notifications.setNotificationChannelAsync("default", {
        name: "Default",
        importance: Notifications.AndroidImportance.DEFAULT,
        sound: undefined,
      });
    }

    setup();
  }, []);
}