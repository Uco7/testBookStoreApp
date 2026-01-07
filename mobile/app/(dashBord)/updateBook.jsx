


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
  const [fileLink, setFileLink] = useState(book.fileLink || "");


  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author|| "");
  const [description, setDescription] = useState(book.description || "");
  const [file, setFile] = useState(null);

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({});
    if (!result.canceled) setFile(result.assets ? result.assets[0] : result);
  };

  const handleSubmit = async () => {
   if (!title.trim()) return Alert.alert("Validation", "Title is required");

  try {
    await updateBook(book._id, { title, author, description, file, fileLink });
    Alert.alert("Success", " updated successfully");
    router.replace("/book");
  } catch (err) {
    Alert.alert("Error", err.response?.data?.message || err.message);
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
           {/* <Spacer /> */}

            <ThemeText style={{ fontSize: 14, color: "#b0a1a1ff", textAlign: "center", marginVertical: 10 }}>Or paste file link below (optional)</ThemeText>
           <Spacer />
          
              <InputTheme
                placeholder="Paste File/Doc Link(optional)"
                value={fileLink}
                onChangeText={setFileLink}
              />

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

