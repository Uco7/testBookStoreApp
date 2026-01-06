// import { useState } from "react";
// import { View, TextInput, Button, Alert, StyleSheet } from "react-native";
// import { useRouter, useLocalSearchParams } from "expo-router";
// import ThemeView from "../../component/ThemeView";
// import ThemeText from "../../component/ThemeText";
// import Spacer from "../../component/Spacer";
// import { useBook } from "../../hook/useBook";
// import * as DocumentPicker from "expo-document-picker";

// export default function UpdateBook() {
//   const router = useRouter();
//   const params = useLocalSearchParams();
//   const book = JSON.parse(params.book);

//   const { updateBook } = useBook();

//   const [title, setTitle] = useState(book.title);
//   const [author, setAuthor] = useState(book.author);
//   const [description, setDescription] = useState(book.description || "");
//   const [file, setFile] = useState(null);

//   const pickFile = async () => {
//     const result = await DocumentPicker.getDocumentAsync({});
//     if (!result.canceled) setFile(result);
//   };

//   const handleSubmit = async () => {
//     try {
//       await updateBook(book._id, { title, author, description, file });
//       Alert.alert("Book updated successfully");
//       router.push("/book");
//     } catch (err) {
//       Alert.alert("Error updating book", err.message);
//     }
//   };

//   return (
//     <ThemeView style={{ flex: 1, padding: 12 }}>
//       <ThemeText style={styles.heading}>Update Book</ThemeText>
//       <Spacer />

//       <TextInput
//         style={styles.input}
//         placeholder="Title"
//         value={title}
//         onChangeText={setTitle}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Author"
//         value={author}
//         onChangeText={setAuthor}
//       />
//       <TextInput
//         style={[styles.input, { height: 100 }]}
//         placeholder="Description"
//         multiline
//         value={description}
//         onChangeText={setDescription}
//       />

//       <Button title="Pick New File (optional)" onPress={pickFile} />
//       <Spacer />
//       <Button title="Update Book" onPress={handleSubmit} />
//     </ThemeView>
//   );
// }

// const styles = StyleSheet.create({
//   heading: { fontSize: 22, fontWeight: "bold" },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 6,
//     padding: 8,
//     marginBottom: 12,
//   },
// });



import React, { useState } from "react";
import { View, Alert, StyleSheet, TouchableWithoutFeedback, Keyboard } from "react-native";
import ThemeView from "../../component/ThemeView";
import ThemeText from "../../component/ThemeText";
import ThemeButton from "../../component/ThemeButton";
import Spacer from "../../component/Spacer";
import InputTheme from "../../component/InputTheme";
import * as DocumentPicker from "expo-document-picker";
import { useBook } from "../../hook/useBook";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function UpdateBook() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const book = JSON.parse(params.book);

  const { updateBook } = useBook();

  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [description, setDescription] = useState(book.description || "");
  const [file, setFile] = useState(null);

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({});
    if (!result.canceled) setFile(result.assets ? result.assets[0] : result);
  };

  const handleSubmit = async () => {
    try {
      await updateBook(book._id, { title, author, description, file });
      Alert.alert("Success", "Book updated successfully");
      router.push("/book");
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemeView style={styles.container} safe={true}>

        {/* Card */}
        <View style={styles.card}>

          {/* Header */}
          <View style={styles.header}>
            <Ionicons name="arrow-back" size={22} color="#fff" onPress={() => router.back()} />
            <ThemeText style={styles.headerTitle}>Update Book</ThemeText>
            <View style={{ width: 22 }} /> 
          </View>

          <Spacer height={20} />

          {/* Inputs */}
          <InputTheme placeholder="Title" value={title} onChangeText={setTitle} />
          <Spacer />
          <InputTheme placeholder="Author" value={author} onChangeText={setAuthor} />
          <Spacer />
          <InputTheme
            placeholder="Description (optional)"
            value={description}
            onChangeText={setDescription}
            multiline
            style={{ height: "25%" }}
          />
          <Spacer />

          {/* File picker */}
          <ThemeButton
            onPress={pickFile}
            style={{ width: "90%", marginLeft: "auto", marginRight: "auto" }}
          >
            <ThemeText>{file ? file.name : "Pick New File (optional)"}</ThemeText>
          </ThemeButton>

          <Spacer height={16} />

          {/* Submit button */}

        </View>
          <Spacer height={16} />
          <ThemeButton onPress={handleSubmit} style={{ alignItems: "center" }}>
            <ThemeText>Update Book</ThemeText>
          </ThemeButton>

      </ThemeView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  card: {
    width: "90%",
    paddingVertical: 28,
    paddingHorizontal: 20,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
});

