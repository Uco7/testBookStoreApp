import { createContext,useState,useEffect } from "react";
import * as SecureStore from "expo-secure-store";

export const AuthContext = createContext();

export function AuthProvider({children}){
  const [token,setToken] = useState(null);

  useEffect(()=>{
    SecureStore.getItemAsync("token").then(setToken);
  },[]);

  return (
    <AuthContext.Provider value={{token,setToken}}>
      {children}
    </AuthContext.Provider>
  );
}
