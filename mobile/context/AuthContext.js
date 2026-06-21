import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    isAuthenticated: false,
    mode: "offline", // offline | online
    loading: true,
  });

  const validateToken = async (token) => {
    try {
      // OPTIONAL: call backend
      // const res = await fetch(APP_URL + "/auth/validate", {
      //   headers: { Authorization: `Bearer ${token}` },
      // });

      // return res.status === 200;

      return !!token; // simple fallback
    } catch (err) {
      return false;
    }
  };

  const initAuth = async () => {
    const token = await AsyncStorage.getItem("accessToken");

    if (!token) {
      setAuthState({
        token: null,
        isAuthenticated: false,
        mode: "offline",
        loading: false,
      });
      return;
    }

    const isValid = await validateToken(token);

    if (!isValid) {
      await AsyncStorage.removeItem("accessToken");

      setAuthState({
        token: null,
        isAuthenticated: false,
        mode: "offline",
        loading: false,
      });

      return;
    }

    setAuthState({
      token,
      isAuthenticated: true,
      mode: "online",
      loading: false,
    });
  };

  useEffect(() => {
    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};