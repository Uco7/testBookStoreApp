import { Client, Account, ID, Models } from 'react-native-appwrite';



const client = new Client();
client
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('6941b66c0004e4c04ffb')   // Your Project ID
  .setPlatform('reactNative.createContext.lession2');   // Your package name / bundle identifier

export const account = new Account(client);

<View style={[styles.iconRow, styles.field]}>
  <Pressable
    onPress={() => openFile(item.fileUrl)}
    style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
  >
    <MaterialIcons name="menu-book" size={28} color="#444" />
    <ThemeText style={styles.iconTitle}>Open</ThemeText>
  </Pressable>

  <Pressable
    onPress={() => console.log("Update pressed")}
    style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
  >
    <MaterialIcons name="update" size={28} color="#444" />
    <ThemeText style={styles.iconTitle}>Update</ThemeText>
  </Pressable>

  <Pressable
    onPress={() => console.log("Delete pressed")}
    style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
  >
    <MaterialIcons name="delete" size={28} color="#444" />
    <ThemeText style={styles.iconTitle}>Delete</ThemeText>
  </Pressable>
</View>

// createBook;
// // import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
// // import React, { useState } from 'react'
// // import ThemeView from '../../component/ThemeView'
// // import ThemeText from '../../component/ThemeText'
// // import { Link } from 'expo-router'
// // import ThemeButton from '../../component/ThemeButton'
// // import Spacer from '../../component/Spacer'
// // import InputTheme from '../../component/InputTheme'


// // const Create = () => {
// //   const [authorName, setAuthorName]=useState("")
// //   const [bookTile, setBookTile]=useState("")
// //   const [bookDescription, setBookDescription]=useState("")
// //   return (
// //     <TouchableWithoutFeedback onPress={Keyboard.dismiss} >

// //     <ThemeView>
// //         <ThemeText>Booke Creation Page</ThemeText>
// //          <Spacer/>
// //          <InputTheme placeholder="user Email"
// //       style={{width:"80%"}}
// //       keyboardType="email"
// //       autoCapitalize="none"
// //       onChangeText={setBookTile}
// //       value={bookTile}
      
// //       />
// //       <Spacer/>
// //       <InputTheme placeholder="user password"
// //       style={{width:"80%"}}
// //       keyboardType="password"
// //       autoCapitalize="none"
// //       onChangeText={setAuthorName}
// //       value={authorName}
      
// //       />
// //       <Spacer/>
// //       <InputTheme placeholder="Enter Book Description"
// //       style={{width:"80%",height:"20%"}}
// //       keyboardType="description"
// //       autoCapitalize="none"
// //       onChangeText={setBookDescription}
// //       value={bookDescription}
      
// //       />
// //       <Spacer/>
// //         <ThemeButton><ThemeText>Create </ThemeText></ThemeButton>
// //       <Spacer/>
// //         <ThemeText><Link href="/profile">Back To Profile</Link></ThemeText>

// //     </ThemeView>
// //       </TouchableWithoutFeedback>
  
// //   )
// // }

// // export default Create

// // const styles = StyleSheet.create({})


// import {
//   Keyboard,
//   TouchableWithoutFeedback,
//   Alert
// } from "react-native";
// import React, { useState } from "react";
// import ThemeView from "../../component/ThemeView";
// import ThemeText from "../../component/ThemeText";
// import ThemeButton from "../../component/ThemeButton";
// import Spacer from "../../component/Spacer";
// import InputTheme from "../../component/InputTheme";
// import * as DocumentPicker from "expo-document-picker";
// import { useBook } from "../../hook/useBook";
// import { useRouter } from "expo-router";

// import { useFocusEffect } from "expo-router";
// import { useCallback } from "react";


// export default function Create() {
//   const [title, setTitle] = useState("");
//   const [author, setAuthor] = useState("");
//   const [description, setDescription] = useState("");
//   const [file, setFile] = useState(null);

//   const { createBook } = useBook();
//   const router = useRouter();
// useFocusEffect(
//   useCallback(() => {
//     setTitle("");
//     setAuthor("");
//     setDescription("");
//     setFile(null);
//   }, [])
// );

//   const pickFile = async () => {
//     const result = await DocumentPicker.getDocumentAsync({});
//     if (!result.canceled) setFile(result.assets[0]);
//   };

//   const handleSubmit = async () => {
//     if (!title || !author || !file) {
//       return Alert.alert("Error", "Title, Author and File required");
//     }

//     try {
//       const ok = await createBook({ title, author, description, file });
//      if(!ok) throw new Error("Book creation failed");
//      console.log("Book created successfully",ok);
//      setTitle("");
//       setAuthor("");  
//       setDescription("");
//       setFile(null);
//       router.replace("/book");
//     } catch (err) {
//       Alert.alert("Upload Failed", err.message || "Try again");
//     }
//   };

//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//       <ThemeView>
//         <ThemeText>Book Creation</ThemeText>
//         <Spacer />

//         <InputTheme placeholder="Book Title" value={title} onChangeText={setTitle} />
//         <Spacer />

//         <InputTheme placeholder="Author Name" value={author} onChangeText={setAuthor} />
//         <Spacer />

//         <InputTheme
//           placeholder="Description"
//           value={description}
//           onChangeText={setDescription}
//           multiline
//         />
//         <Spacer />

//         <ThemeButton onPress={pickFile}>
//           <ThemeText>{file ? file.name : "Pick File"}</ThemeText>
//         </ThemeButton>

//         <Spacer />

//         <ThemeButton onPress={handleSubmit}>
//           <ThemeText>Upload Book</ThemeText>
//         </ThemeButton>
//       </ThemeView>
//     </TouchableWithoutFeedback>
//   );
// }



// import {
//   Keyboard,
//   TouchableWithoutFeedback,
//   Alert,
//   View,
//   Text,
//   StyleSheet
// } from "react-native";
// import React, { useState, useCallback } from "react";
// import ThemeView from "../../component/ThemeView";
// import ThemeText from "../../component/ThemeText";
// import ThemeButton from "../../component/ThemeButton";
// import Spacer from "../../component/Spacer";
// import InputTheme from "../../component/InputTheme";
// import * as DocumentPicker from "expo-document-picker";
// import { useBook } from "../../hook/useBook";
// import { useRouter, useFocusEffect } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";

// export default function Create() {
//   const [title, setTitle] = useState("");
//   const [author, setAuthor] = useState("");
//   const [description, setDescription] = useState("");
//   const [file, setFile] = useState(null);

//   const { createBook } = useBook();
//   const router = useRouter();

//   useFocusEffect(
//     useCallback(() => {
//       setTitle("");
//       setAuthor("");
//       setDescription("");
//       setFile(null);
//     }, [])
//   );

//   const pickFile = async () => {
//     const result = await DocumentPicker.getDocumentAsync({});
//     if (!result.canceled) setFile(result.assets[0]);
//   };

//   const handleSubmit = async () => {
//     if (!title || !author || !file) {
//       return Alert.alert("Error", "Title, Author and File required");
//     }

//     try {
//       const ok = await createBook({ title, author, description, file });
//       if (!ok) throw new Error("Book creation failed");

//       setTitle("");
//       setAuthor("");
//       setDescription("");
//       setFile(null);
//       router.replace("/book");
//     } catch (err) {
//       Alert.alert("Upload Failed", err.message || "Try again");
//     }
//   };

//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//       <ThemeView style={styles.container} safe={true}>
//         <View style={styles.row}>
//        <Text style={styles.btns} >
//             <ThemeText>Reading Book</ThemeText>
//           </Text>
//           <Text style={styles.btns} >
//             <ThemeText>File/Doc Link</ThemeText>
//           </Text>
//           <Text style={styles.btns} >
//             <ThemeText>Doc</ThemeText>
//           </Text>
          
//         </View>
//         <Spacer/>
//         <View style={styles.card}>

//           {/* Header */}
//           <View style={styles.header}>
//             <Ionicons name="arrow-back" size={22} color="#fff" onPress={() => router.back()} />
//             <ThemeText style={styles.headerTitle}>Add New Book</ThemeText>
//             <View style={{ width: 22 }} />
//           </View>

//           <Spacer height={20} />

//           <InputTheme placeholder="Book Title" value={title} onChangeText={setTitle} />
//           <Spacer />

//           <InputTheme placeholder="Author Name" value={author} onChangeText={setAuthor} />
//           <Spacer />

//           <InputTheme
//             placeholder="Description (optional)"
//             value={description}
//             onChangeText={setDescription}
//             multiline
//             style={{height:"30%"}}
//           />
//           <Spacer />

//           <ThemeButton onPress={pickFile} style={{width:"80%",marginLeft:"auto",marginRight:"auto"}}>
//             <ThemeText>{file ? file.name : "Pick Book File"}</ThemeText>
//           </ThemeButton>

//           <Spacer height={16} />


//         </View>
//           <Spacer height={16} />
//           <ThemeButton onPress={handleSubmit} style={{alignItems:"center"}}>
//             <ThemeText>Save Book</ThemeText>
//           </ThemeButton>
//       </ThemeView>
//     </TouchableWithoutFeedback>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   card: {
//     width: "90%",
//     paddingVertical: 28,
//     paddingHorizontal: 20,
//     borderRadius: 26,
//     backgroundColor: "rgba(255,255,255,0.05)",
//     borderWidth: 1,
//     borderColor: "rgba(255,255,255,0.15)",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   headerTitle: {
//     flex: 1,
//     textAlign: "center",
//     fontSize: 18,
//     fontWeight: "600",  
//   },
//    row: {
//     flexDirection: "row",
//     gap: 10,
//     overflow:"hidden",
//     marginVertical:10,
//     marginHorizontal:20,
//     marginTop:40,
//   },
//   btns:{
//     fontSize:5,
//   }
// });
// createBook;


// bookcontex

import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// let APPURl="https://testbookstoreapp.onrender.com";
let APPURl="http://192.168.240.202:5000";


export const BookContext = createContext();

export function BookProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const createBook = async ({ title, author, description, file }) => {
    if (!title || !file) throw new Error("Title and file required");

    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("No auth token found");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("description", description);
    formData.append("file", {
      uri: file.uri,
      type: file.mimeType || file.type || "application/pdf",
      name: file.name,
    });

    try {
      const res = await axios.post(`${APPURl}/books`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Book uploaded", res.data);

      // Optionally update local state
      setBooks((prev) => [res.data, ...prev]);

      return res.data; // <-- return the created book
    } catch (err) {
      console.log("Create book error:", err.response?.data || err.message);
      throw new Error(err.response?.data?.message || err.message);
    }
  };



  async function fetchBooks() {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await axios.get(`${APPURl}/get/books`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBooks(res.data);
    } catch (error) {
      console.log("fetch books error:", error.response?.data || error.message);
    }
  }

  useEffect(() => {
    fetchBooks();
  }, []);


  const updateBook = async (bookId, data) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("author", data.author);
    formData.append("description", data.description);
    if (data.file) {
      formData.append("file", {
        uri: data.file.uri,
        type: data.file.type || "application/pdf",
        name: data.file.name,
      });
    }

    await axios.put(`${APPURl}/books/${bookId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    fetchBooks(); // refresh list
  } catch (err) {
    console.log(err);
  }
};
const deleteBook = async (bookId) => {
  try {
    const token = await AsyncStorage.getItem("token");
    await axios.delete(`${APPURl}/books/${bookId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchBooks(); // refresh list
  } catch (err) {
    console.log(err);
  }
};


  return (
    <BookContext.Provider value={{ books, loading, createBook, fetchBooks, updateBook,deleteBook }}>
      {children}
    </BookContext.Provider>
  );
}


// bookcontex



// bookjsx


import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  ImageBackground 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function LibraryScreen() {
  return (
    <View style={styles.container}>
      {/* Background Image - Use a dark nebula/space image */}
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=1000' }} 
        style={styles.backgroundImage}
      >
        <LinearGradient
          colors={['rgba(15,12,41,0.8)', 'rgba(48,43,99,0.7)', 'rgba(36,36,62,0.9)']}
          style={styles.overlay}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            
            {/* Header Section */}
            <View style={styles.header}>
              <View style={styles.profileRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>R</Text>
                </View>
                <Text style={styles.greeting}>Hello, Reader!</Text>
                <TouchableOpacity style={styles.addButton}>
                   <Ionicons name="add" size={20} color="#00E5FF" />
                   <Text style={styles.addButtonText}>Add New</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
              <TextInput 
                placeholder="Search your library..." 
                placeholderTextColor="#888"
                style={styles.searchInput}
              />
            </View>

            {/* Filter Tabs */}
            <View style={styles.tabContainer}>
              <TouchableOpacity style={[styles.tab, styles.activeTab]}>
                <Text style={styles.activeTabText}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tab}>
                <Text style={styles.tabText}>Reading</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tab}>
                <Text style={styles.tabText}>Wishlist</Text>
              </TouchableOpacity>
            </View>

            {/* Book Cards */}
            <BookCard title="The Fellowship of the Ring" author="Inter/Popikks" />
            <BookCard title="The Fellowship of the Ring" author="Inter/Popikks" />

          </ScrollView>

          {/* Bottom Navigation */}
          <View style={styles.bottomNav}>
            <NavIcon name="home-outline" label="Home" />
            <NavIcon name="book" label="Library" active />
            <NavIcon name="settings-outline" label="Settings" />
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

// Sub-component for the Book Card
const BookCard = ({ title, author }) => (
  <View style={styles.cardWrapper}>
    <LinearGradient
      colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
      style={styles.card}
    >
      <LinearGradient colors={['#2193b0', '#6dd5ed']} style={styles.bookImage}>
        <Ionicons name="book-outline" size={40} color="white" />
      </LinearGradient>
      
      <View style={styles.cardInfo}>
        <Text style={styles.authorText}>{author}</Text>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.descText} numberOfLines={2}>
          First part of J.R.R. Tolkien's epic fantasy novel.
        </Text>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionCircle}>
          <Ionicons name="sync" size={18} color="#00E5FF" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionCircle, { borderColor: '#ff4b5c' }]}>
          <Ionicons name="trash-outline" size={18} color="#ff4b5c" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  </View>
);

// Navigation Icon Component
const NavIcon = ({ name, label, active }) => (
  <TouchableOpacity style={styles.navItem}>
    <View style={active ? styles.activeNavIcon : null}>
      <Ionicons name={name} size={24} color={active ? "#00E5FF" : "#aaa"} />
    </View>
    <Text style={[styles.navLabel, active && { color: '#00E5FF' }]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: { flex: 1 },
  overlay: { flex: 1, paddingTop: 60 },
  scrollContent: { paddingHorizontal: 20 },
  
  header: { marginBottom: 20 },
  profileRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { 
    width: 45, height: 45, borderRadius: 22.5, 
    backgroundColor: '#6a11cb', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: '#00E5FF'
  },
  avatarText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  greeting: { color: 'white', fontSize: 24, fontWeight: 'bold', marginLeft: 15, flex: 1 },
  addButton: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', 
    padding: 8, borderRadius: 20, borderWidth: 1, borderColor: '#00E5FF'
  },
  addButtonText: { color: '#00E5FF', fontSize: 12, marginLeft: 4 },

  searchContainer: {
    flexDirection: 'row', alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    borderRadius: 25, paddingHorizontal: 15, height: 50, marginBottom: 20,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)'
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, color: 'white' },

  tabContainer: { flexDirection: 'row', marginBottom: 20 },
  tab: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  activeTab: { backgroundColor: 'rgba(0, 229, 255, 0.2)', borderColor: '#00E5FF' },
  tabText: { color: '#aaa' },
  activeTabText: { color: 'white', fontWeight: 'bold' },

  cardWrapper: { marginBottom: 15, borderRadius: 25, overflow: 'hidden' },
  card: { 
    flexDirection: 'row', padding: 15, borderRadius: 25, 
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', alignItems: 'center' 
  },
  bookImage: { width: 80, height: 100, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  cardInfo: { flex: 1, marginLeft: 15 },
  authorText: { color: '#aaa', fontSize: 10 },
  titleText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginVertical: 4 },
  descText: { color: '#ddd', fontSize: 12 },
  cardActions: { justifyContent: 'space-between', height: 80 },
  actionCircle: { 
    width: 35, height: 35, borderRadius: 17.5, borderWidth: 1, 
    borderColor: '#00E5FF', justifyContent: 'center', alignItems: 'center' 
  },

  bottomNav: {
    flexDirection: 'row', justifyContent: 'space-around', 
    paddingVertical: 15, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(15,12,41,0.95)'
  },
  navItem: { alignItems: 'center' },
  activeNavIcon: { 
    padding: 8, borderRadius: 20, borderWidth: 1, borderColor: '#00E5FF', marginBottom: 2 
  },
  navLabel: { color: '#aaa', fontSize: 10, marginTop: 4 }
});

// bookjsx

// bookjsx second cod


import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Platform,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as Linking from "expo-linking";
import * as IntentLauncher from "expo-intent-launcher";
import { useRouter } from "expo-router";
import { useBook } from "../../hook/useBook";

export default function LibraryScreen() {
  const { books, fetchBooks, deleteBook } = useBook();
  const router = useRouter();

  useEffect(() => {
    fetchBooks();
  }, []);

  const openFile = async (book) => {
    try {
      if (book.fileLink) return await Linking.openURL(book.fileLink);

      if (!book.fileUrl) return Alert.alert("No file", "This book has no file.");

      const filename = book.fileUrl.split("/").pop();
      const localUri = FileSystem.documentDirectory + filename;

      const info = await FileSystem.getInfoAsync(localUri);
      if (!info.exists) await FileSystem.downloadAsync(book.fileUrl, localUri);

      if (book.originalFormat === "pdf") {
        router.push({ pathname: "/book/pdf-viewer", params: { url: localUri, title: book.title } });
        return;
      }

      if (Platform.OS === "android") {
        const contentUri = await FileSystem.getContentUriAsync(localUri);
        await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
          data: contentUri,
          flags: 1,
        });
      } else {
        await Sharing.shareAsync(localUri);
      }
    } catch (e) {
      Alert.alert("Open failed", "Cannot open this file.");
    }
  };

  const handleDelete = (id) => {
    Alert.alert("Delete", "Delete this book?", [
      { text: "Cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteBook(id) },
    ]);
  };

  const renderItem = ({ item }) => (
    <BookCard
      title={item.title}
      author={item.author}
      description={item.description}
      onOpen={() => openFile(item)}
      onDelete={() => handleDelete(item._id)}
      onUpdate={() =>
        router.push({ pathname: "/updateBook", params: { book: JSON.stringify(item) } })
      }
    />
  );

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: "https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=1000" }}
        style={styles.backgroundImage}
      >
        <LinearGradient colors={["rgba(15,12,41,0.8)", "rgba(48,43,99,0.7)", "rgba(36,36,62,0.9)"]} style={styles.overlay}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Text style={styles.heading}>My Library</Text>

            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#888" />
              <TextInput placeholder="Search..." placeholderTextColor="#888" style={styles.searchInput} />
            </View>

            <FlatList
              data={books}
              keyExtractor={(item) => item._id}
              renderItem={renderItem}
              scrollEnabled={false}
              ListEmptyComponent={<Text style={{ color: "#aaa" }}>No books found</Text>}
            />
          </ScrollView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const BookCard = ({ title, author, description, onOpen, onUpdate, onDelete }) => (
  <View style={styles.cardWrapper}>
    <LinearGradient colors={["rgba(255,255,255,0.15)", "rgba(255,255,255,0.05)"]} style={styles.card}>
      <LinearGradient colors={["#2193b0", "#6dd5ed"]} style={styles.bookImage}>
        <Ionicons name="book-outline" size={40} color="white" />
      </LinearGradient>

      <View style={styles.cardInfo}>
        <Text style={styles.authorText}>{author}</Text>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.descText} numberOfLines={2}>{description || "No description"}</Text>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionCircle} onPress={onOpen}>
          <Ionicons name="open-outline" size={18} color="#00E5FF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCircle} onPress={onUpdate}>
          <Ionicons name="create-outline" size={18} color="#00E5FF" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionCircle, { borderColor: "#ff4b5c" }]} onPress={onDelete}>
          <Ionicons name="trash-outline" size={18} color="#ff4b5c" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: { flex: 1 },
  overlay: { flex: 1, paddingTop: 60 },
  scrollContent: { paddingHorizontal: 20 },
  heading: { color: "white", fontSize: 24, fontWeight: "bold", marginBottom: 10 },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 20,
  },
  searchInput: { flex: 1, color: "white", marginLeft: 10 },

  cardWrapper: { marginBottom: 15, borderRadius: 25, overflow: "hidden" },
  card: { flexDirection: "row", padding: 15, borderRadius: 25, borderWidth: 1, borderColor: "rgba(255,255,255,0.3)" },
  bookImage: { width: 80, height: 100, borderRadius: 15, justifyContent: "center", alignItems: "center" },
  cardInfo: { flex: 1, marginLeft: 15 },
  authorText: { color: "#aaa", fontSize: 10 },
  titleText: { color: "white", fontSize: 16, fontWeight: "bold" },
  descText: { color: "#ddd", fontSize: 12 },
  cardActions: { justifyContent: "space-between", height: 80 },
  actionCircle: { width: 35, height: 35, borderRadius: 17.5, borderWidth: 1, borderColor: "#00E5FF", justifyContent: "center", alignItems: "center" },
});


// bookjsx second cod
// usercontext
// import { createContext, useEffect, useState } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage"
// import axios from 'axios'
// let APPURl="http://192.168.240.202:5000";

// // let APPURl="https://testbookstoreapp.onrender.com";

// export const UserContext=createContext();
// export  function UserProvider({children}){
//   const [user,setUser]=useState(null);
//   const [authToken,setAuthToken]=useState(false);
//    async function login(email,password){
  
//     try {
//         const res=await axios.post(`${APPURl}/login`,{email,password})
//     console.log("loggged user data",res.data)
//     const  userToken=await AsyncStorage.setItem("token",res.data.token);
//     console.log("asnystorage data||token=",userToken)
//      await fetchUser();
//     //  return (true)
      
//     } catch (error) {
//       console.log("login error:", error.response?.data || err.message);
//       // return (false)
      
//     }
//     }
//     async function register(email,password) {
//       try {
//         const newUser=await axios.post(`${APPURl}/register`,{email,password})
//         console.log("registered user data",newUser)

        
//       } catch (error) {
//         throw new Error(error.message||"Registration failed")
        
//       }
      
//     }
//     async function fetchUser() {
//       try {
//         const token=await AsyncStorage.getItem("token");
//         if(!token){
//           throw new Error("No auth token found");
         
//         }
//         console.log("fetched token from asyncstorage",token)
//         const response=await axios.get(`${APPURl}/user`,({
//           headers:{
//             Authorization:`Bearer ${token}`
//           }
//         }))
//         if(response.data){
//           console.log("fetched user data",response.data)
//           setUser(response.data)
          
//         }
        
//       } catch (error) {
//         console.log("fetch user error:", error.message);
//       // console.log("Fetch user error:", error.response?.status, error.response?.data || error.message);
        
//       }finally{
//         setAuthToken(true)
//       }
//       }
//     async function logOut() {
//       try {
//         await AsyncStorage.removeItem("token");
//         setUser(null);
//         setAuthToken(false);
        
//       } catch (error) {
//         console.log("logout error",error)
        
//       }
      
//     }
//     useEffect(() => {
//       fetchUser();
//     }, []);
//     return(
//       <UserContext.Provider value={{user,authToken,login,register,logOut}}>
//         {children}
//       </UserContext.Provider>
//     ) 
  
//   }
// usercontext
// registration screen
// // import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback, Alert } from 'react-native'
// // import  { useState } from 'react'
// // import ThemeView from '../../component/ThemeView'
// // import ThemeText from '../../component/ThemeText'
// // import ThemeButton from '../../component/ThemeButton'
// // import Spacer from '../../component/Spacer'
// // import { Link, useRouter,  } from 'expo-router'
// // import { colors } from '../../constant/colors'
// // import InputTheme from '../../component/InputTheme'
// // import { useUser } from '../../hook/useUser'
 

// // const Register = () => {
// //   const [email, setEmail] = useState("")
// //   const [password, setPassword] = useState("")
// //   const [error, setError] = useState(null)
// //   const  [success,setSuccess]=useState(false)
// //   const router=useRouter();
// //   const {register}=useUser()
 

// //   const handleRegister = async () => {
// //     setSuccess(false)
// //     setError(null);
// //     try {
// //       await register(email, password);
// //       setSuccess("Registration successful!"); 
// //       setTimeout(() => {
// //         router.replace("/login");
// //       }, 3000);
      
// //     } catch (error) {
// //       setError("Registration failed. Please try again.");
      
// //     }

   
    
// //   }

// //   return (
// //     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
// //       <ThemeView>
// //         <ThemeText>Register Page</ThemeText>

// //         <InputTheme
// //           placeholder="user Email"
// //           style={{ width: "80%" }}
// //           keyboardType="email-address"
// //           autoCapitalize="none"
// //           onChangeText={setEmail}
// //           value={email}
// //         />

// //         <Spacer />

// //         <InputTheme
// //           placeholder="user password"
// //           style={{ width: "80%" }}
// //           secureTextEntry
// //           autoCapitalize="none"
// //           onChangeText={setPassword}
// //           value={password}
// //         />

// //         <Spacer />

// //         <ThemeButton onPress={handleRegister}>
// //           <Text style={{ color: "#fff", fontSize: 20, fontWeight: "600" }}>
// //             Register
// //           </Text>
// //         </ThemeButton>
// //         {error && <Text style={{ color: "red" }}>{error}</Text>}
// //         {success && <Text style={{ color: "green" }}>{success}</Text>}

// //         <Spacer />
// //         <Spacer />

// //         <Text>
// //           Already have an account? Login{" "}
// //           <Link href="/login" style={{ color: colors.primary, fontSize: 20, fontWeight: "600" }}>
// //             Here
// //           </Link>
// //         </Text>
// //       </ThemeView>
// //     </TouchableWithoutFeedback>
// //   )
// // }

// // export default Register

// // const styles = StyleSheet.create({})




// import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
// import { useState } from 'react'
// import ThemeView from '../../component/ThemeView'
// import ThemeText from '../../component/ThemeText'
// import ThemeButton from '../../component/ThemeButton'
// import Spacer from '../../component/Spacer'
// import { Link, useRouter } from 'expo-router'
// import { colors } from '../../constant/colors'
// import InputTheme from '../../component/InputTheme'
// import { useUser } from '../../hook/useUser'
// import { Ionicons } from '@expo/vector-icons'

// const Register = () => {
//   const [username, setUsername] = useState("")
//   const [fullName, setFullName] = useState("")
  
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [error, setError] = useState(null)
//   const [success, setSuccess] = useState(false)

//   const router = useRouter()
//   const { register } = useUser()

//   const handleRegister = async () => {
//     setSuccess(false)
//     setError(null)

//     try {
//       await register(email, password)
//       setSuccess("Registration successful!")
//       setTimeout(() => router.replace("/login"), 3000)
//     } catch {
//       setError("Registration failed. Please try again.")
//     }
//   }

//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//       <ThemeView style={styles.container}>
//         <View style={styles.card}>

//           {/* Header */}
//           <View style={styles.header}>
//             <Ionicons name="arrow-back" size={22} color="#fff" onPress={() => router.back()} />
//             <ThemeText style={styles.headerTitle}>Create Account</ThemeText>
//             <View style={{ width: 22 }} />
//           </View>

//           <Spacer height={20} />

//           <InputTheme
//             placeholder="Create a user name eg:Uche07..."
//             style={styles.input}
//             keyboardType="email-address"
//             autoCapitalize="none"
//             onChangeText={setUsername}
//             value={username}
//           />
//           <Spacer height={20} />

//           <InputTheme
//             placeholder="Full Name"
//             style={styles.input}
//             keyboardType="email-address"
//             autoCapitalize="none"
//             onChangeText={setFullName}
//             value={fullName}
//           />
//           <Spacer height={20} />

//           <InputTheme
//             placeholder="Email"
//             style={styles.input}
//             keyboardType="email-address"
//             autoCapitalize="none"
//             onChangeText={setEmail}
//             value={email}
//           />

//           <Spacer />

//           <InputTheme
//             placeholder="Password"
//             style={styles.input}
//             secureTextEntry
//             autoCapitalize="none"
//             onChangeText={setPassword}
//             value={password}
//           />

//           <Spacer height={24} />

//           <ThemeButton onPress={handleRegister}>
//             <Text style={styles.buttonText}>Sign Up</Text>
//           </ThemeButton>

//           <Spacer />

//           {error && <Text style={styles.error}>{error}</Text>}
//           {success && <Text style={styles.success}>{success}</Text>}

//           <Spacer height={20} />

//           <Text style={styles.footerText}>
//             Already have an account?{" "}
//             <Link href="/login" style={styles.loginLink}>Log in</Link>
//           </Text>

//         </View>
//       </ThemeView>
//     </TouchableWithoutFeedback>
//   )
// }

// export default Register
// const styles = StyleSheet.create({
//   container: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   card: {
//     width: "90%",
//     paddingVertical: 30,
//     paddingHorizontal: 20,
//     borderRadius: 26,
//     backgroundColor: "rgba(255,255,255,0.05)",
//     borderWidth: 1,
//     borderColor: "rgba(255,255,255,0.15)",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   headerTitle: {
//     flex: 1,
//     textAlign: "center",
//     fontSize: 18,
//     fontWeight: "600",
//   },
//   input: {
//     width: "100%",
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   footerText: {
//     color: "#aaa",
//     fontSize: 12,
//     textAlign: "center",
//   },
//   loginLink: {
//     color: colors.primary,
//     fontSize: 13,
//     fontWeight: "600",
//   },
//   error: {
//     color: "#ff6b6b",
//     textAlign: "center",
//   },
//   success: {
//     color: "#4ade80",
//     textAlign: "center",
//   },
// })
// registration screen