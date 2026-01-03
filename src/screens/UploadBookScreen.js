import { Button } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import axios from "../api/axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function UploadBookScreen(){
  const {token} = useContext(AuthContext);

  const upload = async ()=>{
    const file = await DocumentPicker.getDocumentAsync();
    const form = new FormData();
    form.append("title", file.name);
    form.append("file",{
      uri:file.uri,
      name:file.name,
      type:file.mimeType
    });

    await axios.post("/books",form,{
      headers:{
        Authorization:`Bearer ${token}`,
        "Content-Type":"multipart/form-data"
      }
    });
  };

  return <Button title="Upload Book" onPress={upload}/>;
}
