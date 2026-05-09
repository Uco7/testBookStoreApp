

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
import { Menu, Divider } from "react-native-paper";
// import * as Linking from "expo-linking";
import { Linking } from "react-native";
import InputTheme from "../../component/InputTheme";
import RowItemsTheme from "../../component/RowItemsTheme";
import CardTheme from "../../component/CardTheme";
import { useUser } from "../../hook/useUser";
import { ActivityIndicator } from "react-native";



export default function Book() {
  const { books, fetchBooks, deleteBook, } = useBook();
  const {authReady}=useUser()
  const router = useRouter();
const [bookLoading, setBookLoading] = useState(false);
  const [selectedType, setSelectedType] = useState("All");
  const [search, setSearch] = useState("");
const [visibleMenuId, setVisibleMenuId] = useState(null);

const openMenu = (id) => setVisibleMenuId(id);
const closeMenu = () => setVisibleMenuId(null);

useEffect(() => {
  const loadBooks = async () => {
    try {
      if (!authReady) return;
      setBookLoading(true);
      await fetchBooks();
      
    } catch (error) {
      
      console.log("Error loading books:", error);
    }finally {
      setBookLoading(false);
    }
  }

  loadBooks();


}, [authReady]);
 const filteredBooks = useMemo(() => {
    return books.filter((item) => {
      if (selectedType === "link" && !item.fileLink) return false;
      if (selectedType === "doc" && !item.fileUrl) return false;

      const q = search.toLowerCase();
      const formateDate=item.createdAt?new Date(item.createdAt).toLocaleString().toLowerCase():""
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

if (!authReady || bookLoading) {
  return (
    <ThemeView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator
        size="large"
        color={colors.primary}
      />

      <ThemeText style={{ marginTop: 10 }}>
        Loading books...
      </ThemeText>
    </ThemeView>
  );
}

 

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

    // =========================
    // OPEN EXTERNAL LINK
    // =========================
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

    // =========================
    // OPEN PDF/DOCUMENT
    // =========================
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

      const downloadResult = await FileSystem.downloadAsync(
        book.fileUrl,
        localUri
      );

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
    Alert.alert("Error", "Failed to open content");
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

      if(book.fileType==="link"){
        console.log("Sharing external link:", shareUrl);
        await Share.share({
        message: ` ${book.title} \n${shareUrl}`,
        url: shareUrl, // iOS supports URL separately
        title: book.title,
      });
      return;

      }
      await Share.share({
        message: `Download Now:🗂️ ${book.title} by ${book.author}\n${shareUrl}`,
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

 
  

  const renderItem = ({ item }) => (
    <CardTheme style={styles.card}>
         {/* --- ADDED SHARE BUTTON --- */}
         {/* <RowItemsTheme style={{ justifyContent: "flex-end", marginBottom: 8 ,marginHorizontal:12}}> */}


        {/* <Pressable onPress={() => handleShare(item)} style={styles.iconButton}>
          <Ionicons name="share-social-outline" size={20} color={colors.primary} />
          <ThemeText style={[styles.iconText, { fontSize: 10 }]}>Share</ThemeText>
        </Pressable> */}
        {/* ------------------------- */}
         {/* </RowItemsTheme> */}
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
        <Ionicons
          name="ellipsis-vertical"
          size={22}
          color={colors.primary}
        />
      </Pressable>
    }
  >
    <Menu.Item
      onPress={() => {
        closeMenu();
        handleShare(item);
      }}
      title="Share"
      leadingIcon="share-variant"
    />

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
        handleDelete(item._id);
      }}
      title="Set Reminder"
      leadingIcon="calendar-outline"
      titleStyle={{ color: "red" }}
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
      <ThemeText style={styles.author}>{item.author? `Author: ${item.author}`: "No author specified"}</ThemeText>
      <ThemeText style={styles.desc}>
        Description: {item.description || "No description"}
      </ThemeText>
      <ThemeText style={{fontSize: 10, marginTop: 4, color: "#555", fontStyle: "italic"}}>
        Date: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"}
      </ThemeText>

      <Spacer />

      <RowItemsTheme style={styles.iconRow}>
        <Pressable onPress={() => openFile(item)} style={styles.iconButton}>
          <Ionicons name="book-outline" size={24} color={colors.primary} />
          <ThemeText style={styles.iconText}>Open</ThemeText>
        </Pressable>

        {/* <Pressable onPress={() => handleUpdate(item)} style={styles.iconButton}>
          <Ionicons name="create-outline" size={24} color={colors.primary} />
          <ThemeText style={styles.iconText}>Update</ThemeText>
        </Pressable>
          */}
         <Spacer width={50} />
     

        <Pressable onPress={() => handleDelete(item._id)} style={styles.iconButton}>
          <Ionicons name="alarm-outline" size={24} color={colors.primary} />
          <ThemeText style={styles.iconText}>Remind</ThemeText>
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
          placeholder="Search by title, author, Date, link, or description"
          placeholderTextColor="#888"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      {/* <ThemeText style={{ color: "#aaa", fontSize: 12 }}>
        (Search by title, author, description, link, or date)
      </ThemeText> */}
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
    width: "80%",
    alignSelf: "center",

  },
  searchInput: { flex: 1,  marginLeft: 2,
    
   },

   row: {
    width: "90%",
   
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