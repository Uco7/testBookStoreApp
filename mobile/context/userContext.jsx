
  


import { createContext, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const APP_URL = "http://192.168.1.202:5000";
const API_TIMEOUT = 10000;

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const abortController = useRef(null);

  const api = axios.create({
    baseURL: APP_URL,
    timeout: API_TIMEOUT,
    headers: { "Content-Type": "application/json" },
  });

  const getToken = () => AsyncStorage.getItem("token");

  async function register({ username, fullName, email, password }) {
    try {
      const res = await api.post("/register", { username, fullName, email, password });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Registration failed");
    }
  }

  async function login(identifier, password) {
    try {
      const res = await api.post("/login", { identifier, password });
      await AsyncStorage.setItem("token", res.data.token);
      await fetchUser();
    } catch (err) {
      throw new Error(err.response?.data?.msg || "Login failed");
    }
  }

  async function fetchUser() {
    try {
      const token = await getToken();
      if (!token) {
        setAuthReady(true);
        return;
      }

      const res = await api.get("/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
    } catch (err) {
      console.warn("Fetch user error:", err.message);
      await AsyncStorage.removeItem("token");
      setUser(null);
    } finally {
      setAuthReady(true);
    }
  }

  async function logOut() {
    await AsyncStorage.removeItem("token");
    setUser(null);
    setAuthReady(false);
  }

  useEffect(() => {
    fetchUser();
    return () => abortController.current?.abort();
  }, []);

  return (
    <UserContext.Provider value={{ user, authReady, login, register, logOut }}>
      {children}
    </UserContext.Provider>
  );
}
