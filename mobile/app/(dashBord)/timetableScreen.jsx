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
  Share,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Menu, Divider } from "react-native-paper";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Link } from "expo-router";

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
import { useTheme } from "../../context/ThemeContext";
import { useTimetable } from "../../hook/useTimeTable";
import {
  saveTimetableOffline,
  getOfflineTimetables,
  removeOfflineTimetable,
} from "../../utils/offlinebookServices/offlineTimetableService";

import { useRewardAdsEnabled } from "../../hook/useRewardAdsEnabled";
import { useUser } from "../../hook/useUser";
import Spacer from "../../component/Spacer";

// ─── Hex → rgba helper (for brand colors we control, not the theme object) ────
const hexToRgba = (hex, alpha) => {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean.split("").map((c) => c + c).join("")
      : clean;
  const bigint = parseInt(full, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
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

// ─── date helpers for search + display ───────────────────────────────────
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Human-readable date shown on the card, e.g. "Jul 16, 2026"
const formatDisplayDate = (dateStr) => {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return `${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}, ${d.getFullYear()}`;
};

// All the ways someone might type a date, so a single text search box
// can match "16", "july", "jul", "2026", "7/16/2026", etc.
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

// Extracts a readable file name from the book's file URL/link
const getFileName = (book) => {
  if (!book) return "";
  const url = book.fileUrl || book.fileLink || "";
  if (!url) return "";
  const clean = url.split("?")[0];
  try {
    return decodeURIComponent(clean.split("/").pop() || "");
  } catch {
    return clean.split("/").pop() || "";
  }
};

// ─── Chip component (colors always passed in from the caller) ────────────────
const Chip = ({ label, bg, color, dot }) => (
  <View style={[styles.chip, { backgroundColor: bg }]}>
    {dot && <View style={[styles.chipDot, { backgroundColor: color }]} />}
    <ThemeText style={[styles.chipText, { color }]}>{label}</ThemeText>
  </View>
);

// ─── Stat cell (color passed in so it stays theme-aware) ──────────────────────
const StatCell = ({ icon, value, flex, color }) => (
  <View style={[styles.statCell, flex && { flex: 1 }]}>
    <Ionicons name={icon} size={13} color={color} />
    <ThemeText style={[styles.statText, { color }]} numberOfLines={1}>
      {value}
    </ThemeText>
  </View>
);

// ─── NEW: Section tabs (All / Timetables / Reminders) ─────────────────────────
const SectionTabs = ({ active, onChange, counts, T }) => {
  const tabs = [
    { key: "all", label: "All" },
    { key: "timetable", label: "Timetables" },
    { key: "reminder", label: "Reminders" },
  ];

  return (
    <View style={styles.tabsRow}>
      {tabs.map((tab) => {
        const isActive = active === tab.key;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            style={[
              styles.tabBtn,
              {
                backgroundColor: isActive ? T.primary : T.card,
                borderColor: isActive ? T.primary : T.cardBorder,
              },
            ]}
          >
            <ThemeText
              style={[
                styles.tabText,
                { color: isActive ? "#fff" : T.textSecondary },
              ]}
            >
              {tab.label}
            </ThemeText>
            <View
              style={[
                styles.tabCountPill,
                { backgroundColor: isActive ? "rgba(255,255,255,0.25)" : T.primaryLight },
              ]}
            >
              <ThemeText
                style={[
                  styles.tabCountText,
                  { color: isActive ? "#fff" : T.primary },
                ]}
              >
                {counts[tab.key]}
              </ThemeText>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN
// ─────────────────────────────────────────────────────────────────────────────
export default function TimetableScreen() {
  const router = useRouter();
  const { user, authReady, logOut } = useUser();
  const { theme, scheme } = useTheme();
  const rewardAdsEnabled = useRewardAdsEnabled();

  const {
    timetables,
    fetchTimetables,
    deleteTimetable,
    stopTimetable,
    reactivateTimetable,
  } = useTimetable();

  const [search, setSearch] = useState("");
  // ── NEW: which section tab is active ──
  const [sectionFilter, setSectionFilter] = useState("all"); // "all" | "timetable" | "reminder"
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisibleId, setMenuVisibleId] = useState(null);
  const [loadingActionId, setLoadingActionId] = useState(null);
  const [loadingActionType, setLoadingActionType] = useState(null);
  const [savingOfflineId, setSavingOfflineId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [sharingId, setSharingId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  // ── tracks live 0–100 progress per item so the UI can show a real bar ──
  const [downloadProgress, setDownloadProgress] = useState({});
  const [offlineMap, setOfflineMap] = useState({});

  const { gate, modalProps } = useAdGate({
    onEarned: () => console.log("Ad gate: reward earned"),
    onDismissed: () => console.log("Ad gate: dismissed"),
  });

  // ── Theme-derived design tokens (recomputed every render, so dark mode
  // flips instantly the same way DashBordLayout's tabBarStyle does) ──────────
  const isDark = scheme === "dark";
  const T = {
    bg: theme.background,
    card: isDark ? hexToRgba("#FFFFFF", 0.05) : "#FFFFFF",
    cardBorder: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",

    primary: colors.primary,
    primaryLight: hexToRgba(colors.primary, isDark ? 0.22 : 0.1),

    activeGreen: "#16a34a",
    activeGreenBg: hexToRgba("#16a34a", isDark ? 0.2 : 0.12),
    stoppedGray: isDark ? "#9CA3AF" : "#6B7280",
    stoppedGrayBg: isDark ? "rgba(156,163,175,0.16)" : "#F3F4F6",

    danger: "#EF4444",
    dangerBg: hexToRgba("#EF4444", isDark ? 0.2 : 0.08),

    textPrimary: theme.title,
    textSecondary: theme.text,
    textMuted: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)",

    divider: isDark ? "rgba(255,255,255,0.08)" : "#E5E7EB",

    radiusCard: 16,
    radiusBtn: 10,
    radiusPill: 20,

    shadow: isDark
      ? {}
      : {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 3,
        },
  };

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

  const runWithOptionalAd = (callback, options = {}) => {
    if (!rewardAdsEnabled) {
      return callback();
    }
    gate(callback, options);
  };

  // ── NEW: section filter applied BEFORE search ──
  // Older records created before scheduleKind existed default to "timetable".
  const bySection = (timetables || []).filter((t) => {
    if (sectionFilter === "all") return true;
    const kind = t.scheduleKind || "timetable";
    return kind === sectionFilter;
  });

  // ── search now checks title, file name, file type, and date tokens,
  // scoped to whichever section is currently active ──
  const filtered = bySection.filter((t) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;

    const book = t.bookId;
    const title = book?.title?.toLowerCase() || "";
    const fileName = getFileName(book).toLowerCase();
    const fileType = (book?.fileType || "").toLowerCase();
    const dateTokens = getDateSearchTokens(t.createdAt);

    return (
      title.includes(q) ||
      fileName.includes(q) ||
      fileType.includes(q) ||
      dateTokens.some((token) => token.includes(q))
    );
  });

  // ── NEW: tab badge counts, computed from the FULL list so they don't
  // shift as the person types a search query ──
  const sectionCounts = {
    all: (timetables || []).length,
    timetable: (timetables || []).filter(
      (t) => (t.scheduleKind || "timetable") === "timetable"
    ).length,
    reminder: (timetables || []).filter((t) => t.scheduleKind === "reminder")
      .length,
  };

  // ── Early returns come AFTER every hook has been called ──
  if (!authReady) {
    return (
      <ThemeView style={styles.centered}>
        <ActivityIndicator
          size={20}
          color={colors.primary}
          style={{ flex: 1, alignItems: "center" }}
        />
      </ThemeView>
    );
  }

  if (!user) {
    return (
      <ThemeView style={styles.centered}>
        <Ionicons name="person-circle-outline" size={64} color={T.textMuted} />
        <Spacer />
        <ThemeText>No user logged in</ThemeText>
        <Spacer />
        <Link href="/login">
          <ThemeText style={{ color: T.primary, fontWeight: "700" }}>
            Go to Login
          </ThemeText>
        </Link>
      </ThemeView>
    );
  }

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

  // ─────────────────────────────────────────────
  // Helper: get (or create) a local copy of the book file in cache,
  // used only for sharing (attaching bytes to the native share sheet).
  // Reuses the offline/documentDirectory copy if one already exists.
  // ─────────────────────────────────────────────
  const getLocalFileUri = async (book) => {
    const cleanUrl = book.fileUrl.split("?")[0];
    let filename = cleanUrl.split("/").pop();
    if (!filename.includes(".")) filename += ".pdf";

    const existingDocUri = FileSystem.documentDirectory + filename;
    const docInfo = await FileSystem.getInfoAsync(existingDocUri);
    if (docInfo.exists) return existingDocUri;

    const localUri = FileSystem.cacheDirectory + filename;
    const downloadResult = await FileSystem.downloadAsync(book.fileUrl, localUri);
    const fileInfo = await FileSystem.getInfoAsync(downloadResult.uri);

    if (!fileInfo.exists || fileInfo.size < 1000) {
      throw new Error("Downloaded file looks invalid");
    }

    return downloadResult.uri;
  };

  // ─────────────────────────────────────────────
  // Share the ACTUAL file for file-type books (native share sheet with
  // the file attached). Link-type books share the URL as text instead,
  // since there's nothing to attach.
  // ─────────────────────────────────────────────
  const handleShareBook = (item) => {
    closeMenu();
    const book = item.bookId;
    if (!book) {
      Alert.alert("Error", "No book attached.");
      return;
    }

    runWithOptionalAd(async () => {
      try {
        const isLink = book.fileType === "link";

        if (isLink) {
          const shareUrl = book.fileUrl || book.fileLink;
          if (!shareUrl) {
            Alert.alert("Error", "No link available to share for this book.");
            return;
          }
          await Share.share({
            message: `${book.title}\n${shareUrl}`,
            url: shareUrl,
            title: book.title,
          });
          return;
        }

        if (!book.fileUrl) {
          Alert.alert("Error", "No file available to share for this book.");
          return;
        }

        setSharingId(item._id);

        const canShare = await Sharing.isAvailableAsync();
        if (!canShare) {
          Alert.alert("Error", "Sharing isn't available on this device.");
          return;
        }

        const localUri = await getLocalFileUri(book);

        await Sharing.shareAsync(localUri, {
          dialogTitle: `Share "${book.title}"`,
          mimeType: "application/pdf",
          UTI: "com.adobe.pdf",
        });
      } catch (error) {
        console.log("Share error:", error);
        Alert.alert("Error", `Failed to share file.\n${error?.message || ""}`);
      } finally {
        setSharingId(null);
      }
    });
  };

  // ─────────────────────────────────────────────
  // Get (and cache) permission to write into a real, user-visible
  // folder on Android — e.g. Downloads. Prompts once via the system
  // directory picker, then remembers the chosen folder.
  // ─────────────────────────────────────────────
  const getAndroidSafDirectory = async () => {
    const prefsPath = FileSystem.documentDirectory + "saf_dir_pref.json";

    try {
      const info = await FileSystem.getInfoAsync(prefsPath);
      if (info.exists) {
        const raw = await FileSystem.readAsStringAsync(prefsPath);
        const parsed = JSON.parse(raw);
        if (parsed?.dirUri) return parsed.dirUri;
      }
    } catch (e) {
      console.log("Reading saved SAF dir failed, will re-prompt:", e);
    }

    const permission = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!permission.granted) return null;

    try {
      await FileSystem.writeAsStringAsync(
        prefsPath,
        JSON.stringify({ dirUri: permission.directoryUri })
      );
    } catch (e) {
      console.log("Could not persist SAF dir choice:", e);
    }

    return permission.directoryUri;
  };

  // ─────────────────────────────────────────────
  // Download the file for real — no share sheet involved.
  // Uses createDownloadResumable so we get live byte-level progress
  // callbacks, which we turn into a 0–100 percent shown on the card and
  // in the menu item label.
  //
  // Android: downloads to cache first (with progress), then copies the
  //          bytes into a folder the user picked via SAF (e.g. Downloads).
  // iOS: downloads with progress straight into the app's Documents dir.
  // ─────────────────────────────────────────────
  const executeDownloadBook = async (item) => {
    const book = item.bookId;
    if (!book?.fileUrl) {
      Alert.alert("Error", "No file available to download.");
      return;
    }

    try {
      setDownloadingId(item._id);
      setDownloadProgress((prev) => ({ ...prev, [item._id]: 0 }));

      const cleanUrl = book.fileUrl.split("?")[0];
      let filename = cleanUrl.split("/").pop();
      if (!filename.includes(".")) filename += ".pdf";

      const onProgress = (progressEvent) => {
        const { totalBytesWritten, totalBytesExpectedToWrite } = progressEvent;
        if (!totalBytesExpectedToWrite) return;
        const percent = Math.round(
          (totalBytesWritten / totalBytesExpectedToWrite) * 100
        );
        setDownloadProgress((prev) => ({ ...prev, [item._id]: percent }));
      };

      if (Platform.OS === "android") {
        const dirUri = await getAndroidSafDirectory();

        if (!dirUri) {
          Alert.alert(
            "Permission needed",
            "Please choose a folder (e.g. Downloads) so the file can be saved."
          );
          return;
        }

        const tempUri = FileSystem.cacheDirectory + filename;

        const downloadable = FileSystem.createDownloadResumable(
          book.fileUrl,
          tempUri,
          {},
          onProgress
        );

        const downloadResult = await downloadable.downloadAsync();

        const tempInfo = await FileSystem.getInfoAsync(downloadResult.uri);
        if (!tempInfo.exists || tempInfo.size < 1000) {
          throw new Error("Downloaded file looks invalid");
        }

        // Copying into SAF storage is fast/local, so we jump progress to
        // 100 here rather than trying to track this second, tiny step.
        setDownloadProgress((prev) => ({ ...prev, [item._id]: 100 }));

        const base64Data = await FileSystem.readAsStringAsync(downloadResult.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const destUri = await FileSystem.StorageAccessFramework.createFileAsync(
          dirUri,
          filename,
          "application/octet-stream"
        );

        await FileSystem.writeAsStringAsync(destUri, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });

        await FileSystem.deleteAsync(downloadResult.uri, { idempotent: true });

        Alert.alert(
          "✅ Download Complete",
          `"${book.title}" was saved successfully.\n\nYou can find it in the folder you selected (e.g. Downloads) using your device's file manager, under the name:\n${filename}`
        );
        return;
      }

      // iOS (and any other non-Android platform)
      const localUri = FileSystem.documentDirectory + filename;

      const downloadable = FileSystem.createDownloadResumable(
        book.fileUrl,
        localUri,
        {},
        onProgress
      );

      const downloadResult = await downloadable.downloadAsync();

      const fileInfo = await FileSystem.getInfoAsync(downloadResult.uri);
      if (!fileInfo.exists || fileInfo.size < 1000) {
        throw new Error("Downloaded file looks invalid");
      }

      Alert.alert(
        "✅ Download Complete",
        `"${book.title}" was saved successfully.\n\nOn iOS, find it in the Files app → On My iPhone/iPad → [App Name].\n\nPath:\n${downloadResult.uri}`
      );
    } catch (err) {
      console.log("Download error:", err);
      Alert.alert("Error", `Failed to download file.\n${err?.message || ""}`);
    } finally {
      setDownloadingId(null);
      setDownloadProgress((prev) => {
        const next = { ...prev };
        delete next[item._id];
        return next;
      });
    }
  };

  const handleDownloadBook = (item) => {
    closeMenu();
    const book = item.bookId;
    if (!book) {
      Alert.alert("Error", "No book attached.");
      return;
    }
    runWithOptionalAd(() => executeDownloadBook(item), { cooldown: 180000 });
  };

  // ── Card renderer ─────────────────────────────────────────────────────────────
  const renderItem = ({ item }) => {
    const isActioning = loadingActionId === item._id;
    const actionLabel = loadingActionType === "stop" ? "Stopping…" : "Reactivating…";
    const isSaving = savingOfflineId === item._id;
    const isDeleting = deletingId === item._id;
    const isOffline = !!offlineMap[item._id];
    const isLink = item.bookId?.fileType === "link";
    const isSharing = sharingId === item._id;
    const isDownloading = downloadingId === item._id;
    const progress = downloadProgress[item._id] ?? 0;
    const createdLabel = formatDisplayDate(item.createdAt);

    // ── NEW: derive display kind (defaults to "timetable" for old records) ──
    const kind = item.scheduleKind || "timetable";
    const isReminderKind = kind === "reminder";

    return (
      <View
        style={[
          styles.card,
          { backgroundColor: T.card, borderColor: T.cardBorder },
          T.shadow,
        ]}
      >
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
            {/* ── NEW: schedule kind chip ── */}
            <Chip
              label={isReminderKind ? "Reminder" : "Timetable"}
              bg={
                isReminderKind
                  ? hexToRgba("#8b5cf6", isDark ? 0.22 : 0.1)
                  : T.primaryLight
              }
              color={isReminderKind ? "#8b5cf6" : T.primary}
            />
          </View>

          <Menu
            visible={menuVisibleId === item._id}
            onDismiss={closeMenu}
            anchor={
              <Pressable
                onPress={() => setMenuVisibleId(item._id)}
                style={[styles.menuAnchor, { backgroundColor: T.bg }]}
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
              leadingIcon="share-variant"
              title={isSharing ? "Preparing…" : "Share"}
              onPress={() => handleShareBook(item)}
              disabled={isSharing}
            />
            {!isLink && (
              <Menu.Item
                leadingIcon="download-outline"
                title={isDownloading ? `Downloading… ${progress}%` : "Download"}
                onPress={() => handleDownloadBook(item)}
                disabled={isDownloading}
              />
            )}
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
        <ThemeText
          style={[styles.cardTitle, { color: T.textPrimary }]}
          numberOfLines={2}
        >
          {item.bookId?.title || "Untitled"}
        </ThemeText>

        {/* ── Schedule stats ── */}
        <View style={[styles.statRow, { backgroundColor: T.bg }]}>
          <StatCell icon="time-outline" value={item.reminderTime} color={T.textMuted} />
          <View style={[styles.statDivider, { backgroundColor: T.divider }]} />
          <StatCell
            icon="notifications-outline"
            value={`${item.noticeCount} ${item.noticeCount === 1 ? "session" : "sessions"}`}
            color={T.textMuted}
          />
          <View style={[styles.statDivider, { backgroundColor: T.divider }]} />
          <StatCell
            icon="calendar-outline"
            value={shortenDays(item.studyDays)}
            flex
            color={T.textMuted}
          />
        </View>

        {/* ── file name + created date row ── */}
        <View style={styles.metaRow}>
          {!!getFileName(item.bookId) && (
            <ThemeText
              style={[styles.metaText, { color: T.textMuted }]}
              numberOfLines={1}
            >
              {getFileName(item.bookId)}
            </ThemeText>
          )}
          {createdLabel && (
            <ThemeText style={[styles.metaText, { color: T.textMuted }]}>
              Added {createdLabel}
            </ThemeText>
          )}
        </View>

        {/* ── Delivery mode footer ── */}
        {item.deliveryMode && (
          <ThemeText style={[styles.deliveryMode, { color: T.textMuted }]}>
            {item.deliveryMode.charAt(0).toUpperCase() + item.deliveryMode.slice(1)} delivery
          </ThemeText>
        )}

        {/* ── Inline action feedback (stop/reactivate/delete) ── */}
        {(isActioning || isDeleting) && (
          <View
            style={[
              styles.feedbackRow,
              { backgroundColor: isDeleting ? T.dangerBg : T.primaryLight, borderTopColor: T.divider },
            ]}
          >
            <ActivityIndicator
              size="small"
              color={isDeleting ? T.danger : T.primary}
            />
            <ThemeText
              style={[
                styles.feedbackText,
                { color: isDeleting ? T.danger : T.primary },
              ]}
            >
              {isDeleting ? "Deleting…" : actionLabel}
            </ThemeText>
          </View>
        )}

        {/* ── Download progress bar ── */}
        {isDownloading && (
          <View style={[styles.downloadRow, { borderTopColor: T.divider }]}>
            <View style={styles.downloadHeader}>
              <ThemeText style={[styles.downloadLabel, { color: T.primary }]}>
                Downloading… {progress}%
              </ThemeText>
            </View>
            <View style={[styles.progressTrack, { backgroundColor: T.divider }]}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progress}%`, backgroundColor: T.primary },
                ]}
              />
            </View>
          </View>
        )}

        {/* ── Offline toggle ── */}
        {!isLink && (
          <Pressable
            style={[styles.offlineRow, { borderTopColor: T.divider }]}
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
                <ThemeText style={[styles.offlineSub, { color: T.textMuted }]}>
                  · Tap to remove
                </ThemeText>
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
          <ThemeText style={[styles.heading, { color: T.textPrimary }]}>
            Timetables
          </ThemeText>
          <ThemeText style={[styles.subheading, { color: T.textMuted }]}>
            {filtered.length} schedule{filtered.length !== 1 ? "s" : ""}
          </ThemeText>
        </View>
        <Pressable
          style={[styles.createBtn, { backgroundColor: T.primary }, T.shadow]}
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
          placeholder="Search by title, file name, type, or date…"
          value={search}
          onChangeText={setSearch}
          style={[
            styles.searchInput,
            { backgroundColor: T.card, borderColor: T.cardBorder },
          ]}
        />
      </View>

      {/* ── NEW: section tabs — All / Timetables / Reminders ── */}
      <SectionTabs
        active={sectionFilter}
        onChange={setSectionFilter}
        counts={sectionCounts}
        T={T}
      />

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
            <View style={[styles.emptyIconWrap, { backgroundColor: T.primaryLight }]}>
              <Ionicons name="calendar-outline" size={36} color={T.primary} />
            </View>
            <ThemeText style={[styles.emptyTitle, { color: T.textPrimary }]}>
              {search ? "No results found" : "Nothing here yet"}
            </ThemeText>
            <ThemeText style={[styles.emptySub, { color: T.textMuted }]}>
              {search
                ? `No ${
                    sectionFilter === "all" ? "schedules" : sectionFilter + "s"
                  } match "${search}"`
                : sectionFilter === "reminder"
                ? "You haven't created any one-off reminders yet."
                : sectionFilter === "timetable"
                ? "You haven't created any recurring timetables yet."
                : "Create a schedule to start sending yourself study reminders."}
            </ThemeText>
            {!search && (
              <Pressable
                style={[styles.emptyBtn, { backgroundColor: T.primary }]}
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
      {rewardAdsEnabled && (
        <RewardedAdModal {...modalProps} />
      )}

    </ThemeView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES — layout only. All colors are applied inline above via `T`, since
// StyleSheet.create runs once at module load and would otherwise "freeze"
// whatever color was baked in at that time, ignoring theme changes.
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    flex: 1,
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
    letterSpacing: -0.5,
  },
  subheading: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: "500",
  },
  createBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
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
    borderRadius: 10,
    borderWidth: 1,
  },

  // ── NEW: Section tabs ──
  tabsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  tabBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
  },
  tabCountPill: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  tabCountText: {
    fontSize: 11,
    fontWeight: "700",
  },

  // ── List ──
  listContent: {
    paddingBottom: 24,
    paddingTop: 2,
  },

  // ── Card ──
  card: {
    borderRadius: 16,
    marginVertical: 6,
    padding: 16,
    borderWidth: 1,
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
    lineHeight: 22,
    marginBottom: 12,
  },

  menuAnchor: {
    padding: 6,
    borderRadius: 8,
  },

  // ── Chip ──
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
  },
  chipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
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
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    height: 14,
    marginHorizontal: 10,
  },

  // ── file name + created date row ──
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 11,
    fontWeight: "500",
    flexShrink: 1,
  },

  deliveryMode: {
    fontSize: 11,
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
    borderRadius: 8,
  },
  feedbackText: {
    fontSize: 13,
    fontWeight: "500",
  },

  // ── Download progress ──
  downloadRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  downloadHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  downloadLabel: {
    fontSize: 13,
    fontWeight: "600",
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    width: "100%",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },

  // ── Offline row ──
  offlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  offlineText: {
    fontSize: 13,
    fontWeight: "600",
  },
  offlineSub: {
    fontSize: 12,
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
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    textAlign: "center",
  },
  emptySub: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 4,
  },
  emptyBtn: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  emptyBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});