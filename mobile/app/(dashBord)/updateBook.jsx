import { useState } from "react";
import { View, TextInput, Button, Alert, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import ThemeView from "../../component/ThemeView";
import ThemeText from "../../component/ThemeText";
import Spacer from "../../component/Spacer";
import { useBook } from "../../hook/useBook";
import * as DocumentPicker from "expo-document-picker";

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
    if (!result.canceled) setFile(result);
  };

  const handleSubmit = async () => {
    try {
      await updateBook(book._id, { title, author, description, file });
      Alert.alert("Book updated successfully");
      router.push("/book");
    } catch (err) {
      Alert.alert("Error updating book", err.message);
    }
  };

  return (
    <ThemeView style={{ flex: 1, padding: 12 }}>
      <ThemeText style={styles.heading}>Update Book</ThemeText>
      <Spacer />

      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Author"
        value={author}
        onChangeText={setAuthor}
      />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Description"
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <Button title="Pick New File (optional)" onPress={pickFile} />
      <Spacer />
      <Button title="Update Book" onPress={handleSubmit} />
    </ThemeView>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 22, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
  },
});
