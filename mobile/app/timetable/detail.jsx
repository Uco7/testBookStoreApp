// import React, { useEffect, useState, useCallback } from "react";
// import {
//   View,
//   StyleSheet,
//   ActivityIndicator,
//   Alert,
//   Pressable,
//   ScrollView,
//   Switch,
// } from "react-native";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";

// import ThemeView from "../../component/ThemeView";
// import ThemeText from "../../component/ThemeText";
// import CardTheme from "../../component/CardTheme";
// import ThemeButton from "../../component/ThemeButton";

// import { colors } from "../../constant/colors";
// import { useTimetable } from "../../hook/useTimeTable";

// export default function TimetableDetailScreen() {
//   const router = useRouter();
//   const { timetableId } = useLocalSearchParams();

//   const {
//     getTimetableById,
//     stopTimetable,
//     reactivateTimetable,
//     muteNotifications,
//     unmuteNotifications,
//     getLocalMuteState,
//   } = useTimetable();

//   const [loading, setLoading] = useState(true);
//   const [processing, setProcessing] = useState(false);
//   const [muteProcessing, setMuteProcessing] = useState(false);

//   const [timetable, setTimetable] = useState(null);
//   const [isActive, setIsActive] = useState(null);
//   const [locallyMuted, setLocallyMuted] = useState(false);

//   const id = Array.isArray(timetableId) ? timetableId[0] : timetableId;

//   // =========================
//   // DERIVED STATE
//   // Whether this timetable supports local mute.
//   // Online-only timetables are controlled by the server, not the device.
//   // =========================
//   const canMuteLocally =
//     timetable?.deliveryMode === "offline" ||
//     timetable?.deliveryMode === "hybrid";

//   // =========================
//   // LOAD TIMETABLE + MUTE STATE
//   // =========================
//   const loadTimetable = useCallback(async () => {
//     if (!id) {
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);

//       const [data, muted] = await Promise.all([
//         getTimetableById(id),
//         getLocalMuteState(id),
//       ]);

//       setTimetable(data || null);
//       setIsActive(data?.isActive ?? null);
//       setLocallyMuted(muted);
//     } catch (err) {
//       console.log("❌ Load error:", err?.message);
//       Alert.alert("Error", "Failed to load timetable");
//     } finally {
//       setLoading(false);
//     }
//   }, [id]);

//   useEffect(() => {
//     loadTimetable();
//   }, [loadTimetable]);

//   // =========================
//   // STOP TIMETABLE (server + local)
//   // =========================
//   const handleStop = async () => {
//     if (processing) return;

//     Alert.alert(
//       "Stop timetable?",
//       "This will stop all reminders and mark the timetable as inactive on the server. You can reactivate it later.",
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Stop",
//           style: "destructive",
//           onPress: async () => {
//             try {
//               setProcessing(true);
//               await stopTimetable(id);
//               setIsActive(false);
//               setLocallyMuted(false);
//               setTimetable((prev) =>
//                 prev ? { ...prev, isActive: false } : prev
//               );
//               Alert.alert("Stopped", "Timetable stopped successfully.");
//             } catch (err) {
//               console.log("❌ Stop error:", err?.message);
//               Alert.alert(
//                 "Error",
//                 err?.response?.data?.message || "Failed to stop timetable"
//               );
//             } finally {
//               setProcessing(false);
//             }
//           },
//         },
//       ]
//     );
//   };

//   // =========================
//   // REACTIVATE TIMETABLE (server + local)
//   // =========================
//   const handleReactivate = async () => {
//     if (processing) return;

//     try {
//       setProcessing(true);
//       await reactivateTimetable(id);
//       setIsActive(true);
//       setLocallyMuted(false);
//       setTimetable((prev) => (prev ? { ...prev, isActive: true } : prev));
//       Alert.alert("Reactivated", "Timetable is active again.");
//     } catch (err) {
//       console.log("❌ Reactivate error:", err?.message);
//       Alert.alert(
//         "Error",
//         err?.response?.data?.message || "Failed to reactivate timetable"
//       );
//     } finally {
//       setProcessing(false);
//     }
//   };

//   // =========================
//   // MUTE / UNMUTE (local only)
//   // Does not affect the server — timetable stays active.
//   // Only for offline / hybrid delivery modes.
//   // =========================
//   const handleMuteToggle = async (value) => {
//     // value = true means user wants notifications ON (unmute)
//     // value = false means user wants notifications OFF (mute)
//     if (muteProcessing) return;

//     try {
//       setMuteProcessing(true);

//       if (value) {
//         // Unmute: rebuild local schedule from the current timetable data
//         await unmuteNotifications({
//           _id: timetable._id,
//           reminderTime: timetable.reminderTime,
//           reminderType: timetable.reminderType,
//           studyDays: timetable.studyDays,
//           notificationMessage: timetable.notificationMessage,
//           planType: timetable.planType,
//           bookTitle: timetable.bookId?.title || "Study Reminder",
//           mode: timetable.deliveryMode,
//         });
//         setLocallyMuted(false);
//       } else {
//         // Mute: cancel local notifications, mark muted in storage
//         await muteNotifications(id);
//         setLocallyMuted(true);
//       }
//     } catch (err) {
//       console.log("❌ Mute toggle error:", err?.message);
//       Alert.alert("Error", "Failed to update notification setting.");
//     } finally {
//       setMuteProcessing(false);
//     }
//   };

//   // =========================
//   // LOADING STATE
//   // =========================
//   if (loading) {
//     return (
//       <ThemeView safe style={styles.center}>
//         <ActivityIndicator size="large" color={colors.primary} />
//       </ThemeView>
//     );
//   }

//   // =========================
//   // EMPTY STATE
//   // =========================
//   if (!timetable) {
//     return (
//       <ThemeView safe style={styles.center}>
//         <Pressable onPress={() => router.back()} style={styles.backBtn}>
//           <Ionicons name="arrow-back" size={22} color={colors.primary} />
//         </Pressable>
//         <ThemeText style={styles.emptyText}>Timetable not found</ThemeText>
//         <ThemeText style={styles.emptySubText}>
//           It may have been deleted.
//         </ThemeText>
//       </ThemeView>
//     );
//   }

//   return (
//     <ThemeView safe style={styles.container}>
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scroll}
//       >
//         {/* ── HEADER ── */}
//         <View style={styles.header}>
//           <Pressable onPress={() => router.back()} style={styles.backBtn}>
//             <Ionicons name="arrow-back" size={24} color={colors.primary} />
//           </Pressable>
//           <ThemeText style={styles.title}>Timetable details</ThemeText>
//         </View>

//         {/* ── STATUS BADGE ── */}
//         <View
//           style={[
//             styles.statusBadge,
//             { backgroundColor: isActive ? "#e6fff0" : "#ffe6e6" },
//           ]}
//         >
//           <View
//             style={[
//               styles.statusDot,
//               { backgroundColor: isActive ? "#22c55e" : "#ef4444" },
//             ]}
//           />
//           <ThemeText
//             style={[
//               styles.statusText,
//               { color: isActive ? "#15803d" : "#b91c1c" },
//             ]}
//           >
//             {isActive ? "Active" : "Stopped"}
//           </ThemeText>
//         </View>

//         {/* ── BOOK INFO ── */}
//         <CardTheme style={styles.card}>
//           <ThemeText style={styles.bookTitle}>
//             {timetable.bookId?.title || "Untitled book"}
//           </ThemeText>
//           <ThemeText style={styles.sub}>
//             {timetable.notificationMessage || "No description provided"}
//           </ThemeText>
//         </CardTheme>

//         {/* ── SCHEDULE DETAILS ── */}
//         <CardTheme style={styles.card}>
//           <ThemeText style={styles.sectionLabel}>Schedule</ThemeText>

//           <View style={styles.row}>
//             <Ionicons name="time-outline" size={16} color={colors.primary} />
//             <ThemeText style={styles.rowText}>
//               {timetable.reminderTime}
//             </ThemeText>
//           </View>

//           <View style={styles.row}>
//             <Ionicons
//               name="calendar-outline"
//               size={16}
//               color={colors.primary}
//             />
//             <ThemeText style={styles.rowText}>
//               {timetable.studyDays?.length
//                 ? timetable.studyDays.join(", ")
//                 : "Every day"}
//             </ThemeText>
//           </View>

//           <View style={styles.row}>
//             <Ionicons
//               name="notifications-outline"
//               size={16}
//               color={colors.primary}
//             />
//             <ThemeText style={styles.rowText}>
//               {timetable.noticeCount}{" "}
//               {timetable.noticeCount === 1 ? "session" : "sessions"}
//             </ThemeText>
//           </View>

//           <View style={styles.row}>
//             <Ionicons name="wifi-outline" size={16} color={colors.primary} />
//             <ThemeText style={styles.rowText}>
//               {timetable.deliveryMode
//                 ? timetable.deliveryMode.charAt(0).toUpperCase() +
//                   timetable.deliveryMode.slice(1)
//                 : "—"}
//             </ThemeText>
//           </View>
//         </CardTheme>

//         {/* ── NOTIFICATION MUTE TOGGLE ── */}
//         {/* Only shown when timetable is active and supports local control */}
//         {isActive && canMuteLocally && (
//           <CardTheme style={styles.card}>
//             <View style={styles.muteRow}>
//               <View style={styles.muteInfo}>
//                 <ThemeText style={styles.muteLabel}>
//                   {locallyMuted ? "Notifications off" : "Notifications on"}
//                 </ThemeText>
//                 <ThemeText style={styles.muteSub}>
//                   {locallyMuted
//                     ? "Your device won't show reminders. The schedule is still saved."
//                     : "Your device will remind you at the scheduled time."}
//                 </ThemeText>
//               </View>

//               {muteProcessing ? (
//                 <ActivityIndicator size="small" color={colors.primary} />
//               ) : (
//                 <Switch
//                   value={!locallyMuted}
//                   onValueChange={handleMuteToggle}
//                   trackColor={{ false: "#d1d5db", true: colors.primary }}
//                   thumbColor="#ffffff"
//                 />
//               )}
//             </View>
//           </CardTheme>
//         )}

//         {/* ── ONLINE MODE NOTE ── */}
//         {/* For online-only timetables, mute isn't available locally */}
//         {isActive && !canMuteLocally && (
//           <CardTheme style={[styles.card, styles.infoCard]}>
//             <View style={styles.row}>
//               <Ionicons
//                 name="information-circle-outline"
//                 size={16}
//                 color={colors.primary}
//               />
//               <ThemeText style={[styles.rowText, styles.infoText]}>
//                 Online mode — notifications are managed by the server and cannot
//                 be muted locally.
//               </ThemeText>
//             </View>
//           </CardTheme>
//         )}

//         {/* ── ACTIONS ── */}
//         <View style={styles.actions}>
//           {/* Stop button — only when active */}
//           {isActive && (
//             <ThemeButton
//               onPress={handleStop}
//               disabled={processing}
//               style={styles.stopBtn}
//             >
//               {processing ? (
//                 <ActivityIndicator color="#fff" />
//               ) : (
//                 <View style={styles.btnInner}>
//                   <Ionicons
//                     name="stop-circle-outline"
//                     size={18}
//                     color="#fff"
//                   />
//                   <ThemeText style={styles.btnText}>Stop timetable</ThemeText>
//                 </View>
//               )}
//             </ThemeButton>
//           )}

//           {/* Reactivate button — only when stopped */}
//           {!isActive && (
//             <ThemeButton
//               onPress={handleReactivate}
//               disabled={processing}
//               style={styles.reactivateBtn}
//             >
//               {processing ? (
//                 <ActivityIndicator color="#fff" />
//               ) : (
//                 <View style={styles.btnInner}>
//                   <Ionicons name="refresh-outline" size={18} color="#fff" />
//                   <ThemeText style={styles.btnText}>
//                     Reactivate timetable
//                   </ThemeText>
//                 </View>
//               )}
//             </ThemeButton>
//           )}

//           {/* Navigation */}
//           <ThemeButton
//             onPress={() => router.push("/timetableScreen")}
//             style={styles.navBtn}
//           >
//             <ThemeText style={[styles.btnText, { color: colors.primary }]}>
//               View all timetables
//             </ThemeText>
//           </ThemeButton>
//         </View>
//       </ScrollView>
//     </ThemeView>
//   );
// }

// // =========================
// // STYLES
// // =========================
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },

//   scroll: {
//     padding: 16,
//     paddingBottom: 40,
//   },

//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 24,
//   },

//   // Header
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//     marginBottom: 14,
//   },

//   backBtn: {
//     padding: 4,
//   },

//   title: {
//     fontSize: 20,
//     fontWeight: "700",
//   },

//   // Status badge
//   statusBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     alignSelf: "flex-start",
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//     marginBottom: 16,
//     gap: 6,
//   },

//   statusDot: {
//     width: 7,
//     height: 7,
//     borderRadius: 4,
//   },

//   statusText: {
//     fontSize: 12,
//     fontWeight: "700",
//     letterSpacing: 0.3,
//   },

//   // Cards
//   card: {
//     marginBottom: 14,
//     padding: 16,
//     borderRadius: 12,
//   },

//   infoCard: {
//     opacity: 0.75,
//   },

//   bookTitle: {
//     fontSize: 17,
//     fontWeight: "700",
//     marginBottom: 6,
//   },

//   sub: {
//     opacity: 0.65,
//     fontSize: 14,
//     lineHeight: 20,
//   },

//   sectionLabel: {
//     fontSize: 11,
//     fontWeight: "700",
//     letterSpacing: 0.8,
//     opacity: 0.45,
//     textTransform: "uppercase",
//     marginBottom: 12,
//   },

//   row: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     gap: 8,
//     marginBottom: 10,
//   },

//   rowText: {
//     fontSize: 14,
//     flex: 1,
//     lineHeight: 20,
//   },

//   infoText: {
//     opacity: 0.65,
//     fontSize: 13,
//   },

//   // Mute toggle row
//   muteRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     gap: 12,
//   },

//   muteInfo: {
//     flex: 1,
//   },

//   muteLabel: {
//     fontSize: 15,
//     fontWeight: "600",
//     marginBottom: 3,
//   },

//   muteSub: {
//     fontSize: 12,
//     opacity: 0.6,
//     lineHeight: 17,
//   },

//   // Actions
//   actions: {
//     marginTop: 6,
//     gap: 10,
//   },

//   stopBtn: {
//     backgroundColor: "#ef4444",
//     borderRadius: 12,
//     paddingVertical: 14,
//   },

//   reactivateBtn: {
//     backgroundColor: "#2563eb",
//     borderRadius: 12,
//     paddingVertical: 14,
//   },

//   navBtn: {
//     backgroundColor: "transparent",
//     borderRadius: 12,
//     paddingVertical: 14,
//     borderWidth: 1,
//     borderColor: colors.primary,
//   },

//   btnInner: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 8,
//   },

//   btnText: {
//     fontWeight: "700",
//     fontSize: 15,
//     color: "#fff",
//   },

//   // Empty state
//   emptyText: {
//     fontSize: 17,
//     fontWeight: "700",
//     marginTop: 16,
//     marginBottom: 6,
//   },

//   emptySubText: {
//     fontSize: 14,
//     opacity: 0.55,
//   },
// });




import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Switch,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import ThemeView from "../../component/ThemeView";
import ThemeText from "../../component/ThemeText";
import CardTheme from "../../component/CardTheme";
import ThemeButton from "../../component/ThemeButton";

import { colors } from "../../constant/colors";
import { useTimetable } from "../../hook/useTimeTable";
import { BannerAdComponent } from "../../component/AdsManager";

export default function TimetableDetailScreen() {
  const router = useRouter();
  const { timetableId } = useLocalSearchParams();

  const {
    getTimetableById,
    stopTimetable,
    reactivateTimetable,
    muteNotifications,
    unmuteNotifications,
    getLocalMuteState,
  } = useTimetable();

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [muteProcessing, setMuteProcessing] = useState(false);

  const [timetable, setTimetable] = useState(null);
  const [isActive, setIsActive] = useState(null);
  const [locallyMuted, setLocallyMuted] = useState(false);

  const id = Array.isArray(timetableId) ? timetableId[0] : timetableId;

  // =========================
  // DERIVED STATE
  // Whether this timetable supports local mute.
  // Online-only timetables are controlled by the server, not the device.
  // =========================
  const canMuteLocally =
    timetable?.deliveryMode === "offline" ||
    timetable?.deliveryMode === "hybrid";

  // =========================
  // LOAD TIMETABLE + MUTE STATE
  // =========================
  const loadTimetable = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const [data, muted] = await Promise.all([
        getTimetableById(id),
        getLocalMuteState(id),
      ]);

      setTimetable(data || null);
      setIsActive(data?.isActive ?? null);
      setLocallyMuted(muted);
    } catch (err) {
      console.log("❌ Load error:", err?.message);
      Alert.alert("Error", "Failed to load timetable");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadTimetable();
  }, [loadTimetable]);

  // =========================
  // STOP TIMETABLE (server + local)
  // =========================
  const handleStop = async () => {
    if (processing) return;

    Alert.alert(
      "Stop timetable?",
      "This will stop all reminders and mark the timetable as inactive on the server. You can reactivate it later.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Stop",
          style: "destructive",
          onPress: async () => {
            try {
              setProcessing(true);
              await stopTimetable(id);
              setIsActive(false);
              setLocallyMuted(false);
              setTimetable((prev) =>
                prev ? { ...prev, isActive: false } : prev
              );
              Alert.alert("Stopped", "Timetable stopped successfully.");
            } catch (err) {
              console.log("❌ Stop error:", err?.message);
              Alert.alert(
                "Error",
                err?.response?.data?.message || "Failed to stop timetable"
              );
            } finally {
              setProcessing(false);
            }
          },
        },
      ]
    );
  };

  // =========================
  // REACTIVATE TIMETABLE (server + local)
  // =========================
  const handleReactivate = async () => {
    if (processing) return;

    try {
      setProcessing(true);
      await reactivateTimetable(id);
      setIsActive(true);
      setLocallyMuted(false);
      setTimetable((prev) => (prev ? { ...prev, isActive: true } : prev));
      Alert.alert("Reactivated", "Timetable is active again.");
    } catch (err) {
      console.log("❌ Reactivate error:", err?.message);
      Alert.alert(
        "Error",
        err?.response?.data?.message || "Failed to reactivate timetable"
      );
    } finally {
      setProcessing(false);
    }
  };

  // =========================
  // MUTE / UNMUTE (local only)
  // Does not affect the server — timetable stays active.
  // Only for offline / hybrid delivery modes.
  // =========================
  const handleMuteToggle = async (value) => {
    // value = true means user wants notifications ON (unmute)
    // value = false means user wants notifications OFF (mute)
    if (muteProcessing) return;

    try {
      setMuteProcessing(true);

      if (value) {
        // Unmute: rebuild local schedule from the current timetable data
        await unmuteNotifications({
          _id: timetable._id,
          reminderTime: timetable.reminderTime,
          reminderType: timetable.reminderType,
          studyDays: timetable.studyDays,
          notificationMessage: timetable.notificationMessage,
          planType: timetable.planType,
          bookTitle: timetable.bookId?.title || "Study Reminder",
          mode: timetable.deliveryMode,
        });
        setLocallyMuted(false);
      } else {
        // Mute: cancel local notifications, mark muted in storage
        await muteNotifications(id);
        setLocallyMuted(true);
      }
    } catch (err) {
      console.log("❌ Mute toggle error:", err?.message);
      Alert.alert("Error", "Failed to update notification setting.");
    } finally {
      setMuteProcessing(false);
    }
  };

  // =========================
  // LOADING STATE
  // =========================
  if (loading) {
    return (
      <ThemeView safe style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </ThemeView>
    );
  }

  // =========================
  // EMPTY STATE
  // =========================
  if (!timetable) {
    return (
      <ThemeView safe style={styles.center}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.primary} />
        </Pressable>
        <ThemeText style={styles.emptyText}>Timetable not found</ThemeText>
        <ThemeText style={styles.emptySubText}>
          It may have been deleted.
        </ThemeText>
      </ThemeView>
    );
  }

  return (
    <ThemeView safe style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ── HEADER ── */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </Pressable>
          <ThemeText style={styles.title}>Timetable details</ThemeText>
        </View>

        {/* ── STATUS BADGE ── */}
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: isActive ? "#e6fff0" : "#ffe6e6" },
          ]}
        >
          <View
            style={[
              styles.statusDot,
              { backgroundColor: isActive ? "#22c55e" : "#ef4444" },
            ]}
          />
          <ThemeText
            style={[
              styles.statusText,
              { color: isActive ? "#15803d" : "#b91c1c" },
            ]}
          >
            {isActive ? "Active" : "Stopped"}
          </ThemeText>
        </View>

        {/* ── BOOK INFO ── */}
        <CardTheme style={styles.card}>
          <ThemeText style={styles.bookTitle}>
            {timetable.bookId?.title || "Untitled book"}
          </ThemeText>
          <ThemeText style={styles.sub}>
            {timetable.notificationMessage || "No description provided"}
          </ThemeText>
        </CardTheme>

        {/* ── SCHEDULE DETAILS ── */}
        <CardTheme style={styles.card}>
          <ThemeText style={styles.sectionLabel}>Schedule</ThemeText>

          <View style={styles.row}>
            <Ionicons name="time-outline" size={16} color={colors.primary} />
            <ThemeText style={styles.rowText}>
              {timetable.reminderTime}
            </ThemeText>
          </View>

          <View style={styles.row}>
            <Ionicons
              name="calendar-outline"
              size={16}
              color={colors.primary}
            />
            <ThemeText style={styles.rowText}>
              {timetable.studyDays?.length
                ? timetable.studyDays.join(", ")
                : "Every day"}
            </ThemeText>
          </View>

          <View style={styles.row}>
            <Ionicons
              name="notifications-outline"
              size={16}
              color={colors.primary}
            />
            <ThemeText style={styles.rowText}>
              {timetable.noticeCount}{" "}
              {timetable.noticeCount === 1 ? "session" : "sessions"}
            </ThemeText>
          </View>

          <View style={styles.row}>
            <Ionicons name="wifi-outline" size={16} color={colors.primary} />
            <ThemeText style={styles.rowText}>
              {timetable.deliveryMode
                ? timetable.deliveryMode.charAt(0).toUpperCase() +
                  timetable.deliveryMode.slice(1)
                : "—"}
            </ThemeText>
          </View>
        </CardTheme>

        {/* ── NOTIFICATION MUTE TOGGLE ── */}
        {/* Only shown when timetable is active and supports local control */}
        {isActive && canMuteLocally && (
          <CardTheme style={styles.card}>
            <View style={styles.muteRow}>
              <View style={styles.muteInfo}>
                <ThemeText style={styles.muteLabel}>
                  {locallyMuted ? "Notifications off" : "Notifications on"}
                </ThemeText>
                <ThemeText style={styles.muteSub}>
                  {locallyMuted
                    ? "Your device won't show reminders. The schedule is still saved."
                    : "Your device will remind you at the scheduled time."}
                </ThemeText>
              </View>

              {muteProcessing ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Switch
                  value={!locallyMuted}
                  onValueChange={handleMuteToggle}
                  trackColor={{ false: "#d1d5db", true: colors.primary }}
                  thumbColor="#ffffff"
                />
              )}
            </View>
          </CardTheme>
        )}

        {/* ── ONLINE MODE NOTE ── */}
        {/* For online-only timetables, mute isn't available locally */}
        {isActive && !canMuteLocally && (
          <CardTheme style={[styles.card, styles.infoCard]}>
            <View style={styles.row}>
              <Ionicons
                name="information-circle-outline"
                size={16}
                color={colors.primary}
              />
              <ThemeText style={[styles.rowText, styles.infoText]}>
                Online mode — notifications are managed by the server and cannot
                be muted locally.
              </ThemeText>
            </View>
          </CardTheme>
        )}

        {/*
          ── BANNER AD ──
          Placed once the user has finished reading their schedule info,
          right before the action buttons. This is a natural pause point —
          they've absorbed the details and are about to decide what to do
          next, so a small banner here doesn't interrupt anything they're
          mid-task on. BannerAdComponent already self-hides for premium
          and offline users, so no extra gating is needed here.
        */}
        <View style={styles.adSection}>
          <ThemeText style={styles.adLabel}>Sponsored</ThemeText>
          <BannerAdComponent />
        </View>

        {/* ── ACTIONS ── */}
        <View style={styles.actions}>
          {/* Stop button — only when active */}
          {isActive && (
            <ThemeButton
              onPress={handleStop}
              disabled={processing}
              style={styles.stopBtn}
            >
              {processing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <View style={styles.btnInner}>
                  <Ionicons
                    name="stop-circle-outline"
                    size={18}
                    color="#fff"
                  />
                  <ThemeText style={styles.btnText}>Stop timetable</ThemeText>
                </View>
              )}
            </ThemeButton>
          )}

          {/* Reactivate button — only when stopped */}
          {!isActive && (
            <ThemeButton
              onPress={handleReactivate}
              disabled={processing}
              style={styles.reactivateBtn}
            >
              {processing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <View style={styles.btnInner}>
                  <Ionicons name="refresh-outline" size={18} color="#fff" />
                  <ThemeText style={styles.btnText}>
                    Reactivate timetable
                  </ThemeText>
                </View>
              )}
            </ThemeButton>
          )}

          {/* Navigation */}
          <ThemeButton
            onPress={() => router.push("/timetableScreen")}
            style={styles.navBtn}
          >
            <ThemeText style={[styles.btnText, { color: colors.primary }]}>
              View all timetables
            </ThemeText>
          </ThemeButton>
        </View>
      </ScrollView>
    </ThemeView>
  );
}

// =========================
// STYLES
// =========================
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scroll: {
    padding: 16,
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },

  backBtn: {
    padding: 4,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
  },

  // Status badge
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
    gap: 6,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  // Cards
  card: {
    marginBottom: 14,
    padding: 16,
    borderRadius: 12,
  },

  infoCard: {
    opacity: 0.75,
  },

  bookTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 6,
  },

  sub: {
    opacity: 0.65,
    fontSize: 14,
    lineHeight: 20,
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    opacity: 0.45,
    textTransform: "uppercase",
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 10,
  },

  rowText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },

  infoText: {
    opacity: 0.65,
    fontSize: 13,
  },

  // Mute toggle row
  muteRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  muteInfo: {
    flex: 1,
  },

  muteLabel: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 3,
  },

  muteSub: {
    fontSize: 12,
    opacity: 0.6,
    lineHeight: 17,
  },

  // Ad section — quiet, low-contrast label + fixed-height banner so layout
  // never jumps whether the ad loads, fails, or is hidden for premium users.
  adSection: {
    marginTop: 4,
    marginBottom: 18,
    alignItems: "center",
  },

  adLabel: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    opacity: 0.35,
    marginBottom: 6,
    alignSelf: "center",
  },

  // Actions
  actions: {
    marginTop: 6,
    gap: 10,
  },

  stopBtn: {
    backgroundColor: "#ef4444",
    borderRadius: 12,
    paddingVertical: 14,
  },

  reactivateBtn: {
    backgroundColor: "#2563eb",
    borderRadius: 12,
    paddingVertical: 14,
  },

  navBtn: {
    backgroundColor: "transparent",
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.primary,
  },

  btnInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  btnText: {
    fontWeight: "700",
    fontSize: 15,
    color: "#fff",
  },

  // Empty state
  emptyText: {
    fontSize: 17,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 6,
  },

  emptySubText: {
    fontSize: 14,
    opacity: 0.55,
  },
});
