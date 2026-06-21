

// export const sendPushNotification = async (
//   pushToken,
//   title,
//   body,
//   data = {}
// ) => {
//   try {
//     if (
//       !pushToken ||
//       typeof pushToken !== "string" ||
//       (!pushToken.startsWith("ExponentPushToken") &&
//         !pushToken.startsWith("ExpoPushToken"))
//     ) {
//       console.log("❌ Invalid token");
//       return;
//     }

//     const isAlarm = data?.mode === "alarm";

//     const payload = {
//       to: pushToken,
//       title,
//       body,
//       sound: isAlarm ? "alarm_sound.wav" : "default",
//       priority: "high",
//       channelId: isAlarm ? "premium-alarm" : "default",
//       data,
//     };

//     const res = await fetch("https://exp.host/--/api/v2/push/send", {
//       method: "POST",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payload),
//     });

//     return await res.json();
//   } catch (err) {
//     console.log("❌ Push error:", err.message);
//   }
// };


export const sendPushNotification = async (
  pushToken,
  title,
  body,
  data = {}
) => {
  try {
    // =========================
    // 🔐 TOKEN VALIDATION
    // =========================
    if (
      !pushToken ||
      typeof pushToken !== "string" ||
      (!pushToken.startsWith("ExponentPushToken") &&
        !pushToken.startsWith("ExpoPushToken"))
    ) {
      console.log("❌ Invalid push token");
      return { success: false, reason: "invalid_token" };
    }

    const isAlarm = data?.mode === "alarm";

    // =========================
    // 📦 EXPO PUSH PAYLOAD
    // =========================
    const payload = {
      to: pushToken,
      title,
      body,

      // 🔊 sound handling
      // sound: isAlarm ? "alarm_sound.wav" : "default",

      // priority: "high",

      // // 📱 Android channel
      // channelId: isAlarm ? "premium-alarm" : "default",


      sound: isAlarm ? "alarm_sound.wav" : "default",
channelId: isAlarm ? "premium-alarm" : "default",
priority: "high",

      data: {
        ...data,
        sentAt: Date.now(),
      },
    };

    // =========================
    // 🚀 SEND REQUEST
    // =========================
    const res = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await res.json();

    // =========================
    // ⚠️ EXPO ERROR HANDLING
    // =========================
    if (!res.ok) {
      console.log("❌ Expo push failed:", result);
      return {
        success: false,
        reason: "expo_error",
        details: result,
      };
    }

    // =========================
    // 📊 RESPONSE VALIDATION
    // =========================
    if (result?.data?.status === "error") {
      console.log("❌ Push rejected:", result.data);
      return {
        success: false,
        reason: "rejected",
        details: result.data,
      };
    }

    return {
      success: true,
      response: result,
    };

  } catch (err) {
    console.log("❌ Push error:", err.message);

    return {
      success: false,
      reason: "exception",
      message: err.message,
    };
  }
};