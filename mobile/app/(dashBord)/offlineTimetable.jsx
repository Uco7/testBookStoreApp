

// import React, { useState, useCallback, useEffect, useRef } from "react";
// import {
//   FlatList,
//   Pressable,
//   Alert,
//   ActivityIndicator,
//   StyleSheet,
//   View,
// } from "react-native";
// import { useFocusEffect, useRouter } from "expo-router";
// import * as FileSystem from "expo-file-system";
// import { Ionicons } from "@expo/vector-icons";
// import NetInfo from "@react-native-community/netinfo";

// // ── ADS MODULE INTEGRATIONS ──────────────────────
// import { useAdGate, RewardedAdModal, BannerAdComponent } from "../../component/AdsManager";

// import ThemeView from "../../component/ThemeView";
// import ThemeText from "../../component/ThemeText";
// import CardTheme from "../../component/CardTheme";
// import RowItemsTheme from "../../component/RowItemsTheme";
// import { colors } from "../../constant/colors";
// import {
//   getOfflineTimetables,
//   removeOfflineTimetable,
// } from "../../utils/offlinebookServices/offlineTimetableService";

// // useRewardAdsEnabled (boolean) AND useAdGate (interstitial gate) both
// // come from the SAME hook file here — renamed on import to avoid
// // clashing with AdsManager's own useAdGate above.
// import {
//   useRewardAdsEnabled,
//   useAdGate as useInterstitialAdGate,
// } from "../../hook/useRewardAdsEnabled";

// export default function OfflineTimetableScreen() {
//   const router = useRouter();
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   // High-level ad gating system hook (AdsManager's rewarded ad — unchanged)
//   const { gate, modalProps } = useAdGate();
//   const rewardAdsEnabled = useRewardAdsEnabled();

//   // ── 90-day INTERSTITIAL: fired ONCE per screen entry ────────────────────
//   // Deliberately a plain useEffect (mount-only), not useFocusEffect — this
//   // must NOT refire every time the user tabs back into this screen, only
//   // on a genuinely fresh navigation into it. It never stacks with the
//   // AdsManager ad above because it's not tied to any button press; the
//   // interstitial's own eligibility check + 60s cooldown still apply, so
//   // this safely no-ops if an ad isn't ready or the cooldown hasn't passed.
//   const { gate: gateInterstitial } = useInterstitialAdGate();
//   const hasFiredEntryAd = useRef(false);

//   useEffect(() => {
//     if (hasFiredEntryAd.current) return;
//     hasFiredEntryAd.current = true;
//     gateInterstitial(() => {}); // no navigation needed, just the show-or-skip
//   }, []);

//   const handleRefresh = async () => {
//     try {
//       setRefreshing(true);
//       await load();
//     } catch (err) {
//       console.log("refresh offline timetables error:", err);
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   // Reload data context whenever the view is focused on screen
//   useFocusEffect(
//     useCallback(() => {
//       load();
//     }, [])
//   );

//   const load = async () => {
//     try {
//       setLoading(true);
//       const list = await getOfflineTimetables();

//       // Safeguard against null or undefined data values
//       if (list && Array.isArray(list)) {
//         setData(list);
//       } else {
//         setData([]);
//       }
//     } catch (err) {
//       console.log("load offline timetables error:", err);
//       setData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Ad gating before opening a file. Ads must never block core
//   // functionality, so this always falls through to openFile() when the
//   // reward-ad system isn't ready/enabled — never holds the user up.
//   const handleOpenFilePress = async (item) => {
//     if (!rewardAdsEnabled) {
//       return openFile(item);
//     }

//     const networkState = await NetInfo.fetch();

//     if (networkState.isConnected && networkState.isInternetReachable) {
//       gate(() => openFile(item));
//     } else {
//       // Offline: never gate behind an ad that can't load anyway.
//       openFile(item);
//     }
//   };

//   const openFile = async (item) => {
//     try {
//       let finalUri = null;

//       // 1. Try local file first (works fully offline)
//       if (item.localUri) {
//         const info = await FileSystem.getInfoAsync(item.localUri);
//         if (info.exists) finalUri = item.localUri;
//       }

//       // 2. Fallback to remote download if online
//       if (!finalUri && item.remoteUrl) {
//         const cleanUrl = item.remoteUrl.split("?")[0]; // strip query params
//         let filename = cleanUrl.split("/").pop() || `${item._id || item.id}.pdf`;
//         if (!filename.endsWith(".pdf")) filename += ".pdf";

//         const localPath = FileSystem.documentDirectory + filename;
//         const localInfo = await FileSystem.getInfoAsync(localPath);

//         if (!localInfo.exists) {
//           const download = await FileSystem.downloadAsync(cleanUrl, localPath);
//           const check = await FileSystem.getInfoAsync(download.uri);
//           if (!check.exists || check.size < 1000) throw new Error("Invalid PDF.");
//           finalUri = download.uri;
//         } else {
//           finalUri = localPath;
//         }
//       }

//       if (!finalUri) {
//         return Alert.alert("Unavailable", "File not found on device.");
//       }

//       router.push({
//         pathname: "/pdf-viewer",
//         params: {
//           url: finalUri,
//           title: item?.bookId?.title || "Offline Document",
//           type: "pdf",
//         },
//       });
//     } catch (err) {
//       console.log("openFile error:", err);
//       Alert.alert("Error", "Unable to open PDF");
//     }
//   };

//   const handleDelete = (id) => {
//     Alert.alert("Remove", "Remove this offline timetable?", [
//       { text: "Cancel", style: "cancel" },
//       {
//         text: "Remove",
//         style: "destructive",
//         onPress: async () => {
//           const updated = await removeOfflineTimetable(id);
//           // If the service logic doesn't return an explicit list layout update, fetch from storage
//           if (updated && Array.isArray(updated)) {
//             setData(updated);
//           } else {
//             load();
//           }
//         },
//       },
//     ]);
//   };

//   const renderItem = ({ item }) => {
//     const itemId = item._id || item.id;

//     return (
//       <CardTheme style={styles.card}>
//         {/* Offline badge */}
//         <View style={styles.badge}>
//           <Ionicons name="cloud-done" size={13} color="#fff" />
//           <ThemeText style={styles.badgeText}>Saved Offline</ThemeText>
//         </View>

//         <ThemeText style={styles.title}>
//           {item.bookId?.title || item.title || "Untitled"}
//         </ThemeText>

//         <ThemeText>⏰ Reminder: {item.reminderTime || "N/A"}</ThemeText>
//         <ThemeText>🔁 Notices: {item.noticeCount || 0}</ThemeText>
//         <ThemeText>
//           📅 {item.studyDays?.length ? item.studyDays.join(", ") : "Daily"}
//         </ThemeText>
//         <ThemeText style={styles.date}>
//           Saved: {item.savedOfflineAt ? new Date(item.savedOfflineAt).toLocaleDateString() : "N/A"}
//         </ThemeText>

//         <ThemeText style={styles.storageLabel}>
//           {item.localUri ? "📱 Stored on device" : "🌐 Remote fallback only"}
//         </ThemeText>

//         <RowItemsTheme style={styles.row}>
//           <Pressable onPress={() => handleOpenFilePress(item)} style={styles.iconBtn} hitSlop={10}>
//             <Ionicons name="book-outline" size={22} color={colors.primary} />
//             <ThemeText style={{ marginLeft: 6 }}>Open</ThemeText>
//           </Pressable>

//           <Pressable onPress={() => handleDelete(itemId)} style={styles.iconBtn} hitSlop={10}>
//             <Ionicons name="trash-outline" size={22} color="red" />
//             <ThemeText style={{ color: "red", marginLeft: 6 }}>Remove</ThemeText>
//           </Pressable>
//         </RowItemsTheme>
//       </CardTheme>
//     );
//   };

//   return (
//     <ThemeView safe style={styles.container}>
//       <ThemeText style={styles.heading}>📴 Offline Timetables</ThemeText>

//       {loading && !refreshing ? (
//         <View style={styles.centerLoading}>
//           <ActivityIndicator size="large" color={colors.primary} />
//         </View>
//       ) : (
//         <FlatList
//           data={data}
//           keyExtractor={(item, index) => (item._id || item.id || index).toString()}
//           renderItem={renderItem}
//           refreshing={refreshing}
//           onRefresh={handleRefresh}
//           contentContainerStyle={styles.listContainer}
//           ListEmptyComponent={
//             <ThemeText style={styles.emptyMessage}>
//               No offline timetables yet.{"\n"}Save timetables from the Timetables screen.
//             </ThemeText>
//           }
//         />
//       )}

//       {/* Shared reusable banner component injected dynamically */}
//       <BannerAdComponent style={styles.inlineBanner} />

//       {rewardAdsEnabled && <RewardedAdModal {...modalProps} />}
//     </ThemeView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingHorizontal: 14,
//   },
//   heading: {
//     fontSize: 22,
//     fontWeight: "bold",
//     marginVertical: 12,
//   },
//   listContainer: {
//     paddingBottom: 30,
//   },
//   card: {
//     marginVertical: 8,
//     // width: "95%",
//     marginHorizontal: 6,
//     width: "95%",
//     padding: 14,
//     borderRadius: 14,
//   },
//   badge: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#2e7d32",
//     alignSelf: "flex-start",
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     borderRadius: 10,
//     marginBottom: 8,
//   },
//   badgeText: { color: "#fff", fontSize: 11, marginLeft: 4 },
//   title: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
//   date: { fontSize: 10, color: "#888", fontStyle: "italic", marginTop: 4 },
//   storageLabel: { fontSize: 11, color: "#aaa", marginTop: 2 },
//   row: { flexDirection: "row", marginTop: 14, justifyContent: "space-between" },
//   iconBtn: { flexDirection: "row", alignItems: "center" },
//   centerLoading: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   emptyMessage: {
//     textAlign: "center",
//     marginTop: 40,
//     opacity: 0.6,
//     lineHeight: 20,
//   },
//   inlineBanner: {
//     marginVertical: 8,
//   },
// });




import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  FlatList,
  Pressable,
  Alert,
  ActivityIndicator,
  StyleSheet,
  View,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import * as FileSystem from "expo-file-system";
import { Ionicons } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";

// ── ADS MODULE INTEGRATIONS ──────────────────────
import { useAdGate, RewardedAdModal, BannerAdComponent } from "../../component/AdsManager";

import ThemeView from "../../component/ThemeView";
import ThemeText from "../../component/ThemeText";
import CardTheme from "../../component/CardTheme";
import RowItemsTheme from "../../component/RowItemsTheme";
import InputTheme from "../../component/InputTheme"; // ── NEW: search input ──
import { colors } from "../../constant/colors";
import {
  getOfflineTimetables,
  removeOfflineTimetable,
} from "../../utils/offlinebookServices/offlineTimetableService";

// useRewardAdsEnabled (boolean) AND useAdGate (interstitial gate) both
// come from the SAME hook file here — renamed on import to avoid
// clashing with AdsManager's own useAdGate above.
import {
  useRewardAdsEnabled,
  useAdGate as useInterstitialAdGate,
} from "../../hook/useRewardAdsEnabled";

// ─── NEW: date helpers for search + display (same logic as TimetableScreen) ──
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return `${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}, ${d.getFullYear()}`;
};

const getDateSearchTokens = (dateStr) => {
  if (!dateStr) return [];
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return [];

  const day = d.getDate();
  const monthIndex = d.getMonth();
  const year = d.getFullYear();
  const monthName = MONTHS[monthIndex];
  const monthShort = monthName.slice(0, 3);

  return [
    String(day),
    String(year),
    monthName.toLowerCase(),
    monthShort.toLowerCase(),
    `${monthIndex + 1}/${day}/${year}`,
    `${day}/${monthIndex + 1}/${year}`,
    `${monthShort} ${day} ${year}`.toLowerCase(),
    `${monthName} ${day} ${year}`.toLowerCase(),
    `${monthName} ${day}, ${year}`.toLowerCase(),
  ];
};

// Pulls a readable filename out of whichever URL this offline item has
const getFileName = (item) => {
  const url = item.remoteUrl || item.localUri || "";
  if (!url) return "";
  const clean = url.split("?")[0];
  try {
    return decodeURIComponent(clean.split("/").pop() || "");
  } catch {
    return clean.split("/").pop() || "";
  }
};

export default function OfflineTimetableScreen() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState(""); // ── NEW ──

  // High-level ad gating system hook (AdsManager's rewarded ad — unchanged)
  const { gate, modalProps } = useAdGate();
  const rewardAdsEnabled = useRewardAdsEnabled();

  // ── 90-day INTERSTITIAL: fired ONCE per screen entry ────────────────────
  // Deliberately a plain useEffect (mount-only), not useFocusEffect — this
  // must NOT refire every time the user tabs back into this screen, only
  // on a genuinely fresh navigation into it. It never stacks with the
  // AdsManager ad above because it's not tied to any button press; the
  // interstitial's own eligibility check + 60s cooldown still apply, so
  // this safely no-ops if an ad isn't ready or the cooldown hasn't passed.
  const { gate: gateInterstitial } = useInterstitialAdGate();
  const hasFiredEntryAd = useRef(false);

  useEffect(() => {
    if (hasFiredEntryAd.current) return;
    hasFiredEntryAd.current = true;
    gateInterstitial(() => {}); // no navigation needed, just the show-or-skip
  }, []);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await load();
    } catch (err) {
      console.log("refresh offline timetables error:", err);
    } finally {
      setRefreshing(false);
    }
  };

  // Reload data context whenever the view is focused on screen
  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const load = async () => {
    try {
      setLoading(true);
      const list = await getOfflineTimetables();

      // Safeguard against null or undefined data values
      if (list && Array.isArray(list)) {
        setData(list);
      } else {
        setData([]);
      }
    } catch (err) {
      console.log("load offline timetables error:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // ── NEW: same multi-field search as TimetableScreen ──
  // Matches title, file name, storage type ("stored on device" / "remote
  // fallback"), and any date token derived from savedOfflineAt.
  const filtered = data.filter((item) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;

    const title = (item.bookId?.title || item.title || "").toLowerCase();
    const fileName = getFileName(item).toLowerCase();
    const storageType = item.localUri ? "device offline stored" : "remote fallback online";
    const dateTokens = getDateSearchTokens(item.savedOfflineAt);

    return (
      title.includes(q) ||
      fileName.includes(q) ||
      storageType.includes(q) ||
      dateTokens.some((token) => token.includes(q))
    );
  });

  // Ad gating before opening a file. Ads must never block core
  // functionality, so this always falls through to openFile() when the
  // reward-ad system isn't ready/enabled — never holds the user up.
  const handleOpenFilePress = async (item) => {
    if (!rewardAdsEnabled) {
      return openFile(item);
    }

    const networkState = await NetInfo.fetch();

    if (networkState.isConnected && networkState.isInternetReachable) {
      gate(() => openFile(item));
    } else {
      // Offline: never gate behind an ad that can't load anyway.
      openFile(item);
    }
  };

  const openFile = async (item) => {
    try {
      let finalUri = null;

      // 1. Try local file first (works fully offline)
      if (item.localUri) {
        const info = await FileSystem.getInfoAsync(item.localUri);
        if (info.exists) finalUri = item.localUri;
      }

      // 2. Fallback to remote download if online
      if (!finalUri && item.remoteUrl) {
        const cleanUrl = item.remoteUrl.split("?")[0]; // strip query params
        let filename = cleanUrl.split("/").pop() || `${item._id || item.id}.pdf`;
        if (!filename.endsWith(".pdf")) filename += ".pdf";

        const localPath = FileSystem.documentDirectory + filename;
        const localInfo = await FileSystem.getInfoAsync(localPath);

        if (!localInfo.exists) {
          const download = await FileSystem.downloadAsync(cleanUrl, localPath);
          const check = await FileSystem.getInfoAsync(download.uri);
          if (!check.exists || check.size < 1000) throw new Error("Invalid PDF.");
          finalUri = download.uri;
        } else {
          finalUri = localPath;
        }
      }

      if (!finalUri) {
        return Alert.alert("Unavailable", "File not found on device.");
      }

      router.push({
        pathname: "/pdf-viewer",
        params: {
          url: finalUri,
          title: item?.bookId?.title || "Offline Document",
          type: "pdf",
        },
      });
    } catch (err) {
      console.log("openFile error:", err);
      Alert.alert("Error", "Unable to open PDF");
    }
  };

  const handleDelete = (id) => {
    Alert.alert("Remove", "Remove this offline timetable?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          const updated = await removeOfflineTimetable(id);
          // If the service logic doesn't return an explicit list layout update, fetch from storage
          if (updated && Array.isArray(updated)) {
            setData(updated);
          } else {
            load();
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => {
    const itemId = item._id || item.id;
    const fileName = getFileName(item); // ── NEW ──
    const savedLabel = formatDisplayDate(item.savedOfflineAt); // ── NEW ──

    return (
      <CardTheme style={styles.card}>
        {/* Offline badge */}
        <View style={styles.badge}>
          <Ionicons name="cloud-done" size={13} color="#fff" />
          <ThemeText style={styles.badgeText}>Saved Offline</ThemeText>
        </View>

        <ThemeText style={styles.title}>
          {item.bookId?.title || item.title || "Untitled"}
        </ThemeText>

        <ThemeText>⏰ Reminder: {item.reminderTime || "N/A"}</ThemeText>
        <ThemeText>🔁 Notices: {item.noticeCount || 0}</ThemeText>
        <ThemeText>
          📅 {item.studyDays?.length ? item.studyDays.join(", ") : "Daily"}
        </ThemeText>

        {/* ── NEW: file name row ── */}
        {!!fileName && (
          <ThemeText style={styles.fileName} numberOfLines={1}>
            📄 {fileName}
          </ThemeText>
        )}

        <ThemeText style={styles.date}>
          Saved: {savedLabel || "N/A"}
        </ThemeText>

        <ThemeText style={styles.storageLabel}>
          {item.localUri ? "📱 Stored on device" : "🌐 Remote fallback only"}
        </ThemeText>

        <RowItemsTheme style={styles.row}>
          <Pressable onPress={() => handleOpenFilePress(item)} style={styles.iconBtn} hitSlop={10}>
            <Ionicons name="book-outline" size={22} color={colors.primary} />
            <ThemeText style={{ marginLeft: 6 }}>Open</ThemeText>
          </Pressable>

          <Pressable onPress={() => handleDelete(itemId)} style={styles.iconBtn} hitSlop={10}>
            <Ionicons name="trash-outline" size={22} color="red" />
            <ThemeText style={{ color: "red", marginLeft: 6 }}>Remove</ThemeText>
          </Pressable>
        </RowItemsTheme>
      </CardTheme>
    );
  };

  return (
    <ThemeView safe style={styles.container}>
      <ThemeText style={styles.heading}>📴 Offline Timetables</ThemeText>

      {/* ── NEW: search bar ── */}
      <View style={styles.searchWrapper}>
        <Ionicons
          name="search-outline"
          size={16}
          color={colors.textMuted || "#888"}
          style={styles.searchIcon}
        />
        <InputTheme
          placeholder="Search by title, file name, type, or date…"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {loading && !refreshing ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item, index) => (item._id || item.id || index).toString()}
          renderItem={renderItem}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <ThemeText style={styles.emptyMessage}>
              {search
                ? `No offline timetables match "${search}"`
                : "No offline timetables yet.\nSave timetables from the Timetables screen."}
            </ThemeText>
          }
        />
      )}

      {/* Shared reusable banner component injected dynamically */}
      <BannerAdComponent style={styles.inlineBanner} />

      {rewardAdsEnabled && <RewardedAdModal {...modalProps} />}
    </ThemeView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 14,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 12,
  },
  // ── NEW: search bar ──
  searchWrapper: {
    position: "relative",
    marginBottom: 12,
  },
  searchIcon: {
    position: "absolute",
    left: 12,
    top: "50%",
    transform: [{ translateY: -8 }],
    zIndex: 1,
  },
  searchInput: {
    paddingLeft: 36,
    borderRadius: 10,
    borderWidth: 1,
  },
  listContainer: {
    paddingBottom: 30,
  },
  card: {
    marginVertical: 8,
    // width: "95%",
    marginHorizontal: 6,
    width: "95%",
    padding: 14,
    borderRadius: 14,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2e7d32",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 8,
  },
  badgeText: { color: "#fff", fontSize: 11, marginLeft: 4 },
  title: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  fileName: { fontSize: 11, opacity: 0.6, marginTop: 4 }, // ── NEW ──
  date: { fontSize: 10, color: "#888", fontStyle: "italic", marginTop: 4 },
  storageLabel: { fontSize: 11, color: "#aaa", marginTop: 2 },
  row: { flexDirection: "row", marginTop: 14, justifyContent: "space-between" },
  iconBtn: { flexDirection: "row", alignItems: "center" },
  centerLoading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyMessage: {
    textAlign: "center",
    marginTop: 40,
    opacity: 0.6,
    lineHeight: 20,
  },
  inlineBanner: {
    marginVertical: 8,
  },
});