
// import React, { useState, useCallback, useEffect, useRef } from "react";
// import {
//   FlatList,
//   Pressable,
//   Alert,
//   StyleSheet,
//   View,
//   RefreshControl,
// } from "react-native";
// import { useRouter, useFocusEffect } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import NetInfo from "@react-native-community/netinfo";

// // ── ADS MODULE INTEGRATIONS ──────────────────────
// import { useAdGate, RewardedAdModal, BannerAdComponent } from "../../component/AdsManager";

// import ThemeView from "../../component/ThemeView";
// import ThemeText from "../../component/ThemeText";
// import CardTheme from "../../component/CardTheme";
// import { colors } from "../../constant/colors";
// import {
//   getOfflineBooks,
//   removeOfflineBook,
// } from "../../utils/offlinebookServices/offlineBookService";

// // useRewardAdsEnabled (boolean) AND useAdGate (interstitial gate) both
// // come from the SAME hook file here — renamed on import to avoid
// // clashing with AdsManager's own useAdGate above.
// import {
//   useRewardAdsEnabled,
//   useAdGate as useInterstitialAdGate,
// } from "../../hook/useRewardAdsEnabled";

// export default function OfflineBooks() {
//   const router = useRouter();
//   const [offlineBooks, setOfflineBooks] = useState([]);
//   const [refreshing, setRefreshing] = useState(false);
//   const [deletingId, setDeletingId] = useState(null);

//   // Hooking up the reward ad controller logic context (AdsManager — unchanged).
//   const { gate, modalProps } = useAdGate();
//   const rewardAdsEnabled = useRewardAdsEnabled();

//   // ── 90-day INTERSTITIAL: fired ONCE per screen entry ────────────────────
//   // Mount-only (not tied to focus), so it doesn't refire on every tab
//   // switch back into this screen — only on a fresh navigation into it.
//   // Never stacks with AdsManager's ad since it's not on any button press;
//   // the interstitial's own eligibility/cooldown logic still governs
//   // whether anything actually shows.
//   const { gate: gateInterstitial } = useInterstitialAdGate();
//   const hasFiredEntryAd = useRef(false);

//   useEffect(() => {
//     if (hasFiredEntryAd.current) return;
//     hasFiredEntryAd.current = true;
//     gateInterstitial(() => {});
//   }, []);

//   // =========================
//   // LOAD
//   // =========================
//   const loadOffline = async () => {
//     try {
//       const books = await getOfflineBooks();
//       if (books && Array.isArray(books)) {
//         setOfflineBooks(books);
//       } else {
//         setOfflineBooks([]);
//       }
//     } catch (e) {
//       console.log("load offline error", e);
//       setOfflineBooks([]);
//     }
//   };

//   useFocusEffect(
//     useCallback(() => {
//       loadOffline();
//     }, [])
//   );

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await loadOffline();
//     setRefreshing(false);
//   };

//   // =========================
//   // DELETE
//   // =========================
//   const confirmDelete = (item) => {
//     const itemId = item._id || item.id;

//     Alert.alert(
//       "Remove from device",
//       `"${item.title}" will be removed from offline storage. You can re-download it anytime.`,
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Remove",
//           style: "destructive",
//           onPress: () => deleteBook(itemId),
//         },
//       ]
//     );
//   };

//   const deleteBook = async (id) => {
//     try {
//       setDeletingId(id);
//       const updated = await removeOfflineBook(id);
//       if (updated && Array.isArray(updated)) {
//         setOfflineBooks(updated);
//       } else {
//         loadOffline();
//       }
//     } catch (e) {
//       console.log("delete offline error", e);
//       Alert.alert("Error", "Failed to remove book.");
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   // =========================
//   // OPEN WITH AD ENFORCEMENT (AdsManager's rewarded ad — unchanged)
//   // =========================
//   const handleOpenBookPress = async (item) => {
//     const networkState = await NetInfo.fetch();

//     if (!networkState.isConnected || !networkState.isInternetReachable) {
//       return openBook(item);
//     }

//     if (!rewardAdsEnabled) {
//       return openBook(item);
//     }

//     gate(() => openBook(item));
//   };

//   const openBook = (item) => {
//     router.push({
//       pathname: "/pdf-viewer",
//       params: {
//         url: item.offlineUri,
//         title: item.title,
//         type: "pdf",
//       },
//     });
//   };

//   // =========================
//   // FORMAT DATE
//   // =========================
//   const formatDate = (dateStr) => {
//     if (!dateStr) return null;
//     const d = new Date(dateStr);
//     return d.toLocaleDateString(undefined, {
//       day: "numeric",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   // =========================
//   // RENDER CARD
//   // =========================
//   const renderItem = ({ item }) => {
//     const itemId = item._id || item.id;
//     const isDeleting = deletingId === itemId;

//     return (
//       <CardTheme style={styles.card}>
//         {/* ── BOOK ICON + INFO ── */}
//         <View style={styles.cardInner}>
//           <View style={styles.iconBlock}>
//             <Ionicons name="book" size={28} color={colors.primary} />
//           </View>

//           <View style={styles.infoBlock}>
//             <ThemeText style={styles.bookTitle} numberOfLines={2}>
//               {item.title || "Untitled Document"}
//             </ThemeText>

//             {item.author ? (
//               <ThemeText style={styles.author} numberOfLines={1}>
//                 {item.author}
//               </ThemeText>
//             ) : null}

//             {item.description ? (
//               <ThemeText style={styles.desc} numberOfLines={2}>
//                 {item.description}
//               </ThemeText>
//             ) : null}

//             <View style={styles.footerRow}>
//               <View style={styles.offlinePill}>
//                 <Ionicons name="checkmark-circle" size={12} color="#16a34a" />
//                 <ThemeText style={styles.offlinePillText}>On device</ThemeText>
//               </View>

//               {formatDate(item.savedOfflineAt) ? (
//                 <ThemeText style={styles.dateText}>
//                   Saved {formatDate(item.savedOfflineAt)}
//                 </ThemeText>
//               ) : null}
//             </View>
//           </View>
//         </View>

//         {/* ── DIVIDER ── */}
//         <View style={styles.divider} />

//         {/* ── ACTIONS ── */}
//         <View style={styles.actions}>
//           <Pressable
//             onPress={() => handleOpenBookPress(item)}
//             style={({ pressed }) => [
//               styles.actionBtn,
//               styles.openBtn,
//               pressed && { opacity: 0.75 },
//             ]}
//           >
//             <Ionicons name="book-outline" size={16} color="#fff" />
//             <ThemeText style={styles.openBtnText}>Read</ThemeText>
//           </Pressable>

//           <Pressable
//             onPress={() => confirmDelete(item)}
//             disabled={isDeleting}
//             style={({ pressed }) => [
//               styles.actionBtn,
//               styles.deleteBtn,
//               pressed && { opacity: 0.75 },
//               isDeleting && { opacity: 0.45 },
//             ]}
//           >
//             <Ionicons
//               name={isDeleting ? "hourglass-outline" : "trash-outline"}
//               size={16}
//               color="#ef4444"
//             />
//             <ThemeText style={styles.deleteBtnText}>
//               {isDeleting ? "Removing…" : "Remove"}
//             </ThemeText>
//           </Pressable>
//         </View>
//       </CardTheme>
//     );
//   };

//   // =========================
//   // EMPTY STATE
//   // =========================
//   const EmptyState = () => (
//     <View style={styles.emptyState}>
//       <View style={styles.emptyIconWrap}>
//         <Ionicons name="cloud-offline-outline" size={52} color="#d1d5db" />
//       </View>
//       <ThemeText style={styles.emptyTitle}>No books saved yet</ThemeText>
//       <ThemeText style={styles.emptySub}>
//         Save books from your library to read them without an internet connection.
//       </ThemeText>
//     </View>
//   );

//   // =========================
//   // SCREEN
//   // =========================
//   return (
//     <ThemeView style={styles.screen} safe>
//       {/* ── HEADER ── */}
//       <View style={styles.header}>
//         <View>
//           <ThemeText style={styles.heading}>Offline library</ThemeText>
//           {offlineBooks.length > 0 && (
//             <ThemeText style={styles.subheading}>
//               {offlineBooks.length}{" "}
//               {offlineBooks.length === 1 ? "book" : "books"} on this device
//             </ThemeText>
//           )}
//         </View>
//         <View style={styles.headerIcon}>
//           <Ionicons name="cloud-done-outline" size={24} color={colors.primary} />
//         </View>
//       </View>

//       {/* ── LIST ── */}
//       <FlatList
//         data={offlineBooks}
//         keyExtractor={(item, index) => (item._id || item.id || index).toString()}
//         renderItem={renderItem}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={[
//           styles.listContent,
//           offlineBooks.length === 0 && styles.listEmpty,
//         ]}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={handleRefresh}
//             tintColor={colors.primary}
//           />
//         }
//         ListEmptyComponent={<EmptyState />}
//       />

//       {/* Reusable banner component loaded dynamically via AdsManager */}
//       <BannerAdComponent style={styles.inlineBanner} />

//       {rewardAdsEnabled && <RewardedAdModal {...modalProps} />}
//     </ThemeView>
//   );
// }

// // =========================
// // STYLES
// // =========================
// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     paddingHorizontal: 16,
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingTop: 16,
//     paddingBottom: 12,
//   },
//   heading: {
//     fontSize: 24,
//     fontWeight: "700",
//     letterSpacing: -0.3,
//   },
//   subheading: {
//     fontSize: 13,
//     opacity: 0.45,
//     marginTop: 2,
//   },
//   headerIcon: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: "rgba(0,0,0,0.05)",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   listContent: {
//     paddingBottom: 32,
//     paddingTop: 4,
//   },
//   listEmpty: {
//     flexGrow: 1,
//   },
//   card: {
//     marginVertical: 6,
//     marginHorizontal: 6,
//     width:'95%',
//     padding: 14,
//     borderRadius: 14,
//   },
//   cardInner: {
//     flexDirection: "row",
//     gap: 12,
//   },
//   iconBlock: {
//     width: 48,
//     height: 48,
//     borderRadius: 12,
//     backgroundColor: "rgba(0,0,0,0.05)",
//     alignItems: "center",
//     justifyContent: "center",
//     flexShrink: 0,
//   },
//   infoBlock: {
//     flex: 1,
//     gap: 3,
//   },
//   bookTitle: {
//     fontSize: 15,
//     fontWeight: "700",
//     lineHeight: 20,
//   },
//   author: {
//     fontSize: 12,
//     opacity: 0.55,
//   },
//   desc: {
//     fontSize: 12,
//     opacity: 0.5,
//     lineHeight: 17,
//     marginTop: 2,
//   },
//   footerRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     marginTop: 6,
//     flexWrap: "wrap",
//   },
//   offlinePill: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 4,
//     backgroundColor: "#dcfce7",
//     paddingHorizontal: 7,
//     paddingVertical: 3,
//     borderRadius: 20,
//   },
//   offlinePillText: {
//     fontSize: 11,
//     fontWeight: "600",
//     color: "#15803d",
//   },
//   dateText: {
//     fontSize: 11,
//     opacity: 0.4,
//   },
//   divider: {
//     height: StyleSheet.hairlineWidth,
//     backgroundColor: "#e5e7eb",
//     marginVertical: 12,
//   },
//   actions: {
//     flexDirection: "row",
//     gap: 10,
//   },
//   actionBtn: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 6,
//     paddingVertical: 9,
//     borderRadius: 10,
//   },
//   openBtn: {
//     backgroundColor: colors.primary,
//   },
//   openBtnText: {
//     color: "#fff",
//     fontWeight: "700",
//     fontSize: 14,
//   },
//   deleteBtn: {
//     backgroundColor: "#fef2f2",
//     borderWidth: StyleSheet.hairlineWidth,
//     borderColor: "#fecaca",
//   },
//   deleteBtnText: {
//     color: "#ef4444",
//     fontWeight: "600",
//     fontSize: 14,
//   },
//   emptyState: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     paddingHorizontal: 40,
//     paddingTop: 80,
//     gap: 10,
//   },
//   emptyIconWrap: {
//     width: 88,
//     height: 88,
//     borderRadius: 44,
//     backgroundColor: "rgba(0,0,0,0.04)",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 4,
//   },
//   emptyTitle: {
//     fontSize: 17,
//     fontWeight: "700",
//     textAlign: "center",
//   },
//   emptySub: {
//     fontSize: 13,
//     opacity: 0.45,
//     textAlign: "center",
//     lineHeight: 19,
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
  StyleSheet,
  View,
  RefreshControl,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";

// ── ADS MODULE INTEGRATIONS ──────────────────────
import { useAdGate, RewardedAdModal, BannerAdComponent } from "../../component/AdsManager";

import ThemeView from "../../component/ThemeView";
import ThemeText from "../../component/ThemeText";
import CardTheme from "../../component/CardTheme";
import InputTheme from "../../component/InputTheme"; // ── NEW: search input ──
import { colors } from "../../constant/colors";
import {
  getOfflineBooks,
  removeOfflineBook,
} from "../../utils/offlinebookServices/offlineBookService";

// useRewardAdsEnabled (boolean) AND useAdGate (interstitial gate) both
// come from the SAME hook file here — renamed on import to avoid
// clashing with AdsManager's own useAdGate above.
import {
  useRewardAdsEnabled,
  useAdGate as useInterstitialAdGate,
} from "../../hook/useRewardAdsEnabled";

// ─── NEW: date helpers for search (same logic as TimetableScreen) ─────────────
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

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

// Pulls a readable filename out of the offline file's local URI
const getFileName = (item) => {
  const url = item.offlineUri || "";
  if (!url) return "";
  const clean = url.split("?")[0];
  try {
    return decodeURIComponent(clean.split("/").pop() || "");
  } catch {
    return clean.split("/").pop() || "";
  }
};

export default function OfflineBooks() {
  const router = useRouter();
  const [offlineBooks, setOfflineBooks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState(""); // ── NEW ──

  // Hooking up the reward ad controller logic context (AdsManager — unchanged).
  const { gate, modalProps } = useAdGate();
  const rewardAdsEnabled = useRewardAdsEnabled();

  // ── 90-day INTERSTITIAL: fired ONCE per screen entry ────────────────────
  // Mount-only (not tied to focus), so it doesn't refire on every tab
  // switch back into this screen — only on a fresh navigation into it.
  // Never stacks with AdsManager's ad since it's not on any button press;
  // the interstitial's own eligibility/cooldown logic still governs
  // whether anything actually shows.
  const { gate: gateInterstitial } = useInterstitialAdGate();
  const hasFiredEntryAd = useRef(false);

  useEffect(() => {
    if (hasFiredEntryAd.current) return;
    hasFiredEntryAd.current = true;
    gateInterstitial(() => {});
  }, []);

  // =========================
  // LOAD
  // =========================
  const loadOffline = async () => {
    try {
      const books = await getOfflineBooks();
      if (books && Array.isArray(books)) {
        setOfflineBooks(books);
      } else {
        setOfflineBooks([]);
      }
    } catch (e) {
      console.log("load offline error", e);
      setOfflineBooks([]);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadOffline();
    }, [])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadOffline();
    setRefreshing(false);
  };

  // ── NEW: same multi-field search as TimetableScreen ──
  // Matches title, author, file name, and any date token from savedOfflineAt.
  const filteredBooks = offlineBooks.filter((item) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;

    const title = (item.title || "").toLowerCase();
    const author = (item.author || "").toLowerCase();
    const fileName = getFileName(item).toLowerCase();
    const dateTokens = getDateSearchTokens(item.savedOfflineAt);

    return (
      title.includes(q) ||
      author.includes(q) ||
      fileName.includes(q) ||
      dateTokens.some((token) => token.includes(q))
    );
  });

  // =========================
  // DELETE
  // =========================
  const confirmDelete = (item) => {
    const itemId = item._id || item.id;

    Alert.alert(
      "Remove from device",
      `"${item.title}" will be removed from offline storage. You can re-download it anytime.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => deleteBook(itemId),
        },
      ]
    );
  };

  const deleteBook = async (id) => {
    try {
      setDeletingId(id);
      const updated = await removeOfflineBook(id);
      if (updated && Array.isArray(updated)) {
        setOfflineBooks(updated);
      } else {
        loadOffline();
      }
    } catch (e) {
      console.log("delete offline error", e);
      Alert.alert("Error", "Failed to remove book.");
    } finally {
      setDeletingId(null);
    }
  };

  // =========================
  // OPEN WITH AD ENFORCEMENT (AdsManager's rewarded ad — unchanged)
  // =========================
  const handleOpenBookPress = async (item) => {
    const networkState = await NetInfo.fetch();

    if (!networkState.isConnected || !networkState.isInternetReachable) {
      return openBook(item);
    }

    if (!rewardAdsEnabled) {
      return openBook(item);
    }

    gate(() => openBook(item));
  };

  const openBook = (item) => {
    router.push({
      pathname: "/pdf-viewer",
      params: {
        url: item.offlineUri,
        title: item.title,
        type: "pdf",
      },
    });
  };

  // =========================
  // FORMAT DATE
  // =========================
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // =========================
  // RENDER CARD
  // =========================
  const renderItem = ({ item }) => {
    const itemId = item._id || item.id;
    const isDeleting = deletingId === itemId;

    return (
      <CardTheme style={styles.card}>
        {/* ── BOOK ICON + INFO ── */}
        <View style={styles.cardInner}>
          <View style={styles.iconBlock}>
            <Ionicons name="book" size={28} color={colors.primary} />
          </View>

          <View style={styles.infoBlock}>
            <ThemeText style={styles.bookTitle} numberOfLines={2}>
              {item.title || "Untitled Document"}
            </ThemeText>

            {item.author ? (
              <ThemeText style={styles.author} numberOfLines={1}>
                {item.author}
              </ThemeText>
            ) : null}

            {item.description ? (
              <ThemeText style={styles.desc} numberOfLines={2}>
                {item.description}
              </ThemeText>
            ) : null}

            <View style={styles.footerRow}>
              <View style={styles.offlinePill}>
                <Ionicons name="checkmark-circle" size={12} color="#16a34a" />
                <ThemeText style={styles.offlinePillText}>On device</ThemeText>
              </View>

              {formatDate(item.savedOfflineAt) ? (
                <ThemeText style={styles.dateText}>
                  Saved {formatDate(item.savedOfflineAt)}
                </ThemeText>
              ) : null}
            </View>
          </View>
        </View>

        {/* ── DIVIDER ── */}
        <View style={styles.divider} />

        {/* ── ACTIONS ── */}
        <View style={styles.actions}>
          <Pressable
            onPress={() => handleOpenBookPress(item)}
            style={({ pressed }) => [
              styles.actionBtn,
              styles.openBtn,
              pressed && { opacity: 0.75 },
            ]}
          >
            <Ionicons name="book-outline" size={16} color="#fff" />
            <ThemeText style={styles.openBtnText}>Read</ThemeText>
          </Pressable>

          <Pressable
            onPress={() => confirmDelete(item)}
            disabled={isDeleting}
            style={({ pressed }) => [
              styles.actionBtn,
              styles.deleteBtn,
              pressed && { opacity: 0.75 },
              isDeleting && { opacity: 0.45 },
            ]}
          >
            <Ionicons
              name={isDeleting ? "hourglass-outline" : "trash-outline"}
              size={16}
              color="#ef4444"
            />
            <ThemeText style={styles.deleteBtnText}>
              {isDeleting ? "Removing…" : "Remove"}
            </ThemeText>
          </Pressable>
        </View>
      </CardTheme>
    );
  };

  // =========================
  // EMPTY STATE
  // =========================
  const EmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconWrap}>
        <Ionicons name="cloud-offline-outline" size={52} color="#d1d5db" />
      </View>
      <ThemeText style={styles.emptyTitle}>
        {search ? "No results found" : "No books saved yet"}
      </ThemeText>
      <ThemeText style={styles.emptySub}>
        {search
          ? `No offline books match "${search}"`
          : "Save books from your library to read them without an internet connection."}
      </ThemeText>
    </View>
  );

  // =========================
  // SCREEN
  // =========================
  return (
    <ThemeView style={styles.screen} safe>
      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View>
          <ThemeText style={styles.heading}>Offline library</ThemeText>
          {offlineBooks.length > 0 && (
            <ThemeText style={styles.subheading}>
              {offlineBooks.length}{" "}
              {offlineBooks.length === 1 ? "book" : "books"} on this device
            </ThemeText>
          )}
        </View>
        <View style={styles.headerIcon}>
          <Ionicons name="cloud-done-outline" size={24} color={colors.primary} />
        </View>
      </View>

      {/* ── SEARCH (same design as TimetableScreen) ── */}
      <View style={styles.searchWrapper}>
        <Ionicons
          name="search-outline"
          size={16}
          color={colors.textMuted || "#999"}
          style={styles.searchIcon}
        />
        <InputTheme
          placeholder="Search by title, author, file, or date…"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* ── LIST ── */}
      <FlatList
        data={filteredBooks}
        keyExtractor={(item, index) => (item._id || item.id || index).toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          filteredBooks.length === 0 && styles.listEmpty,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={<EmptyState />}
      />

      {/* Reusable banner component loaded dynamically via AdsManager */}
      <BannerAdComponent style={styles.inlineBanner} />

      {rewardAdsEnabled && <RewardedAdModal {...modalProps} />}
    </ThemeView>
  );
}

// =========================
// STYLES
// =========================
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 16,
    paddingBottom: 12,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  subheading: {
    fontSize: 13,
    opacity: 0.45,
    marginTop: 2,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  // ── NEW: search bar — matches TimetableScreen exactly ──
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
  listContent: {
    paddingBottom: 32,
    paddingTop: 4,
  },
  listEmpty: {
    flexGrow: 1,
  },
  card: {
    marginVertical: 6,
    marginHorizontal: 6,
    width:'95%',
    padding: 14,
    borderRadius: 14,
  },
  cardInner: {
    flexDirection: "row",
    gap: 12,
  },
  iconBlock: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.05)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  infoBlock: {
    flex: 1,
    gap: 3,
  },
  bookTitle: {
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 20,
  },
  author: {
    fontSize: 12,
    opacity: 0.55,
  },
  desc: {
    fontSize: 12,
    opacity: 0.5,
    lineHeight: 17,
    marginTop: 2,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
    flexWrap: "wrap",
  },
  offlinePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#dcfce7",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 20,
  },
  offlinePillText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#15803d",
  },
  dateText: {
    fontSize: 11,
    opacity: 0.4,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#e5e7eb",
    marginVertical: 12,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
  },
  openBtn: {
    backgroundColor: colors.primary,
  },
  openBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  deleteBtn: {
    backgroundColor: "#fef2f2",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#fecaca",
  },
  deleteBtnText: {
    color: "#ef4444",
    fontWeight: "600",
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingTop: 80,
    gap: 10,
  },
  emptyIconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "rgba(0,0,0,0.04)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },
  emptySub: {
    fontSize: 13,
    opacity: 0.45,
    textAlign: "center",
    lineHeight: 19,
  },
  inlineBanner: {
    marginVertical: 8,
  },
});