

import {
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  View,
  StyleSheet,
  Pressable
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
import KeyBordAvoidingComponent from "../../component/KeyBordAvoidingComponent";
import CardTheme from "../../component/CardTheme";
import { validateBookInput } from "../../utils/bookValidator";

export default function Create() {
  const [selectedType, setSelectedType] = useState("doc"); // default type
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [fileLink, setFileLink] = useState("");
  const [status, setStatus] = useState("idle"); // idle | uploading | error
  

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
    const cardTitle=()=>{
      if(selectedType==="reading") return "Add Reading Material";
      if(selectedType==="link") return "Add New Link";
      return "Add Document";
    }
  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
    });
    if (!result.canceled) setFile(result.assets[0]);
    console.log("File picked:", result);
  };

  const handleSubmit = async () => {

  
    const validationError = validateBookInput({ title, author, description, file, fileLink, selectedType });
    if (validationError) {
      return Alert.alert("Validation Error", validationError);
    }
if (status !== "idle") return; // Prevent double submission
    setStatus("saving...");
    try {
      const ok = await createBook({
        title,
        author: selectedType !== "link" ? author : undefined,
        description,
        file: selectedType !== "link" ? file : undefined,
        fileLink: selectedType === "link" ? fileLink : undefined,
      });

      if (!ok) throw new Error(" upload failed");
      setStatus("saved");
      setTimeout(() => {

      setTitle("");
      setAuthor("");
      setDescription("");
      setFile(null);
      setFileLink("");
      setStatus("idle");
      router.replace("/book");
      }, 1500);
    } catch (err) {
      setStatus("idle");
      Alert.alert( err.response?.data?.message || err.message || "An error occurred while saving the book");
    }
  };

  const renderButtonText = () => {
  if (status === "saving...") return "Saving...";
  if (status === "saved") return "Upload complete 🎉";
  return "Save ";
};
const shortenFileName = (name, maxLength = 20) => {
  if(!name) return "";
  if(name.length <= maxLength) return name;
  const fileExt=name.split(".").pop();
  const baseName=name.substring(0,maxLength-fileExt.length-4);
  return `${baseName}...${fileExt}`;

}

  return (
      <KeyBordAvoidingComponent>
         <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>

      <ThemeView style={styles.container} safe={true}>

        {/* Type Selector Buttons */}
        <View style={styles.row}>
          <ThemeButton
            onPress={() => setSelectedType("reading")}
            style={[styles.typeBtn,  selectedType === "reading" && styles.typeBtnActive]}
          >
            <View style={styles.btnContent}>
              <Ionicons name="book-outline" size={16} color="#fff" />
              <ThemeText style={styles.btnText}>Reading Book/Docs</ThemeText>
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
              <ThemeText style={styles.btnText}>File/Doc</ThemeText>
            </View>
          </ThemeButton>
        </View>

        <Spacer />

        {/* Input Card */}
        <CardTheme style={styles.card}>
          <View style={styles.header}>
            <Ionicons name="arrow-back" size={22} color="#fff" onPress={() => router.back()} />
            <ThemeText style={styles.headerTitle}>
              {cardTitle()}
          
           </ThemeText>
            <View style={{ width: 22 }} />
          </View>

          <Spacer height={20} />

          {/* Common Inputs */}
          <InputTheme
            placeholder="File Name/Title"
            value={title}
            onChangeText={setTitle}
          />
          <Spacer />


          {(selectedType === "doc" || selectedType === "reading" ) && (
            <>
              <InputTheme
                placeholder="Author Name(owner name)"
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
                <ThemeText style={{color:"#fff"}}>{file ?shortenFileName(file.name) : "Pick File"}</ThemeText>
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
        </CardTheme>

        <Spacer height={16} />

      <ThemeButton 
  onPress={handleSubmit} 
  style={{ 
    alignItems: "center",
    // Button turns Gray when saving, Green when saved
    backgroundColor: status === "saved" ? "#10b981" : status === "saving" ? "#64748b" : colors.primary 
  }}
  disabled={status !== "idle"}
>
  <ThemeText style={{ color: "#fff", fontWeight: '600' }}>
    {renderButtonText()}
  </ThemeText>
</ThemeButton>

      </ThemeView>
      </Pressable>
                </KeyBordAvoidingComponent>
  
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // <--- Add this to ensure it fills the screen
    width: '100%',
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    // width: "90%",
    // height: "70%",
    paddingVertical: 28,
    paddingHorizontal: 20,
    borderRadius: 26,
    // backgroundColor: "rgba(255,255,255,0.05)",
    // borderWidth: 1,
    // borderColor: "rgba(255,255,255,0.15)",
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
