// import { Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
// import React, { useState } from 'react'
// import ThemeView from '../../component/ThemeView'
// import ThemeText from '../../component/ThemeText'
// import { Link } from 'expo-router'
// import ThemeButton from '../../component/ThemeButton'
// import Spacer from '../../component/Spacer'
// import InputTheme from '../../component/InputTheme'


// const Create = () => {
//   const [authorName, setAuthorName]=useState("")
//   const [bookTile, setBookTile]=useState("")
//   const [bookDescription, setBookDescription]=useState("")
//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss} >

//     <ThemeView>
//         <ThemeText>Booke Creation Page</ThemeText>
//          <Spacer/>
//          <InputTheme placeholder="user Email"
//       style={{width:"80%"}}
//       keyboardType="email"
//       autoCapitalize="none"
//       onChangeText={setBookTile}
//       value={bookTile}
      
//       />
//       <Spacer/>
//       <InputTheme placeholder="user password"
//       style={{width:"80%"}}
//       keyboardType="password"
//       autoCapitalize="none"
//       onChangeText={setAuthorName}
//       value={authorName}
      
//       />
//       <Spacer/>
//       <InputTheme placeholder="Enter Book Description"
//       style={{width:"80%",height:"20%"}}
//       keyboardType="description"
//       autoCapitalize="none"
//       onChangeText={setBookDescription}
//       value={bookDescription}
      
//       />
//       <Spacer/>
//         <ThemeButton><ThemeText>Create </ThemeText></ThemeButton>
//       <Spacer/>
//         <ThemeText><Link href="/profile">Back To Profile</Link></ThemeText>

//     </ThemeView>
//       </TouchableWithoutFeedback>
  
//   )
// }

// export default Create

// const styles = StyleSheet.create({})


import {
  Keyboard,
  TouchableWithoutFeedback,
  Alert
} from "react-native";
import React, { useState } from "react";
import ThemeView from "../../component/ThemeView";
import ThemeText from "../../component/ThemeText";
import ThemeButton from "../../component/ThemeButton";
import Spacer from "../../component/Spacer";
import InputTheme from "../../component/InputTheme";
import * as DocumentPicker from "expo-document-picker";
import { useBook } from "../../hook/useBook";
import { useRouter } from "expo-router";

import { useFocusEffect } from "expo-router";
import { useCallback } from "react";


export default function Create() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const { createBook } = useBook();
  const router = useRouter();
useFocusEffect(
  useCallback(() => {
    setTitle("");
    setAuthor("");
    setDescription("");
    setFile(null);
  }, [])
);

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({});
    if (!result.canceled) setFile(result.assets[0]);
  };

  const handleSubmit = async () => {
    if (!title || !author || !file) {
      return Alert.alert("Error", "Title, Author and File required");
    }

    try {
      const ok = await createBook({ title, author, description, file });
     if(!ok) throw new Error("Book creation failed");
     console.log("Book created successfully",ok);
     setTitle("");
      setAuthor("");  
      setDescription("");
      setFile(null);
      router.replace("/book");
    } catch (err) {
      Alert.alert("Upload Failed", err.message || "Try again");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemeView>
        <ThemeText>Book Creation</ThemeText>
        <Spacer />

        <InputTheme placeholder="Book Title" value={title} onChangeText={setTitle} />
        <Spacer />

        <InputTheme placeholder="Author Name" value={author} onChangeText={setAuthor} />
        <Spacer />

        <InputTheme
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <Spacer />

        <ThemeButton onPress={pickFile}>
          <ThemeText>{file ? file.name : "Pick File"}</ThemeText>
        </ThemeButton>

        <Spacer />

        <ThemeButton onPress={handleSubmit}>
          <ThemeText>Upload Book</ThemeText>
        </ThemeButton>
      </ThemeView>
    </TouchableWithoutFeedback>
  );
}
