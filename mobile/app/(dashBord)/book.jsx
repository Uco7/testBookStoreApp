// import React, { useEffect } from "react";
// import {
//   FlatList,
//   StyleSheet,
//   View,
//   Alert,
//   Platform,
//   TextInput,
//   Pressable,
// } from "react-native";
// import ThemeView from "../../component/ThemeView";
// import ThemeText from "../../component/ThemeText";
// import { colors } from "../../constant/colors";
// import ThemeButton from "../../component/ThemeButton";
// import Spacer from "../../component/Spacer";
// import { useBook } from "../../hook/useBook";
// import { Ionicons } from "@expo/vector-icons";
// import * as FileSystem from "expo-file-system/legacy";
// import * as Sharing from "expo-sharing";
// import * as Linking from "expo-linking";
// import * as IntentLauncher from "expo-intent-launcher";
// import { useRouter } from "expo-router";

// export default function Book() {
//   const { books, fetchBooks, deleteBook } = useBook();
//   const router = useRouter();

//   useEffect(() => {
//     fetchBooks();
//   }, []);

//   const getMimeType = (filename) => {
//     const ext = filename.split(".").pop().toLowerCase();
//     switch (ext) {
//       case "pdf": return "application/pdf";
//       case "doc": return "application/msword";
//       case "docx": return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
//       case "xls": return "application/vnd.ms-excel";
//       case "xlsx": return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
//       case "ppt": return "application/vnd.ms-powerpoint";
//       case "pptx": return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
//       case "txt": return "text/plain";
//       default: return "*/*";
//     }
//   };

//   const openFile = async (book) => {
//     try {
//       if (book.fileLink) { await Linking.openURL(book.fileLink); return; }
//       if (!book.fileUrl) { Alert.alert("No file", "This book has no file"); return; }

//       const filename = book.fileUrl.split("/").pop();
//       const localUri = FileSystem.documentDirectory + filename;

//       const fileInfo = await FileSystem.getInfoAsync(localUri);
//       if (!fileInfo.exists) await FileSystem.downloadAsync(book.fileUrl, localUri);

//       if (book.originalFormat === "pdf") {
//         router.push({ pathname: "/book/pdf-viewer", params: { url: localUri, title: book.title } });
//         return;
//       }

//       if (Platform.OS === "android") {
//         const contentUri = await FileSystem.getContentUriAsync(localUri);
//         await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
//           data: contentUri,
//           flags: 1,
//           type: getMimeType(filename),
//         });
//       } else {
//         await Sharing.shareAsync(localUri);
//       }
//     } catch {
//       Alert.alert("Cannot open file", "No compatible app found.");
//     }
//   };

//   const handleDelete = (bookId) => {
//     Alert.alert("Delete Book", "Are you sure?", [
//       { text: "Cancel", style: "cancel" },
//       { text: "Delete", style: "destructive", onPress: () => deleteBook(bookId) },
//     ]);
//   };

//   const handleUpdate = (book) => {
//     router.push({ pathname: "/updateBook", params: { book: JSON.stringify(book) } });
//   };

//   const renderItem = ({ item }) => (
//     <View style={styles.card}>
//       <ThemeText style={styles.title}>Title: {item.title}</ThemeText>
//       <ThemeText style={styles.author}>Author: {item.author}</ThemeText>
//       <ThemeText style={styles.desc}>Description: {item.description || "No description"}</ThemeText>

//       <Spacer />

//       <View style={styles.iconRow}>
//         <Pressable onPress={() => openFile(item)} style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
//           <Ionicons name="book-outline" size={24} color={colors.primary}/>
//           <ThemeText style={styles.iconText}>Open</ThemeText>
//         </Pressable>

//         <Pressable onPress={() => handleUpdate(item)} style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
//           <Ionicons name="create-outline" size={24} color={colors.primary} />
//           {/* <Ionicons name="create-outline" size={24} color="#00E5FF" /> */}
//           <ThemeText style={styles.iconText}>Update</ThemeText>
//         </Pressable>

//         <Pressable onPress={() => handleDelete(item._id)} style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}>
//           <Ionicons name="trash-outline" size={24} color="#FF4B5C" />
//           <ThemeText style={styles.iconText}>Delete</ThemeText>
//         </Pressable>
//       </View>
//     </View>
//   );

//   return (
//     <ThemeView style={styles.container}>
//       <ThemeText style={styles.heading}>My Library</ThemeText>

//       <View style={styles.searchContainer}>
//         <Ionicons name="search" size={20} color="#888" />
//         <TextInput placeholder="Search..." placeholderTextColor="#888" style={styles.searchInput} />
//       </View>
//        <View style={styles.row}>
//           <ThemeButton
//             onPress={() => setSelectedType("reading")}
//             style={[styles.typeBtn,  selectedType === "All" && styles.typeBtnActive]}
//           >
//             <View style={styles.btnContent}>
//               <Ionicons name="book-outline" size={16} color="#fff" />
//               <ThemeText style={styles.btnText}>All</ThemeText>
//             </View>
//           </ThemeButton>

//           <ThemeButton
//             onPress={() => setSelectedType("link")}
//             style={[styles.typeBtn, selectedType === "link" && styles.typeBtnActive]}
//           >
//             <View style={styles.btnContent}>
//               <Ionicons name="link-outline" size={16} color="#fff" />
//               <ThemeText style={styles.btnText}>File/Doc Link</ThemeText>
//             </View>
//           </ThemeButton>

//           <ThemeButton
//             onPress={() => setSelectedType("doc")}
//             style={[styles.typeBtn, selectedType === "doc" && styles.typeBtnActive]}
//           >
//             <View style={styles.btnContent}>
//               <Ionicons name="document-text-outline" size={16} color="#fff" />
//               <ThemeText style={styles.btnText}>Doc</ThemeText>
//             </View>
//           </ThemeButton>
//         </View>


//       <FlatList
//         data={books}
//         keyExtractor={(item) => item._id}
//         renderItem={renderItem}
//         ListEmptyComponent={<ThemeText style={{ color: "#aaa", marginTop: 20 }}>No books available</ThemeText>}
//       />
//     </ThemeView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {  padding: 12 },
//   heading: { fontSize: 24, fontWeight: "bold", color: "white", marginBottom: 12 },

//   searchContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor:  colors.uiBackground,
//     borderRadius: 50,
//     borderWidth: 1,
//     borderColor: "#7d7575ff",
//     paddingHorizontal: 15,
//     height: 50,
//     marginBottom: 12,
    
//   },
//   searchInput: { 
//     flex: 1,
//     color: "white",
//     marginLeft: 10 },
    

//   card: {
//     backgroundColor: colors.uiBackground,
//     borderRadius: 12,
//     padding: 12,
//     marginVertical: 6,
//     borderWidth: 1,
//     borderColor: "#222",
//   },
//   title: { color: "white", fontWeight: "bold", fontSize: 16, marginBottom: 4 },
//   author: { color: "#aaa", fontSize: 12, marginBottom: 4 },
//   desc: { color: "#ccc", fontSize: 12 },

//   iconRow: { flexDirection: "row", marginTop: 10 },
//   iconButton: { flexDirection: "row", alignItems: "center", marginRight: 20 },
//   iconText: { marginLeft: 6, color: "white" },
//   pressed: { opacity: 0.6, transform: [{ scale: 0.97 }] },
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
} from "react-native";
import ThemeView from "../../component/ThemeView";
import ThemeText from "../../component/ThemeText";
import { colors } from "../../constant/colors";
import ThemeButton from "../../component/ThemeButton";
import Spacer from "../../component/Spacer";
import { useBook } from "../../hook/useBook";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as Linking from "expo-linking";
import * as IntentLauncher from "expo-intent-launcher";
import { useRouter } from "expo-router";

export default function Book() {
  const { books, fetchBooks, deleteBook } = useBook();
  const router = useRouter();

  const [selectedType, setSelectedType] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  const getMimeType = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    switch (ext) {
      case "pdf": return "application/pdf";
      case "doc": return "application/msword";
      case "docx": return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      case "xls": return "application/vnd.ms-excel";
      case "xlsx": return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      case "ppt": return "application/vnd.ms-powerpoint";
      case "pptx": return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
      case "txt": return "text/plain";
      default: return "*/*";
    }
  };

  const openFile = async (book) => {
    try {
      if (book.fileLink) {
        await Linking.openURL(book.fileLink);
        return;
      }

      if (!book.fileUrl) {
        Alert.alert("No file", "This book has no file");
        return;
      }

      const filename = book.fileUrl.split("/").pop();
      const localUri = FileSystem.documentDirectory + filename;

      const fileInfo = await FileSystem.getInfoAsync(localUri);
      if (!fileInfo.exists) {
        await FileSystem.downloadAsync(book.fileUrl, localUri);
      }

      if (book.originalFormat === "pdf") {
        router.push({
          pathname: "/book/pdf-viewer",
          params: { url: localUri, title: book.title },
        });
        return;
      }

      if (Platform.OS === "android") {
        const contentUri = await FileSystem.getContentUriAsync(localUri);
        await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
          data: contentUri,
          flags: 1,
          type: getMimeType(filename),
        });
      } else {
        await Sharing.shareAsync(localUri);
      }
    } catch {
      Alert.alert("Cannot open file", "No compatible app found.");
    }
  };

  const handleDelete = (bookId) => {
    Alert.alert("Delete Book", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteBook(bookId) },
    ]);
  };

  const handleUpdate = (book) => {
    router.push({
      pathname: "/updateBook",
      params: { book: JSON.stringify(book) },
    });
  };

  const filteredBooks = useMemo(() => {
    return books.filter((item) => {
      if (selectedType === "link" && !item.fileLink) return false;
      if (selectedType === "doc" && !item.fileUrl) return false;

      const q = search.toLowerCase();
      return (
        item.title?.toLowerCase().includes(q) ||
        item.author?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q)
      );
    });
  }, [books, selectedType, search]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <ThemeText style={styles.title}>Title: {item.title}</ThemeText>
      <ThemeText style={styles.author}>Author: {item.author}</ThemeText>
      <ThemeText style={styles.desc}>
        Description: {item.description || "No description"}
      </ThemeText>

      <Spacer />

      <View style={styles.iconRow}>
        <Pressable onPress={() => openFile(item)} style={styles.iconButton}>
          <Ionicons name="book-outline" size={24} color={colors.primary} />
          <ThemeText style={styles.iconText}>Open</ThemeText>
        </Pressable>

        <Pressable onPress={() => handleUpdate(item)} style={styles.iconButton}>
          <Ionicons name="create-outline" size={24} color={colors.primary} />
          <ThemeText style={styles.iconText}>Update</ThemeText>
        </Pressable>

        <Pressable onPress={() => handleDelete(item._id)} style={styles.iconButton}>
          <Ionicons name="trash-outline" size={24} color="#FF4B5C" />
          <ThemeText style={styles.iconText}>Delete</ThemeText>
        </Pressable>
      </View>
    </View>
  );

  return (
    <ThemeView style={styles.container}>
      <ThemeText style={styles.heading}>My Library</ThemeText>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" />
        <TextInput
          placeholder="Search..."
          placeholderTextColor="#888"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.row}>
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
            <ThemeText style={styles.btnText}>Doc</ThemeText>
          </View>
        </ThemeButton>
      </View>

      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListEmptyComponent={
          <ThemeText style={{ color: "#aaa", marginTop: 20 }}>
            No items found
          </ThemeText>
        }
      />
    </ThemeView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12 },
  heading: { fontSize: 24, fontWeight: "bold", color: "white", marginBottom: 12 },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.uiBackground,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#7d7575ff",
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 12,
  },
  searchInput: { flex: 1, color: "white", marginLeft: 10 },

   row: {
    width: "90%",
    flexDirection: "row",
    gap: 10,
    // overflow: "hidden",
    // marginVertical: 10,
    marginHorizontal: 20,
    
    marginTop: 20,
    marginBottom: 30,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#444",
    borderRadius: 8,
  },
  typeBtnActive: {
    backgroundColor: colors.primary
  },
  btnContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  btnText: {
    fontSize: 10,
    color: "#fff",
  },

  card: {
    backgroundColor: colors.uiBackground,
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "#222",
  },
  title: { color: "white", fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  author: { color: "#aaa", fontSize: 12, marginBottom: 4 },
  desc: { color: "#ccc", fontSize: 12 },

  iconRow: { flexDirection: "row", marginTop: 10 },
  iconButton: { flexDirection: "row", alignItems: "center", marginRight: 20 },
  iconText: { marginLeft: 6, color: "white" },
});
