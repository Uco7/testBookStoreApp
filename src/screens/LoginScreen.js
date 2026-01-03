import { useContext,useState } from "react";
import { View,TextInput,Button } from "react-native";
import axios from "../api/axios";
import * as SecureStore from "expo-secure-store";
import { AuthContext } from "../context/AuthContext";

export default function LoginScreen(){
  const {setToken} = useContext(AuthContext);
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");

  const login = async ()=>{
    const res = await axios.post("/auth/login",{email,password});
    await SecureStore.setItemAsync("token",res.data.token);
    setToken(res.data.token);
  };

  return (
    <View>
      <TextInput placeholder="Email" onChangeText={setEmail}/>
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword}/>
      <Button title="Login" onPress={login}/>
    </View>
  );
}
