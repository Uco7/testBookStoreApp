

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
import * as FileSystem from "expo-file-system/legacy";
import { useRouter } from "expo-router";
import InputTheme from "../../component/InputTheme";
import RowItemsTheme from "../../component/RowItemsTheme";
import CardTheme from "../../component/CardTheme";
import { useUser } from "../../hook/useUser";
import { ActivityIndicator } from "react-native";

export default function Book() {
  const { books, fetchBooks, deleteBook, } = useBook();
  const {authReady}=useUser()
  const router = useRouter();

  const [selectedType, setSelectedType] = useState("All");
  const [search, setSearch] = useState("");
   if (!authReady) {
    return (
      <ThemeView style={styles.centered}>
        {/* <ThemeText>Loading...</ThemeText> */}
        <ActivityIndicator
        size={20}
        color="#4f46e5"
        />
      </ThemeView>
    );
  }

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
      if (!book.fileUrl) {
        Alert.alert("No file", "This book has no file");
        return;
      }

      console.log("Opening URL:", book.fileUrl);

      const filename = book.fileUrl.split("/").pop();
      console.log("Extracted filename:", filename);
      const localUri = FileSystem.documentDirectory + filename;
      console.log("Local URI for download:", localUri);

      const downloadResult = await FileSystem.downloadAsync(
        book.fileUrl,
        localUri
      );

      console.log("Download result:", downloadResult);

      const fileInfo = await FileSystem.getInfoAsync(downloadResult.uri);

      console.log("File info:", fileInfo);

      // 🔴 CRITICAL CHECK
      if (!fileInfo.exists || fileInfo.size < 1000) {
        throw new Error("Downloaded file is invalid (likely HTML error page)");
      }

      router.push({
        pathname: "/pdf-viewer",
        params: {
          url: downloadResult.uri,
          title: book.title,
        },
      });
    } catch (error) {
      console.log("OPEN FILE ERROR:", error);
      Alert.alert("Error", "Failed to open file. Check backend URL.");
    }
  };
  const handleDelete = (bookId) => {
    Alert.alert("Delete Book", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteBook(bookId) },
    ]);
  };
const handleShare = async (book) => {
    try {
      const shareUrl = book.fileUrl || book.fileLink;
      if (!shareUrl) {
        Alert.alert("Error", "No link available to share for this book.");
        return;
      }

      await Share.share({
        message: `Check out this book: ${book.title} by ${book.author}\n${shareUrl}`,
        url: shareUrl, // iOS supports URL separately
        title: book.title,
      });
    } catch (error) {
      Alert.alert("Error", error.message);
    }
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
    <CardTheme style={styles.card}>
      <ThemeText style={styles.title}>Title: {item.title}</ThemeText>
      <ThemeText style={styles.author}>Author: {item.author}</ThemeText>
      <ThemeText style={styles.desc}>
        Description: {item.description || "No description"}
      </ThemeText>

      <Spacer />

      <RowItemsTheme style={styles.iconRow}>
        <Pressable onPress={() => openFile(item)} style={styles.iconButton}>
          <Ionicons name="book-outline" size={24} color={colors.primary} />
          <ThemeText style={styles.iconText}>Open</ThemeText>
        </Pressable>

        <Pressable onPress={() => handleUpdate(item)} style={styles.iconButton}>
          <Ionicons name="create-outline" size={24} color={colors.primary} />
          <ThemeText style={styles.iconText}>Update</ThemeText>
        </Pressable>
        {/* --- ADDED SHARE BUTTON --- */}
        <Pressable onPress={() => handleShare(item)} style={styles.iconButton}>
          <Ionicons name="share-social-outline" size={24} color={colors.primary} />
          <ThemeText style={styles.iconText}>Share</ThemeText>
        </Pressable>
        {/* ------------------------- */}

        <Pressable onPress={() => handleDelete(item._id)} style={styles.iconButton}>
          <Ionicons name="trash-outline" size={24} color="#FF4B5C" />
          <ThemeText style={styles.iconText}>Delete</ThemeText>
        </Pressable>
      </RowItemsTheme>
    </CardTheme>
  );

  return (
    <ThemeView style={styles.container} safe={true}>
      <ThemeText style={styles.heading}>My Library</ThemeText>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" />
        <InputTheme
          placeholder="Search..."
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
  heading: { fontSize: 24, fontWeight: "bold",  marginBottom: 10 ,marginVertical:15,textAlign:"center"},

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: colors.uiBackground,
    borderRadius: 50,
    borderWidth: 1,
    // borderColor: "#7d7575ff",
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 12,
  },
  searchInput: { flex: 1,  marginLeft: 10 },

   row: {
    width: "90%",
    // flexDirection: "row",
    // gap: 10,
    // // overflow: "hidden",
    marginVertical: 10,
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
    fontSize: 11,
    color: "#fff",
  },

  card: {
    // backgroundColor: colors.uiBackground,
    // borderRadius: 12,
    // padding: 12,
    marginVertical: 6,
    marginHorizontal:20,
    // borderWidth: 1,
    // borderColor: "#222",
  },
  title: {  fontWeight: "bold", fontSize: 16, marginBottom: 4 },
  author: {  fontSize: 12, marginBottom: 4 },
  desc: {  fontSize: 12 },

  iconRow: { flexDirection: "row", marginTop: 10 },
  iconButton: { flexDirection: "row", alignItems: "center", marginRight: 20 },
  iconText: { marginLeft: 6, fontSize:14,fontWeight:"600" },
});