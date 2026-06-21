import React, { useState, useCallback } from "react";
import {
  View,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Linking,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Menu, Divider } from "react-native-paper";
import * as FileSystem from "expo-file-system";

import ThemeView from "../../component/ThemeView";
import ThemeText from "../../component/ThemeText";
import ThemeButton from "../../component/ThemeButton";
import CardTheme from "../../component/CardTheme";
import InputTheme from "../../component/InputTheme";

import {
  BannerAdComponent,
  RewardedAdModal,
  useAdGate,
} from "../../component/AdsManager";

import { colors } from "../../constant/colors";
import { useTimetable } from "../../hook/useTimeTable";
import {
  saveTimetableOffline,
  getOfflineTimetables,
  removeOfflineTimetable,
} from "../../utils/offlinebookServices/offlineTimetableService";

import { useRewardAdsEnabled } from "../../hook/useRewardAdsEnabled";

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  // Surfaces
  bg: "#F7F8FA",
  card: "#FFFFFF",
  cardBorder: "rgba(0,0,0,0.06)",

  // Primary
  primary: colors.primary,
  primaryLight: `${colors.primary}18`,

  // Status
  activeGreen: "#16a34a",
  activeGreenBg: "#DCFCE7",
  stoppedGray: "#6B7280",
  stoppedGrayBg: "#F3F4F6",

  // Danger
  danger: "#EF4444",
  dangerBg: "#FEF2F2",

  // Warning (saving)
  amber: "#D97706",

  // Text
  textPrimary: "#111827",
  textSecondary: "#6B7280",
  textMuted: "#9CA3AF",

  // Divider
  divider: "#E5E7EB",

  // Radius
  radiusCard: 16,
  radiusBtn: 10,
  radiusPill: 20,

  // Shadow
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
};

// ─── Day abbreviation map ──────────────────────────────────────────────────────
const DAY_SHORT = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};

const shortenDays = (days) =>
  days?.length ? days.map((d) => DAY_SHORT[d] || d).join(" · ") : "Every day";

// ─── Chip component ────────────────────────────────────────────────────────────
const Chip = ({ label, bg, color, dot }) => (
  <View style={[styles.chip, { backgroundColor: bg }]}>
    {dot && <View style={[styles.chipDot, { backgroundColor: color }]} />}
    <ThemeText style={[styles.chipText, { color }]}>{label}</ThemeText>
  </View>
);

// ─── Stat cell ────────────────────────────────────────────────────────────────
const StatCell = ({ icon, value, flex }) => (
  <View style={[styles.statCell, flex && { flex: 1 }]}>
    <Ionicons name={icon} size={13} color={T.textMuted} />
    <ThemeText style={styles.statText} numberOfLines={1}>
      {value}
    </ThemeText>
  </View>
);

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN
// ─────────────────────────────────────────────────────────────────────────────
export default function TimetableScreen() {
  const router = useRouter();
  const rewardAdsEnabled = useRewardAdsEnabled();
  const runWithOptionalAd = (callback, options = {}) => {
  if (!rewardAdsEnabled) {
    return callback();
  }

  gate(callback, options);
};

  const {
    timetables,
    fetchTimetables,
    deleteTimetable,
    stopTimetable,
    reactivateTimetable,
  } = useTimetable();

  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisibleId, setMenuVisibleId] = useState(null);
  const [loadingActionId, setLoadingActionId] = useState(null);
  const [loadingActionType, setLoadingActionType] = useState(null);
  const [savingOfflineId, setSavingOfflineId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [offlineMap, setOfflineMap] = useState({});

  const { gate, modalProps } = useAdGate({
    onEarned: () => console.log("Ad gate: reward earned"),
    onDismissed: () => console.log("Ad gate: dismissed"),
  });

  const filtered = (timetables || []).filter((t) =>
    t.bookId?.title?.toLowerCase().includes(search.toLowerCase())
  );

  const loadOfflineMap = async () => {
    const data = await getOfflineTimetables();
    const map = {};
    data.forEach((t) => (map[t._id] = true));
    setOfflineMap(map);
  };

  useFocusEffect(
    useCallback(() => {
      fetchTimetables();
      loadOfflineMap();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTimetables();
    setRefreshing(false);
  };

  const closeMenu = () => setMenuVisibleId(null);

  // ── Actions ──────────────────────────────────────────────────────────────────
  const handleStop = async (id) => {
    closeMenu();
    try {
      setLoadingActionId(id);
      setLoadingActionType("stop");
      await stopTimetable(id);
    } catch {
      Alert.alert("Error", "Could not stop timetable.");
    } finally {
      setLoadingActionId(null);
      setLoadingActionType(null);
    }
  };

  const handleReactivate = async (id) => {
    closeMenu();
    try {
      setLoadingActionId(id);
      setLoadingActionType("reactivate");
      await reactivateTimetable(id);
    } catch {
      Alert.alert("Error", "Could not reactivate timetable.");
    } finally {
      setLoadingActionId(null);
      setLoadingActionType(null);
    }
  };

  const handleDelete = (id) => {
    closeMenu();
    Alert.alert(
      "Delete timetable?",
      "This will permanently remove the schedule and cancel all reminders.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setDeletingId(id);
              await deleteTimetable(id);
              if (offlineMap[id]) {
                await removeOfflineTimetable(id);
                setOfflineMap((prev) => {
                  const next = { ...prev };
                  delete next[id];
                  return next;
                });
              }
            } catch {
              Alert.alert("Error", "Failed to delete timetable.");
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  };

  // const handleSaveOfflineGated = (item) => {
  //   gate(
  //     async () => {
  //       try {
  //         setSavingOfflineId(item._id);
  //         await saveTimetableOffline(item);
  //         setOfflineMap((prev) => ({ ...prev, [item._id]: true }));
  //         Alert.alert("Saved offline", `"${item.bookId?.title}" is now available without internet.`);
  //       } catch {
  //         Alert.alert("Error", "Failed to save offline.");
  //       } finally {
  //         setSavingOfflineId(null);
  //       }
  //     },
  //     { cooldown: 30000 }
  //   );
  // };
  const handleSaveOfflineGated = (item) => {
  runWithOptionalAd(
    async () => {
      try {
        setSavingOfflineId(item._id);
        await saveTimetableOffline(item);
        setOfflineMap((prev) => ({ ...prev, [item._id]: true }));

        Alert.alert(
          "Saved offline",
          `"${item.bookId?.title}" is now available without internet.`
        );
      } catch {
        Alert.alert("Error", "Failed to save offline.");
      } finally {
        setSavingOfflineId(null);
      }
    },
    { cooldown: 30000 }
  );
};

  const handleRemoveOffline = (id) => {
    Alert.alert(
      "Remove offline copy?",
      "The book will no longer be available without internet.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            await removeOfflineTimetable(id);
            setOfflineMap((prev) => {
              const next = { ...prev };
              delete next[id];
              return next;
            });
          },
        },
      ]
    );
  };

  const openBookFromTimetable = async (item) => {
    closeMenu();
    // gate(async () => {
      runWithOptionalAd(async () => {
      try {
        const book = item.bookId;
        if (!book) return Alert.alert("Error", "No book attached.");

        const url = book.fileUrl || book.fileLink;
        if (!url) return Alert.alert("Error", "No file available.");

        if (book.fileType === "link") {
          const supported = await Linking.canOpenURL(url);
          if (!supported) return Alert.alert("Error", "Cannot open this link.");
          await Linking.openURL(url);
          return;
        }

        const cleanUrl = url.split("?")[0];
        let filename = cleanUrl.split("/").pop() || `${book._id}.pdf`;
        if (!filename.endsWith(".pdf")) filename += ".pdf";

        const localUri = FileSystem.documentDirectory + filename;
        const fileInfo = await FileSystem.getInfoAsync(localUri);
        let finalUri = localUri;

        if (!fileInfo.exists) {
          const download = await FileSystem.downloadAsync(cleanUrl, localUri);
          const check = await FileSystem.getInfoAsync(download.uri);
          if (!check.exists || check.size < 1000) throw new Error("Invalid PDF.");
          finalUri = download.uri;
        }

        router.push({
          pathname: "/pdf-viewer",
          params: { url: finalUri, title: book.title },
        });
      } catch (err) {
        console.log("Open book error:", err);
        Alert.alert("Error", "Failed to open book.");
      }
    });
  };

  // ── Card renderer ─────────────────────────────────────────────────────────────
  const renderItem = ({ item }) => {
    const isActioning = loadingActionId === item._id;
    const actionLabel = loadingActionType === "stop" ? "Stopping…" : "Reactivating…";
    const isSaving = savingOfflineId === item._id;
    const isDeleting = deletingId === item._id;
    const isOffline = !!offlineMap[item._id];
    const isLink = item.bookId?.fileType === "link";

    return (
      <View style={styles.card}>
        {/* ── Top row: title + menu ── */}
        <View style={styles.cardTop}>
          <View style={styles.cardMeta}>
            <Chip
              label={item.isActive ? "Active" : "Stopped"}
              bg={item.isActive ? T.activeGreenBg : T.stoppedGrayBg}
              color={item.isActive ? T.activeGreen : T.stoppedGray}
              dot
            />
            {item.planType ? (
              <Chip
                label={item.planType}
                bg={T.primaryLight}
                color={T.primary}
              />
            ) : null}
          </View>

          <Menu
            visible={menuVisibleId === item._id}
            onDismiss={closeMenu}
            anchor={
              <Pressable
                onPress={() => setMenuVisibleId(item._id)}
                style={styles.menuAnchor}
                hitSlop={10}
              >
                <Ionicons name="ellipsis-vertical" size={18} color={T.textSecondary} />
              </Pressable>
            }
          >
            <Menu.Item
              leadingIcon="book-open-outline"
              title="Open "
              onPress={() => openBookFromTimetable(item)}
            />
            <Menu.Item
              leadingIcon="information-outline"
              title="View details"
              onPress={() => {
                closeMenu();
                router.push({
                  pathname: "/timetable/detail",
                  params: { timetableId: item._id },
                });
              }}
            />
            <Divider />
            {item.isActive ? (
              <Menu.Item
                leadingIcon="stop-circle-outline"
                title="Pause reminders"
                onPress={() => handleStop(item._id)}
              />
            ) : (
              <Menu.Item
                leadingIcon="refresh-circle-outline"
                title="Reactivate"
                onPress={() => handleReactivate(item._id)}
              />
            )}
            <Divider />
            <Menu.Item
              leadingIcon="delete-outline"
              title="Delete"
              titleStyle={{ color: T.danger }}
              onPress={() => handleDelete(item._id)}
            />
          </Menu>
        </View>

        {/* ── Book title ── */}
        <ThemeText style={styles.cardTitle} numberOfLines={2}>
          {item.bookId?.title || "Untitled"}
        </ThemeText>

        {/* ── Schedule stats ── */}
        <View style={styles.statRow}>
          <StatCell icon="time-outline" value={item.reminderTime} />
          <View style={styles.statDivider} />
          <StatCell
            icon="notifications-outline"
            value={`${item.noticeCount} ${item.noticeCount === 1 ? "session" : "sessions"}`}
          />
          <View style={styles.statDivider} />
          <StatCell
            icon="calendar-outline"
            value={shortenDays(item.studyDays)}
            flex
          />
        </View>

        {/* ── Delivery mode footer ── */}
        {item.deliveryMode && (
          <ThemeText style={styles.deliveryMode}>
            {item.deliveryMode.charAt(0).toUpperCase() + item.deliveryMode.slice(1)} delivery
          </ThemeText>
        )}

        {/* ── Inline action feedback ── */}
        {(isActioning || isDeleting) && (
          <View style={[styles.feedbackRow, isDeleting && styles.feedbackDanger]}>
            <ActivityIndicator
              size="small"
              color={isDeleting ? T.danger : T.primary}
            />
            <ThemeText
              style={[
                styles.feedbackText,
                isDeleting && { color: T.danger },
              ]}
            >
              {isDeleting ? "Deleting…" : actionLabel}
            </ThemeText>
          </View>
        )}

        {/* ── Offline toggle ── */}
        {!isLink && (
          <Pressable
            style={[
              styles.offlineRow,
              isOffline && styles.offlineRowSaved,
            ]}
            onPress={() =>
              isOffline
                ? handleRemoveOffline(item._id)
                : handleSaveOfflineGated(item)
            }
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <ActivityIndicator size="small" color={T.primary} />
                <ThemeText style={[styles.offlineText, { color: T.primary }]}>
                  Saving…
                </ThemeText>
              </>
            ) : isOffline ? (
              <>
                <Ionicons name="checkmark-circle" size={16} color={T.activeGreen} />
                <ThemeText style={[styles.offlineText, { color: T.activeGreen }]}>
                  Available offline
                </ThemeText>
                <ThemeText style={styles.offlineSub}>· Tap to remove</ThemeText>
              </>
            ) : (
              <>
                <Ionicons name="arrow-down-circle-outline" size={16} color={T.primary} />
                <ThemeText style={[styles.offlineText, { color: T.primary }]}>
                  Save for offline
                </ThemeText>
              </>
            )}
          </Pressable>
        )}
      </View>
    );
  };

  // ── Screen ────────────────────────────────────────────────────────────────────
  return (
    <ThemeView safe style={styles.screen}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <ThemeText style={styles.heading}>Timetables</ThemeText>
          <ThemeText style={styles.subheading}>
            {filtered.length} schedule{filtered.length !== 1 ? "s" : ""}
          </ThemeText>
        </View>
        <Pressable
          style={styles.createBtn}
          onPress={() => router.push("/book")}
        >
          <Ionicons name="arrow-forward" size={18} color="#fff" />
          <ThemeText style={styles.createBtnText}>Back</ThemeText>
        </Pressable>
      </View>

      {/* ── Search ── */}
      <View style={styles.searchWrapper}>
        <Ionicons
          name="search-outline"
          size={16}
          color={T.textMuted}
          style={styles.searchIcon}
        />
        <InputTheme
          placeholder="Search by book title…"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* ── List ── */}
      <FlatList
        data={filtered}
        keyExtractor={(i) => i._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={T.primary}
            colors={[T.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="calendar-outline" size={36} color={T.primary} />
            </View>
            <ThemeText style={styles.emptyTitle}>
              {search ? "No results found" : "No timetables yet"}
            </ThemeText>
            <ThemeText style={styles.emptySub}>
              {search
                ? `No schedules match "${search}"`
                : "Create a schedule to start sending yourself study reminders."}
            </ThemeText>
            {!search && (
              <Pressable
                style={styles.emptyBtn}
                onPress={() => router.push("/createTimetable")}
              >
                <ThemeText style={styles.emptyBtnText}>Create timetable</ThemeText>
              </Pressable>
            )}
          </View>
        }
      />

      {/* ── Banner ad ── */}
      <BannerAdComponent />

      {/* ── Rewarded modal ── */}
      {/* <RewardedAdModal {...modalProps} /> */}
      {rewardAdsEnabled && (
  <RewardedAdModal {...modalProps} />
)}

    </ThemeView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: T.bg,
    paddingHorizontal: 16,
  },

  // ── Header ──
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 8 : 16,
    paddingBottom: 14,
  },
  heading: {
    fontSize: 26,
    fontWeight: "800",
    color: T.textPrimary,
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: 12,
    color: T.textMuted,
    marginTop: 2,
    fontWeight: "500",
  },
  createBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: T.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: T.radiusBtn,
    ...T.shadow,
  },
  createBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },

  // ── Search ──
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
    backgroundColor: T.card,
    borderRadius: T.radiusBtn,
    borderWidth: 1,
    borderColor: T.cardBorder,
  },

  // ── List ──
  listContent: {
    paddingBottom: 24,
    paddingTop: 2,
  },

  // ── Card ──
  card: {
    backgroundColor: T.card,
    borderRadius: T.radiusCard,
    marginVertical: 6,
    padding: 16,
    borderWidth: 1,
    borderColor: T.cardBorder,
    ...T.shadow,
  },

  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
    flexWrap: "wrap",
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: T.textPrimary,
    lineHeight: 22,
    marginBottom: 12,
  },

  menuAnchor: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: T.bg,
  },

  // ── Chip ──
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: T.radiusPill,
  },
  chipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  chipText: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.1,
  },

  // ── Stats row ──
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: T.bg,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  statCell: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  statText: {
    fontSize: 12,
    color: T.textSecondary,
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    height: 14,
    backgroundColor: T.divider,
    marginHorizontal: 10,
  },

  deliveryMode: {
    fontSize: 11,
    color: T.textMuted,
    fontWeight: "500",
    marginBottom: 4,
    textTransform: "capitalize",
  },

  // ── Feedback ──
  feedbackRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
    paddingTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: T.divider,
    backgroundColor: T.primaryLight,
    borderRadius: 8,
  },
  feedbackDanger: {
    backgroundColor: T.dangerBg,
  },
  feedbackText: {
    fontSize: 13,
    color: T.primary,
    fontWeight: "500",
  },

  // ── Offline row ──
  offlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: T.divider,
  },
  offlineRowSaved: {
    // subtle tint when saved
  },
  offlineText: {
    fontSize: 13,
    fontWeight: "600",
  },
  offlineSub: {
    fontSize: 12,
    color: T.textMuted,
    fontWeight: "400",
  },

  // ── Empty state ──
  emptyState: {
    alignItems: "center",
    paddingTop: 72,
    paddingHorizontal: 24,
    gap: 8,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: T.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: T.textPrimary,
    textAlign: "center",
  },
  emptySub: {
    fontSize: 13,
    color: T.textMuted,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 4,
  },
  emptyBtn: {
    marginTop: 12,
    backgroundColor: T.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: T.radiusBtn,
  },
  emptyBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});
