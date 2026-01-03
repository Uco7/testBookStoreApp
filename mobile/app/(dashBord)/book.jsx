import React, { useEffect } from "react";
import { FlatList, StyleSheet, View,Alert } from "react-native";
import ThemeView from "../../component/ThemeView";
import ThemeText from "../../component/ThemeText";
import Spacer from "../../component/Spacer";
import { useBook } from "../../hook/useBook";
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";

export default function Book() {
  const { books, fetchBooks,deleteBook} = useBook();
    const router = useRouter();
const openFile = async (fileUrl) => {
  try {
    const filename = fileUrl.split("/").pop();
    const localUri = FileSystem.documentDirectory + filename;

    // Check if file already exists
    const fileInfo = await FileSystem.getInfoAsync(localUri);
    if (!fileInfo.exists) {
      await FileSystem.downloadAsync(fileUrl, localUri);
    }

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(localUri);
    } else {
      Linking.openURL(localUri);
    }
  } catch (err) {
    console.log("Error opening file:", err);
  }
};

const handleDelete = (bookId) => {
    Alert.alert(
      "Delete Book",
      "Are you sure you want to delete this book?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteBook(bookId);
              Alert.alert("Book deleted successfully");
            } catch (err) {
              Alert.alert("Error deleting book", err.message);
            }
          },
        },
      ]
    );
  };
  
  
  const handleUpdate = (book) => {
    // Navigate to UpdateBook screen and pass book via params
    router.push({
      pathname: "/updateBook",
      params: { book: JSON.stringify(book) }, // convert to string to pass via URL
    });
  };

  useEffect(() => {
    fetchBooks();
  }, [books]);

  

  const renderItem = ({ item }) => (
    <ThemeView style={styles.card}>
       <ThemeText >Title: {item.title}</ThemeText>
       <Spacer />
    <ThemeText >Author: {item.author}</ThemeText>
       <Spacer />
    <ThemeText >
      Description: {item.description || "No description"}
    </ThemeText>
       <Spacer />     
        


<View style={[styles.iconRow, styles.field]}>
  <Pressable
    onPress={() => openFile(item.fileUrl)}
    style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
  >
    <MaterialIcons name="menu-book" size={28} color="#444" />
    <ThemeText style={styles.iconTitle}>Open</ThemeText>
  </Pressable>

  <Pressable
    onPress={() => handleUpdate(item)}
    style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
  >
    <MaterialIcons name="update" size={28} color="#444" />
    <ThemeText style={styles.iconTitle}>Update</ThemeText>
  </Pressable>

  <Pressable
    onPress={() => handleDelete(item._id)}
    style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
  >
    <MaterialIcons name="delete" size={28} color="#444" />
    <ThemeText style={styles.iconTitle}>Delete</ThemeText>
  </Pressable>
</View>



    </ThemeView>
  );

  return (
    <ThemeView style={{ flex: 1, padding: 12 }}>
      <ThemeText style={styles.heading}>Book Shelf</ThemeText>
      <Spacer />

      <FlatList
        data={books}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListEmptyComponent={
          <ThemeText style={{ marginTop: 20 }}>
            No books returned from API
          </ThemeText>
        }
      />
    </ThemeView>
  );
}
const styles = StyleSheet.create({
  heading: {
    fontSize: 22,
    fontWeight: "bold",
  },
  card: {
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fff",
    width: "100%",
  },
  field: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginBottom: 6,
    fontSize: 14,
  },


  iconRow: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
  marginBottom: 1,
  //  width:"100%",
paddingHorizontal:10,
},
  iconButton: {
  flexDirection: "row",
  alignItems: "center",
  marginRight: 20,
},
iconTitle: {
  marginLeft: 8,
  fontSize: 16,
  fontWeight: "500",
},
  pressed: {
    opacity: 0.5,
    transform: [{ scale: 0.98 }],
  },

});
