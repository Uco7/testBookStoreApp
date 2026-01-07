import {
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  View,
  StyleSheet
} from "react-native";
import React, { useState, useCallback } from "react";
import ThemeView from "../../component/ThemeView";
import ThemeText from "../../component/ThemeText";
import ThemeButton from "../../component/ThemeButton";
import Spacer from "../../component/Spacer";
import InputTheme from "../../component/InputTheme";
import * as DocumentPicker from "expo-document-picker";
import { useBook } from "../../hook/useBook";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../constant/colors";

export default function Create() {
  const [selectedType, setSelectedType] = useState("doc"); // default type
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [fileLink, setFileLink] = useState("");

  const { createBook } = useBook();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      setTitle("");
      setAuthor("");
      setDescription("");
      setFile(null);
      setFileLink("");
    }, [])
  );

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({});
    if (!result.canceled) setFile(result.assets[0]);
  };

  const handleSubmit = async () => {
    if (!title || ((selectedType === "doc" || selectedType === "reading") && !file)) {
      return Alert.alert("Error", "Title and File required for this type");
    }
    if ((selectedType === "doc" || selectedType === "reading") && !author) {
      return Alert.alert("Error", "Author required for this type");
    }
    if (selectedType === "link" && !fileLink) {
      return Alert.alert("Error", "Link required for this type");
    }

    try {
      const ok = await createBook({
        title,
        author: selectedType !== "link" ? author : undefined,
        description,
        file: selectedType !== "link" ? file : undefined,
        fileLink: selectedType === "link" ? fileLink : undefined,
      });

      if (!ok) throw new Error("Book creation failed");

      setTitle("");
      setAuthor("");
      setDescription("");
      setFile(null);
      setFileLink("");
      router.replace("/book");
    } catch (err) {
      Alert.alert("Upload Failed", err.message || "Try again");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemeView style={styles.container} safe={true}>

        {/* Type Selector Buttons */}
        <View style={styles.row}>
          <ThemeButton
            onPress={() => setSelectedType("reading")}
            style={[styles.typeBtn,  selectedType === "reading" && styles.typeBtnActive]}
          >
            <View style={styles.btnContent}>
              <Ionicons name="book-outline" size={16} color="#fff" />
              <ThemeText style={styles.btnText}>Reading Book</ThemeText>
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

        <Spacer />

        {/* Input Card */}
        <View style={styles.card}>
          <View style={styles.header}>
            <Ionicons name="arrow-back" size={22} color="#fff" onPress={() => router.back()} />
            <ThemeText style={styles.headerTitle}>Add New Book</ThemeText>
            <View style={{ width: 22 }} />
          </View>

          <Spacer height={20} />

          {/* Common Inputs */}
          <InputTheme
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
          <Spacer />

          {(selectedType === "doc" || selectedType === "reading") && (
            <>
              <InputTheme
                placeholder="Author Name(optional)"
                value={author}
                onChangeText={setAuthor}
              />
              <Spacer />
              <InputTheme
                placeholder="Description (optional)"
                value={description}
                onChangeText={setDescription}
                multiline
                style={{ height: "30%" }}
              />
              <Spacer />
              <ThemeButton
                onPress={pickFile}
                style={{ width: "80%", marginLeft: "auto", marginRight: "auto" }}
              >
                <ThemeText>{file ? file.name : "Pick File"}</ThemeText>
              </ThemeButton>
            </>
          )}

          {selectedType === "link" && (
            <>
              <InputTheme
                placeholder="Description (optional)"
                value={description}
                onChangeText={setDescription}
                multiline
                style={{ height: "30%" }}
              />
              <Spacer />
              <InputTheme
                placeholder="Paste File/Doc Link"
                value={fileLink}
                onChangeText={setFileLink}
              />
            </>
          )}
        </View>

        <Spacer height={16} />

        <ThemeButton onPress={handleSubmit} style={{ alignItems: "center" }}>
          <ThemeText>Save Book</ThemeText>
        </ThemeButton>

      </ThemeView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "90%",
    height: "70%",
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
  },
  row: {
    width: "90%",
    flexDirection: "row",
    gap: 10,
    // overflow: "hidden",
    // marginVertical: 10,
    // marginHorizontal: 20,
    marginTop: 40,
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
});
