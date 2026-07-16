// import React, { useEffect, useMemo, useState } from "react";
// import {
//   FlatList,
//   StyleSheet,
//   View,
//   Alert,
//   Platform,
//   TextInput,
//   Pressable,
//   Share,
// } from "react-native";
// import ThemeView from "../../component/ThemeView";
// import ThemeText from "../../component/ThemeText";
// import { colors } from "../../constant/colors";
// import ThemeButton from "../../component/ThemeButton";
// import Spacer from "../../component/Spacer";
// import { useBook } from "../../hook/useBook";
// import { Ionicons } from "@expo/vector-icons";
// import * as FileSystem from "expo-file-system";

// import { useRouter } from "expo-router";
// import { Menu, Divider } from "react-native-paper";
// import { Linking } from "react-native";
// import InputTheme from "../../component/InputTheme";
// import RowItemsTheme from "../../component/RowItemsTheme";
// import CardTheme from "../../component/CardTheme";
// import { useUser } from "../../hook/useUser";
// import { ActivityIndicator } from "react-native";
// import { Link } from "expo-router";

// import {
//   saveBookOffline,
//   getOfflineBooks,
// } from "../../utils/offlinebookServices/offlineBookService";
// import { useRewardAdsEnabled } from "../../hook/useRewardAdsEnabled";
// // 1. Import your newly fixed Ad Hooks and Ad Modal
// import { useAdGate, RewardedAdModal, BannerAdComponent } from "../../component/AdsManager"; // <-- Update this path matching your project structure

// export default function Book() {
//   // ─────────────────────────────────────────────
//   // ALL HOOKS MUST BE DECLARED UNCONDITIONALLY, BEFORE ANY EARLY RETURN.
//   // This is the root cause of the "Rendered fewer hooks than expected" error:
//   // previously, `if (!authReady) return ...` and `if (!user) return ...`
//   // sat ABOVE the useMemo below, so on some renders useMemo never ran,
//   // changing the hook count between renders. Fixed by moving every hook
//   // to the top and doing all conditional returns afterward.
//   // ─────────────────────────────────────────────
//   const { books, fetchBooks, deleteBook } = useBook();
//   const { user, authReady, logOut } = useUser();

//   const router = useRouter();
//   const [bookLoading, setBookLoading] = useState(false);
//   const [selectedType, setSelectedType] = useState("All");
//   const [search, setSearch] = useState("");
//   const [savingOfflineId, setSavingOfflineId] = useState(null);
//   const [offlineMap, setOfflineMap] = useState({});
//   const [visibleMenuId, setVisibleMenuId] = useState(null);
//   const [refreshing, setRefreshing] = useState(false);

//   const openMenu = (id) => setVisibleMenuId(id);
//   const closeMenu = () => setVisibleMenuId(null);

//   // 2. Initialize the Ad Gate hook
//   const { gate, modalProps } = useAdGate();
//   const rewardAdsEnabled = useRewardAdsEnabled();

//   useEffect(() => {
//     const loadOffline = async () => {
//       try {
//         const books = await getOfflineBooks();
//         const map = {};
//         books.forEach((book) => {
//           map[book._id] = {
//             saved: true,
//             localUri: book.offlineUri,
//             downloadedAt: book.savedOfflineAt,
//           };
//         });
//         setOfflineMap(map);
//       } catch (e) {
//         console.log("offline load error", e);
//       }
//     };
//     loadOffline();
//   }, []);

//   useEffect(() => {
//     const loadBooks = async () => {
//       try {
//         if (!authReady) return;
//         setBookLoading(true);
//         await fetchBooks();
//       } catch (error) {
//         console.log("Error loading books:", error);
//       } finally {
//         setBookLoading(false);
//       }
//     };
//     loadBooks();
//   }, [authReady]);

//   const filteredBooks = useMemo(() => {
//     return books.filter((item) => {
//       if (selectedType === "link" && !item.fileLink) return false;
//       if (selectedType === "doc" && !item.fileUrl) return false;

//       const q = search.toLowerCase();
//       const formateDate = item.createdAt
//         ? new Date(item.createdAt).toLocaleString().toLowerCase()
//         : "";
//       return (
//         item.title?.toLowerCase().includes(q) ||
//         item.author?.toLowerCase().includes(q) ||
//         item.description?.toLowerCase().includes(q) ||
//         (item.fileLink && item.fileLink.toLowerCase().includes(q)) ||
//         (item.fileUrl && item.fileUrl.toLowerCase().includes(q)) ||
//         (formateDate && formateDate.includes(q))
//       );
//     });
//   }, [books, selectedType, search]);

//   // Cooldown setting: 3 minutes (180,000 milliseconds)
//   const AD_COOLDOWN_MS = 180000;

//   // ─────────────────────────────────────────────
//   // EARLY RETURNS — safe now, since every hook above has already run
//   // on every render, in the same order, regardless of these conditions.
//   // ─────────────────────────────────────────────
//   if (!authReady) {
//     return (
//       <ThemeView style={styles.centered}>
//         <ActivityIndicator
//           size={20}
//           color="#4f46e5"
//           style={{ flex: 1, alignItems: "center" }}
//         />
//       </ThemeView>
//     );
//   }

//   if (!user) {
//     return (
//       <ThemeView style={styles.centered}>
//         <Ionicons name="person-circle-outline" size={64} color="#999" />
//         <Spacer />
//         <ThemeText>No user logged in</ThemeText>
//         <Spacer />
//         <Link href="/login">
//           <ThemeText style={styles.link}>Go to Login</ThemeText>
//         </Link>
//       </ThemeView>
//     );
//   }

//   if (bookLoading) {
//     return (
//       <ThemeView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <ActivityIndicator size="large" color={colors.primary} />
//         <ThemeText style={{ marginTop: 10 }}>Loading books...</ThemeText>
//       </ThemeView>
//     );
//   }

//   // ─────────────────────────────────────────────
//   // REGULAR FUNCTIONS (not hooks) — fine to keep below returns
//   // ─────────────────────────────────────────────
//   const handleRefresh = async () => {
//     try {
//       setRefreshing(true);
//       await fetchBooks();
//       const offlineBooks = await getOfflineBooks();
//       const map = {};
//       offlineBooks.forEach((book) => {
//         map[book._id] = {
//           saved: true,
//           localUri: book.offlineUri,
//           downloadedAt: book.savedOfflineAt,
//         };
//       });
//       setOfflineMap(map);
//     } catch (error) {
//       console.log("Refresh error:", error);
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   const openFile = async (book) => {
//     try {
//       console.log("BOOK:", book);

//       if (book.fileType === "link") {
//         const url = book.fileUrl || book.fileLink;

//         if (!url) {
//           return Alert.alert("Error", "No link available");
//         }

//         const supported = await Linking.canOpenURL(url);

//         if (!supported) {
//           return Alert.alert("Error", "Cannot open this link");
//         }

//         await Linking.openURL(url);
//         return;
//       }

//       if (book.fileType === "file") {
//         if (!book.fileUrl) {
//           return Alert.alert("Error", "No file available");
//         }

//         console.log("Opening file URL:", book.fileUrl);

//         const cleanUrl = book.fileUrl.split("?")[0];

//         let filename = cleanUrl.split("/").pop();

//         if (!filename.endsWith(".pdf")) {
//           filename += ".pdf";
//         }

//         const localUri = FileSystem.documentDirectory + filename;

//         console.log("Downloading to:", localUri);

//         const downloadResult = await FileSystem.downloadAsync(
//           book.fileUrl,
//           localUri
//         );

//         console.log("Download result:", downloadResult);

//         const fileInfo = await FileSystem.getInfoAsync(downloadResult.uri);

//         console.log("File info:", fileInfo);

//         if (!fileInfo.exists || fileInfo.size < 1000) {
//           throw new Error("Invalid file");
//         }

//         router.push({
//           pathname: "/pdf-viewer",
//           params: {
//             url: downloadResult.uri,
//             title: book.title,
//           },
//         });

//         return;
//       }

//       Alert.alert("Error", "Unsupported content type");
//     } catch (error) {
//       console.log("OPEN ERROR:", error);
//       console.log("OPEN ERROR MESSAGE:", error?.message);

//       Alert.alert(
//         "Error",
//         `Failed to open content\n${error?.message || ""}`
//       );
//     }
//   };

//   const handleDelete = (bookId) => {
//     Alert.alert("Delete Book", "Are you sure?", [
//       { text: "Cancel", style: "cancel" },
//       { text: "Delete", style: "destructive", onPress: () => deleteBook(bookId) },
//     ]);
//   };

//   const handleShare = async (book) => {
//     try {
//       const shareUrl = book.fileUrl || book.fileLink;
//       if (!shareUrl) {
//         Alert.alert("Error", "No link available to share for this book.");
//         return;
//       }
//       if (book.fileType === "link") {
//         await Share.share({
//           message: ` ${book.title} \n${shareUrl}`,
//           url: shareUrl,
//           title: book.title,
//         });
//         return;
//       }
//       await Share.share({
//         message: `Download Now:🗂️ ${book.title} by ${book.author}\n${shareUrl}`,
//         url: shareUrl,
//         title: book.title,
//       });
//     } catch (error) {
//       Alert.alert("Error", error.message);
//     }
//   };

//   // 3. Core Offline Save Execution Function
//   const executeSaveOffline = async (book) => {
//     try {
//       if (!book?._id) return;
//       setSavingOfflineId(book._id);

//       const localUri = await saveBookOffline(book);

//       setOfflineMap((prev) => ({
//         ...prev,
//         [book._id]: {
//           saved: true,
//           localUri,
//           downloadedAt: Date.now(),
//         },
//       }));

//       Alert.alert("✅ Saved", `"${book.title}" is now available offline.`);
//     } catch (err) {
//       console.log("handleSaveOffline error:", err);
//       Alert.alert("Error", "Failed to save book offline.");
//     } finally {
//       setSavingOfflineId(null);
//     }
//   };

//   // 4. Wrapped Save Offline Action via Ad Gate (Includes Smart Cooldown)
//   const handleSaveOffline = (book) => {
//     if (!rewardAdsEnabled) {
//       executeSaveOffline(book);
//       return;
//     }

//     gate(() => executeSaveOffline(book), {
//       cooldown: AD_COOLDOWN_MS,
//     });
//   };

//   // 5. Core Reminder Route Execution Function
//   const executeSetReminder = (book) => {
//     router.push({
//       pathname: "/createTimetable",
//       params: { book: JSON.stringify(book) },
//     });
//   };

//   // 6. Wrapped Reminder Action via Ad Gate (Shares the same Smart Cooldown tracking instance)
//   const handleSetReminder = (book) => {
//     if (!rewardAdsEnabled) {
//       executeSetReminder(book);
//       return;
//     }

//     gate(() => executeSetReminder(book), {
//       cooldown: AD_COOLDOWN_MS,
//     });
//   };

//   const handleUpdate = (book) => {
//     router.push({
//       pathname: "/updateBook",
//       params: { book: JSON.stringify(book) },
//     });
//   };

//   const renderItem = ({ item }) => {
//     const isLink = item.fileType === "link";
//     const isOffline = !!offlineMap[item._id]?.saved;
//     const isSaving = savingOfflineId === item._id;

//     return (
//       <CardTheme style={styles.card}>
//         <RowItemsTheme
//           style={{
//             justifyContent: "flex-end",
//             marginBottom: 8,
//             marginHorizontal: 12,
//           }}
//         >
//           <Menu
//             visible={visibleMenuId === item._id}
//             onDismiss={closeMenu}
//             anchor={
//               <Pressable onPress={() => openMenu(item._id)}>
//                 <Ionicons name="ellipsis-vertical" size={22} color={colors.primary} />
//               </Pressable>
//             }
//           >
//             <Menu.Item
//               onPress={() => {
//                 closeMenu();
//                 handleShare(item);
//               }}
//               title="Share"
//               leadingIcon="share-variant"
//             />

//             <Menu.Item
//               onPress={() => {
//                 closeMenu();
//                 handleUpdate(item);
//               }}
//               title="Update"
//               leadingIcon="pencil"
//             />

//             <Divider />

//             <Menu.Item
//               onPress={() => {
//                 closeMenu();
//                 handleSetReminder(item); // Runs through the ad-gate hook checks
//               }}
//               title="Set Reminder"
//               leadingIcon="calendar-outline"
//             />

//             <Menu.Item
//               onPress={() => {
//                 closeMenu();
//                 handleDelete(item._id);
//               }}
//               title="Delete"
//               leadingIcon="delete"
//               titleStyle={{ color: "red" }}
//             />
//           </Menu>
//         </RowItemsTheme>

//         <ThemeText style={styles.title}>Title: {item.title}</ThemeText>
//         <ThemeText style={styles.author}>
//           {item.author ? `Author: ${item.author}` : "No author specified"}
//         </ThemeText>
//         <ThemeText style={styles.desc}>Description: {item.description || "No description"}</ThemeText>
//         <ThemeText style={{ fontSize: 10, marginTop: 4, fontStyle: "italic" }}>
//           Date: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"}
//         </ThemeText>

//         <Spacer />

//         <RowItemsTheme style={styles.iconRow}>
//           <Pressable onPress={() => openFile(item)} style={styles.iconButton}>
//             <Ionicons name="book-outline" size={24} color={colors.primary} />
//             <ThemeText style={styles.iconText}>Open</ThemeText>
//           </Pressable>

//           <Spacer width={50} />

//           {!isLink && (
//             <Pressable
//               style={styles.iconButton}
//               onPress={() => handleSaveOffline(item)} // Runs through the ad-gate hook checks
//               disabled={isSaving}
//             >
//               {isSaving ? (
//                 <ActivityIndicator size="small" color={colors.primary} />
//               ) : isOffline ? (
//                 <>
//                   <Ionicons name="checkmark-circle" size={24} color="green" />
//                   <ThemeText style={styles.iconText}>Saved</ThemeText>
//                 </>
//               ) : (
//                 <>
//                   <Ionicons name="download-outline" size={24} color={colors.primary} />
//                   <ThemeText style={styles.iconText}>Save Offline</ThemeText>
//                 </>
//               )}
//             </Pressable>
//           )}
//         </RowItemsTheme>
//       </CardTheme>
//     );
//   };

//   return (
//     <ThemeView style={styles.container} safe={true}>
//       <ThemeText style={styles.heading}>My Library</ThemeText>

//       <View style={styles.searchContainer}>
//         <Ionicons name="search" size={20} color="#888" />
//         <InputTheme
//           placeholder="Search by title, author, Date, link, or description"
//           placeholderTextColor="#888"
//           style={styles.searchInput}
//           value={search}
//           onChangeText={setSearch}
//         />
//       </View>

//       <RowItemsTheme style={styles.row}>
//         <ThemeButton
//           onPress={() => setSelectedType("All")}
//           style={[styles.typeBtn, selectedType === "All" && styles.typeBtnActive]}
//         >
//           <View style={styles.btnContent}>
//             <Ionicons name="book-outline" size={16} color="#fff" />
//             <ThemeText style={styles.btnText}>All</ThemeText>
//           </View>
//         </ThemeButton>

//         <ThemeButton
//           onPress={() => setSelectedType("link")}
//           style={[styles.typeBtn, selectedType === "link" && styles.typeBtnActive]}
//         >
//           <View style={styles.btnContent}>
//             <Ionicons name="link-outline" size={16} color="#fff" />
//             <ThemeText style={styles.btnText}>File/Doc Link</ThemeText>
//           </View>
//         </ThemeButton>

//         <ThemeButton
//           onPress={() => setSelectedType("doc")}
//           style={[styles.typeBtn, selectedType === "doc" && styles.typeBtnActive]}
//         >
//           <View style={styles.btnContent}>
//             <Ionicons name="document-text-outline" size={16} color="#fff" />
//             <ThemeText style={styles.btnText}>Files/Docs</ThemeText>
//           </View>
//         </ThemeButton>
//       </RowItemsTheme>

//       <FlatList
//         data={filteredBooks}
//         keyExtractor={(item) => item._id}
//         renderItem={renderItem}
//         refreshing={refreshing}
//         onRefresh={handleRefresh}
//         ListEmptyComponent={
//           <ThemeText style={{ color: "#aaa", marginTop: 20 }}>No items found</ThemeText>
//         }
//       />
//       <BannerAdComponent style={styles.bottomBanner} />

//       {/* 7. Render the Rewarded Ad Modal interface onto the layout mount tree */}
//       {rewardAdsEnabled && <RewardedAdModal {...modalProps} />}
//     </ThemeView>
//   );
// }

// // ─────────────────────────────────────────────
// // STYLES (Unchanged)
// // ─────────────────────────────────────────────
// const styles = StyleSheet.create({
//   container: { padding: 12 },
//   heading: { fontSize: 24, fontWeight: "bold", marginBottom: 10, marginVertical: 15, textAlign: "center" },
//   searchContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderRadius: 50,
//     borderWidth: 1,
//     paddingHorizontal: 15,
//     height: 50,
//     marginBottom: 12,
//     width: "80%",
//     alignSelf: "center",
//   },
//   link: {
//     color: "#4f46e5",
//     fontWeight: "500",
//   },
//   centered: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   searchInput: { flex: 1, marginLeft: 2 },
//   row: {
//     width: "90%",
//     marginVertical: 10,
//     marginHorizontal: 20,
//     marginTop: 20,
//     marginBottom: 30,
//   },
//   typeBtn: { flex: 1, paddingVertical: 10, backgroundColor: "#444", borderRadius: 8 },
//   typeBtnActive: { backgroundColor: colors.primary },
//   btnContent: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 3 },
//   btnText: { fontSize: 11, color: "#fff" },
//   card: { marginVertical: 6, marginHorizontal: 20 },
//   title: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
//   author: { fontSize: 12, marginBottom: 4 },
//   desc: { fontSize: 12 },
//   iconRow: { flexDirection: "row", marginTop: 10 },
//   iconButton: { flexDirection: "row", alignItems: "center", marginRight: 20 },
//   iconText: { marginLeft: 6, fontSize: 14, fontWeight: "600" },
//   bottomBanner: {
//     backgroundColor: "transparent",
//     paddingVertical: 4,
//     borderTopWidth: StyleSheet.hairlineWidth,
//     borderTopColor: "#333", // Subtle separator line
//   },
// });



import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  Alert,
  Platform,
  TextInput,
  Pressable,
  Share,
} from "react-native";
import ThemeView from "../../component/ThemeView";
import ThemeText from "../../component/ThemeText";
import { colors } from "../../constant/colors";
import ThemeButton from "../../component/ThemeButton";
import Spacer from "../../component/Spacer";
import { useBook } from "../../hook/useBook";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

import { useRouter } from "expo-router";
import { Menu, Divider } from "react-native-paper";
import { Linking } from "react-native";
import InputTheme from "../../component/InputTheme";
import RowItemsTheme from "../../component/RowItemsTheme";
import CardTheme from "../../component/CardTheme";
import { useUser } from "../../hook/useUser";
import { ActivityIndicator } from "react-native";
import { Link } from "expo-router";

import {
  saveBookOffline,
  getOfflineBooks,
} from "../../utils/offlinebookServices/offlineBookService";
import { useRewardAdsEnabled } from "../../hook/useRewardAdsEnabled";
import { useAdGate, RewardedAdModal, BannerAdComponent } from "../../component/AdsManager"; // <-- Update this path matching your project structure

export default function Book() {
  // ─────────────────────────────────────────────
  // ALL HOOKS MUST BE DECLARED UNCONDITIONALLY, BEFORE ANY EARLY RETURN.
  // ─────────────────────────────────────────────
  const { books, fetchBooks, deleteBook } = useBook();
  const { user, authReady, logOut } = useUser();

  const router = useRouter();
  const [bookLoading, setBookLoading] = useState(false);
  const [selectedType, setSelectedType] = useState("All");
  const [search, setSearch] = useState("");
  const [savingOfflineId, setSavingOfflineId] = useState(null);
  const [sharingId, setSharingId] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  // ── NEW: tracks live 0–100 progress per book so the UI can show a real bar ──
  const [downloadProgress, setDownloadProgress] = useState({});
  const [offlineMap, setOfflineMap] = useState({});
  const [visibleMenuId, setVisibleMenuId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const openMenu = (id) => setVisibleMenuId(id);
  const closeMenu = () => setVisibleMenuId(null);

  const { gate, modalProps } = useAdGate();
  const rewardAdsEnabled = useRewardAdsEnabled();

  useEffect(() => {
    const loadOffline = async () => {
      try {
        const books = await getOfflineBooks();
        const map = {};
        books.forEach((book) => {
          map[book._id] = {
            saved: true,
            localUri: book.offlineUri,
            downloadedAt: book.savedOfflineAt,
          };
        });
        setOfflineMap(map);
      } catch (e) {
        console.log("offline load error", e);
      }
    };
    loadOffline();
  }, []);

  useEffect(() => {
    const loadBooks = async () => {
      try {
        if (!authReady) return;
        setBookLoading(true);
        await fetchBooks();
      } catch (error) {
        console.log("Error loading books:", error);
      } finally {
        setBookLoading(false);
      }
    };
    loadBooks();
  }, [authReady]);

  // ─────────────────────────────────────────────
  // FIX: filter on item.fileType, not on which URL field happens to be
  // populated. Link-type books store their URL in `fileUrl` too (see
  // openFile below), so checking `!item.fileLink` always filtered
  // everything out of the "link" tab.
  // ─────────────────────────────────────────────
  const filteredBooks = useMemo(() => {
    return books.filter((item) => {
      if (selectedType === "link" && item.fileType !== "link") return false;
      if (selectedType === "doc" && item.fileType !== "file") return false;

      const q = search.toLowerCase();
      const formateDate = item.createdAt
        ? new Date(item.createdAt).toLocaleString().toLowerCase()
        : "";
      return (
        item.title?.toLowerCase().includes(q) ||
        item.author?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        (item.fileLink && item.fileLink.toLowerCase().includes(q)) ||
        (item.fileUrl && item.fileUrl.toLowerCase().includes(q)) ||
        (formateDate && formateDate.includes(q))
      );
    });
  }, [books, selectedType, search]);

  // Cooldown setting: 3 minutes (180,000 milliseconds)
  const AD_COOLDOWN_MS = 180000;

  // ─────────────────────────────────────────────
  // EARLY RETURNS
  // ─────────────────────────────────────────────
  if (!authReady) {
    return (
      <ThemeView style={styles.centered}>
        <ActivityIndicator
          size={20}
          color="#4f46e5"
          style={{ flex: 1, alignItems: "center" }}
        />
      </ThemeView>
    );
  }

  if (!user) {
    return (
      <ThemeView style={styles.centered}>
        <Ionicons name="person-circle-outline" size={64} color="#999" />
        <Spacer />
        <ThemeText>No user logged in</ThemeText>
        <Spacer />
        <Link href="/login">
          <ThemeText style={styles.link}>Go to Login</ThemeText>
        </Link>
      </ThemeView>
    );
  }

  if (bookLoading) {
    return (
      <ThemeView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <ThemeText style={{ marginTop: 10 }}>Loading books...</ThemeText>
      </ThemeView>
    );
  }

  // ─────────────────────────────────────────────
  // REGULAR FUNCTIONS
  // ─────────────────────────────────────────────
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchBooks();
      const offlineBooks = await getOfflineBooks();
      const map = {};
      offlineBooks.forEach((book) => {
        map[book._id] = {
          saved: true,
          localUri: book.offlineUri,
          downloadedAt: book.savedOfflineAt,
        };
      });
      setOfflineMap(map);
    } catch (error) {
      console.log("Refresh error:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const openFile = async (book) => {
    try {
      console.log("BOOK:", book);

      if (book.fileType === "link") {
        const url = book.fileUrl || book.fileLink;

        if (!url) {
          return Alert.alert("Error", "No link available");
        }

        const supported = await Linking.canOpenURL(url);

        if (!supported) {
          return Alert.alert("Error", "Cannot open this link");
        }

        await Linking.openURL(url);
        return;
      }

      if (book.fileType === "file") {
        if (!book.fileUrl) {
          return Alert.alert("Error", "No file available");
        }

        console.log("Opening file URL:", book.fileUrl);

        const cleanUrl = book.fileUrl.split("?")[0];

        let filename = cleanUrl.split("/").pop();

        if (!filename.endsWith(".pdf")) {
          filename += ".pdf";
        }

        const localUri = FileSystem.documentDirectory + filename;

        console.log("Downloading to:", localUri);

        const downloadResult = await FileSystem.downloadAsync(
          book.fileUrl,
          localUri
        );

        console.log("Download result:", downloadResult);

        const fileInfo = await FileSystem.getInfoAsync(downloadResult.uri);

        console.log("File info:", fileInfo);

        if (!fileInfo.exists || fileInfo.size < 1000) {
          throw new Error("Invalid file");
        }

        router.push({
          pathname: "/pdf-viewer",
          params: {
            url: downloadResult.uri,
            title: book.title,
          },
        });

        return;
      }

      Alert.alert("Error", "Unsupported content type");
    } catch (error) {
      console.log("OPEN ERROR:", error);
      console.log("OPEN ERROR MESSAGE:", error?.message);

      Alert.alert(
        "Error",
        `Failed to open content\n${error?.message || ""}`
      );
    }
  };

  const handleDelete = (bookId) => {
    Alert.alert("Delete Book", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteBook(bookId) },
    ]);
  };

  // ─────────────────────────────────────────────
  // Helper: get (or create) a local COPY of a file-type book in the
  // app's cache, used only for sharing (attaching bytes to the share
  // sheet). Reuses the offline copy if one already exists.
  // ─────────────────────────────────────────────
  const getLocalFileUri = async (book) => {
    const existing = offlineMap[book._id];
    if (existing?.localUri) {
      const info = await FileSystem.getInfoAsync(existing.localUri);
      if (info.exists) return existing.localUri;
    }

    const cleanUrl = book.fileUrl.split("?")[0];
    let filename = cleanUrl.split("/").pop();
    if (!filename.includes(".")) filename += ".pdf";

    const localUri = FileSystem.cacheDirectory + filename;

    const downloadResult = await FileSystem.downloadAsync(book.fileUrl, localUri);
    const fileInfo = await FileSystem.getInfoAsync(downloadResult.uri);

    if (!fileInfo.exists || fileInfo.size < 1000) {
      throw new Error("Downloaded file looks invalid");
    }

    return downloadResult.uri;
  };

  // ─────────────────────────────────────────────
  // Share the ACTUAL file (native share sheet with the file attached)
  // for file-type books. Link-type books have nothing to attach, so
  // they still share the URL as a text message.
  // ─────────────────────────────────────────────
  const handleShare = async (book) => {
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

      setSharingId(book._id);

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
  };

  // Core Offline Save Execution Function
  const executeSaveOffline = async (book) => {
    try {
      if (!book?._id) return;
      setSavingOfflineId(book._id);

      const localUri = await saveBookOffline(book);

      setOfflineMap((prev) => ({
        ...prev,
        [book._id]: {
          saved: true,
          localUri,
          downloadedAt: Date.now(),
        },
      }));

      Alert.alert("✅ Saved", `"${book.title}" is now available offline.`);
    } catch (err) {
      console.log("handleSaveOffline error:", err);
      Alert.alert("Error", "Failed to save book offline.");
    } finally {
      setSavingOfflineId(null);
    }
  };

  const handleSaveOffline = (book) => {
    if (!rewardAdsEnabled) {
      executeSaveOffline(book);
      return;
    }

    gate(() => executeSaveOffline(book), {
      cooldown: AD_COOLDOWN_MS,
    });
  };

  // ─────────────────────────────────────────────
  // Get (and cache) permission to write into a real, user-visible
  // folder on Android — e.g. Downloads. The user picks the folder once
  // via the system directory picker; we remember the resulting SAF URI
  // so future downloads don't prompt again unless permission is lost.
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
    if (!permission.granted) {
      return null;
    }

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
  // NOW uses createDownloadResumable so we get live byte-level progress
  // callbacks, turned into a 0–100 percent shown on the card and in the
  // menu item label.
  //
  // Android: downloads to cache first (with progress), then copies the
  //          bytes into a folder the user picked via SAF (e.g. Downloads).
  // iOS: downloads with progress straight into the app's Documents dir.
  // ─────────────────────────────────────────────
  const executeDownloadFile = async (book) => {
    try {
      if (!book.fileUrl) {
        Alert.alert("Error", "No file available to download.");
        return;
      }

      setDownloadingId(book._id);
      setDownloadProgress((prev) => ({ ...prev, [book._id]: 0 }));

      const cleanUrl = book.fileUrl.split("?")[0];
      let filename = cleanUrl.split("/").pop();
      if (!filename.includes(".")) filename += ".pdf";

      const onProgress = (progressEvent) => {
        const { totalBytesWritten, totalBytesExpectedToWrite } = progressEvent;
        if (!totalBytesExpectedToWrite) return;
        const percent = Math.round(
          (totalBytesWritten / totalBytesExpectedToWrite) * 100
        );
        setDownloadProgress((prev) => ({ ...prev, [book._id]: percent }));
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
        setDownloadProgress((prev) => ({ ...prev, [book._id]: 100 }));

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

        // Clean up the temp cache copy
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
        delete next[book._id];
        return next;
      });
    }
  };

  const handleDownloadFile = (book) => {
    if (!rewardAdsEnabled) {
      executeDownloadFile(book);
      return;
    }

    gate(() => executeDownloadFile(book), {
      cooldown: AD_COOLDOWN_MS,
    });
  };

  const executeSetReminder = (book) => {
    router.push({
      pathname: "/createTimetable",
      params: { book: JSON.stringify(book) },
    });
  };

  const handleSetReminder = (book) => {
    if (!rewardAdsEnabled) {
      executeSetReminder(book);
      return;
    }

    gate(() => executeSetReminder(book), {
      cooldown: AD_COOLDOWN_MS,
    });
  };

  const handleUpdate = (book) => {
    router.push({
      pathname: "/updateBook",
      params: { book: JSON.stringify(book) },
    });
  };

  const renderItem = ({ item }) => {
    const isLink = item.fileType === "link";
    const isOffline = !!offlineMap[item._id]?.saved;
    const isSaving = savingOfflineId === item._id;
    const isSharing = sharingId === item._id;
    const isDownloading = downloadingId === item._id;
    const progress = downloadProgress[item._id] ?? 0;

    return (
      <CardTheme style={styles.card}>
        <RowItemsTheme
          style={{
            justifyContent: "flex-end",
            marginBottom: 8,
            marginHorizontal: 12,
          }}
        >
          <Menu
            visible={visibleMenuId === item._id}
            onDismiss={closeMenu}
            anchor={
              <Pressable onPress={() => openMenu(item._id)}>
                <Ionicons name="ellipsis-vertical" size={22} color={colors.primary} />
              </Pressable>
            }
          >
            <Menu.Item
              onPress={() => {
                closeMenu();
                handleShare(item);
              }}
              title={isSharing ? "Preparing…" : "Share"}
              leadingIcon="share-variant"
              disabled={isSharing}
            />

            {!isLink && (
              <Menu.Item
                onPress={() => {
                  closeMenu();
                  handleDownloadFile(item);
                }}
                title={isDownloading ? `Downloading… ${progress}%` : "Download"}
                leadingIcon="download"
                disabled={isDownloading}
              />
            )}

            <Menu.Item
              onPress={() => {
                closeMenu();
                handleUpdate(item);
              }}
              title="Update"
              leadingIcon="pencil"
            />

            <Divider />

            <Menu.Item
              onPress={() => {
                closeMenu();
                handleSetReminder(item);
              }}
              title="Set Reminder"
              leadingIcon="calendar-outline"
            />

            <Menu.Item
              onPress={() => {
                closeMenu();
                handleDelete(item._id);
              }}
              title="Delete"
              leadingIcon="delete"
              titleStyle={{ color: "red" }}
            />
          </Menu>
        </RowItemsTheme>

        <ThemeText style={styles.title}>Title: {item.title}</ThemeText>
        <ThemeText style={styles.author}>
          {item.author ? `Author: ${item.author}` : "No author specified"}
        </ThemeText>
        <ThemeText style={styles.desc}>Description: {item.description || "No description"}</ThemeText>
        <ThemeText style={{ fontSize: 10, marginTop: 4, fontStyle: "italic" }}>
          Date: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"}
        </ThemeText>

        <Spacer />

        <RowItemsTheme style={styles.iconRow}>
          <Pressable onPress={() => openFile(item)} style={styles.iconButton}>
            <Ionicons name="book-outline" size={24} color={colors.primary} />
            <ThemeText style={styles.iconText}>Open</ThemeText>
          </Pressable>

          <Spacer width={50} />

          {!isLink && (
            <Pressable
              style={styles.iconButton}
              onPress={() => handleSaveOffline(item)}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : isOffline ? (
                <>
                  <Ionicons name="checkmark-circle" size={24} color="green" />
                  <ThemeText style={styles.iconText}>Saved</ThemeText>
                </>
              ) : (
                <>
                  <Ionicons name="download-outline" size={24} color={colors.primary} />
                  <ThemeText style={styles.iconText}>Save Offline</ThemeText>
                </>
              )}
            </Pressable>
          )}
        </RowItemsTheme>

        {/* ── NEW: Download progress bar ── */}
        {isDownloading && (
          <View style={styles.downloadRow}>
            <View style={styles.downloadHeader}>
              <ThemeText style={styles.downloadLabel}>
                Downloading… {progress}%
              </ThemeText>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progress}%` },
                ]}
              />
            </View>
          </View>
        )}
      </CardTheme>
    );
  };

  return (
    <ThemeView style={styles.container} safe={true}>
      <ThemeText style={styles.heading}>My Library</ThemeText>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" />
        <InputTheme
          placeholder="Search by title, author, Date, link, or description"
          placeholderTextColor="#888"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <RowItemsTheme style={styles.row}>
        <ThemeButton
          onPress={() => setSelectedType("All")}
          style={[styles.typeBtn, selectedType === "All" && styles.typeBtnActive]}
        >
          <View style={styles.btnContent}>
            <Ionicons name="book-outline" size={16} color="#fff" />
            <ThemeText style={styles.btnText}>All</ThemeText>
          </View>
        </ThemeButton>

        <ThemeButton
          onPress={() => setSelectedType("link")}
          style={[styles.typeBtn, selectedType === "link" && styles.typeBtnActive]}
        >
          <View style={styles.btnContent}>
            <Ionicons name="link-outline" size={16} color="#fff" />
            <ThemeText style={styles.btnText}>File/Doc Link</ThemeText>
          </View>
        </ThemeButton>

        <ThemeButton
          onPress={() => setSelectedType("doc")}
          style={[styles.typeBtn, selectedType === "doc" && styles.typeBtnActive]}
        >
          <View style={styles.btnContent}>
            <Ionicons name="document-text-outline" size={16} color="#fff" />
            <ThemeText style={styles.btnText}>Files/Docs</ThemeText>
          </View>
        </ThemeButton>
      </RowItemsTheme>

      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <ThemeText style={{ color: "#aaa", marginTop: 20 }}>No items found</ThemeText>
        }
      />
      <BannerAdComponent style={styles.bottomBanner} />

      {rewardAdsEnabled && <RewardedAdModal {...modalProps} />}
    </ThemeView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12 },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 10, marginVertical: 15, textAlign: "center" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 50,
    borderWidth: 1,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 12,
    width: "80%",
    alignSelf: "center",
  },
  link: {
    color: "#4f46e5",
    fontWeight: "500",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  searchInput: { flex: 1, marginLeft: 2 },
  row: {
    width: "90%",
    marginVertical: 10,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
  },
  typeBtn: { flex: 1, paddingVertical: 10, backgroundColor: "#444", borderRadius: 8 },
  typeBtnActive: { backgroundColor: colors.primary },
  btnContent: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 3 },
  btnText: { fontSize: 11, color: "#fff" },
  card: { marginVertical: 6, marginHorizontal: 20 },
  title: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  author: { fontSize: 12, marginBottom: 4 },
  desc: { fontSize: 12 },
  iconRow: { flexDirection: "row", marginTop: 10 },
  iconButton: { flexDirection: "row", alignItems: "center", marginRight: 20 },
  iconText: { marginLeft: 6, fontSize: 14, fontWeight: "600" },
  bottomBanner: {
    backgroundColor: "transparent",
    paddingVertical: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#333",
  },

  // ── NEW: Download progress ──
  downloadRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#eee",
  },
  downloadHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  downloadLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primary,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    width: "100%",
    backgroundColor: "#e5e7eb",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
});