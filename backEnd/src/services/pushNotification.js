

// // export const sendPushNotification = async (
// //   pushToken,
// //   title,
// //   body,
// //   data = {}
// // ) => {
// //   try {
// //     if (
// //       !pushToken ||
// //       typeof pushToken !== "string" ||
// //       (!pushToken.startsWith("ExponentPushToken") &&
// //         !pushToken.startsWith("ExpoPushToken"))
// //     ) {
// //       console.log("❌ Invalid token");
// //       return;
// //     }

// //     const isAlarm = data?.mode === "alarm";

// //     const payload = {
// //       to: pushToken,
// //       title,
// //       body,
// //       sound: isAlarm ? "alarm_sound.wav" : "default",
// //       priority: "high",
// //       channelId: isAlarm ? "premium-alarm" : "default",
// //       data,
// //     };

// //     const res = await fetch("https://exp.host/--/api/v2/push/send", {
// //       method: "POST",
// //       headers: {
// //         Accept: "application/json",
// //         "Content-Type": "application/json",
// //       },
// //       body: JSON.stringify(payload),
// //     });

// //     return await res.json();
// //   } catch (err) {
// //     console.log("❌ Push error:", err.message);
// //   }
// // };


// export const sendPushNotification = async (
//   pushToken,
//   title,
//   body,
//   data = {}
// ) => {
//   try {
//     // =========================
//     // 🔐 TOKEN VALIDATION
//     // =========================
//     if (
//       !pushToken ||
//       typeof pushToken !== "string" ||
//       (!pushToken.startsWith("ExponentPushToken") &&
//         !pushToken.startsWith("ExpoPushToken"))
//     ) {
//       console.log("❌ Invalid push token");
//       return { success: false, reason: "invalid_token" };
//     }

//     const isAlarm = data?.mode === "alarm";

//     // =========================
//     // 📦 EXPO PUSH PAYLOAD
//     // =========================
//     const payload = {
//       to: pushToken,
//       title,
//       body,

//       // 🔊 sound handling
//       // sound: isAlarm ? "alarm_sound.wav" : "default",

//       // priority: "high",

//       // // 📱 Android channel
//       // channelId: isAlarm ? "premium-alarm" : "default",


//       sound: isAlarm ? "alarm_sound.wav" : "default",
// channelId: isAlarm ? "premium-alarm" : "default",
// priority: "high",

//       data: {
//         ...data,
//         sentAt: Date.now(),
//       },
//     };

//     // =========================
//     // 🚀 SEND REQUEST
//     // =========================
//     const res = await fetch("https://exp.host/--/api/v2/push/send", {
//       method: "POST",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payload),
//     });

//     const result = await res.json();

//     // =========================
//     // ⚠️ EXPO ERROR HANDLING
//     // =========================
//     if (!res.ok) {
//       console.log("❌ Expo push failed:", result);
//       return {
//         success: false,
//         reason: "expo_error",
//         details: result,
//       };
//     }

//     // =========================
//     // 📊 RESPONSE VALIDATION
//     // =========================
//     if (result?.data?.status === "error") {
//       console.log("❌ Push rejected:", result.data);
//       return {
//         success: false,
//         reason: "rejected",
//         details: result.data,
//       };
//     }

//     return {
//       success: true,
//       response: result,
//     };

//   } catch (err) {
//     console.log("❌ Push error:", err.message);

//     return {
//       success: false,
//       reason: "exception",
//       message: err.message,
//     };
//   }
// };


// Must match the channel ID created in app/_layout.js's
// setupNotificationChannels(). Adjust the import path to match your
// actual project structure, or inline the literal string
// "premium-alarm-v2" if importing across server/app boundaries is
// awkward (e.g. this runs on a Node server, not in the Expo app).
//
// IMPORTANT: this file looks like it runs on your backend (it's
// alongside reminderWorker.js / scheduleTimetableJobs.js, not in the
// Expo app folder). If so, you can't literally `import` from the
// Expo app's _layout.js across that boundary — just hardcode the
// same literal string here and keep both in sync manually, or better,
// move the channel ID constant into a small shared/shared-constants
// file that both the app and server import from (if they're in a
// monorepo) or just copy the literal value.
const PREMIUM_ALARM_CHANNEL_ID = "premium-alarm-v2";

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
      sound: isAlarm ? "alarm_sound.wav" : "default",

      // FIX: this channelId must match the channel ID that was
      // actually created on the device with this sound. Bumped to
      // PREMIUM_ALARM_CHANNEL_ID so it follows the same versioned ID
      // as the local-notification path and _layout.js's channel setup.
      channelId: isAlarm ? PREMIUM_ALARM_CHANNEL_ID : "default",
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