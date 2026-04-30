import { createContext, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// const APP_URL ="https://70c2-102-90-101-64.ngrok-free.app";
const APP_URL ="https://testbookstoreapp-backend-my8t.onrender.com";
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

  const getToken = async () => await AsyncStorage.getItem("token");

  /* ---------- REGISTRATION FLOW ---------- */

  // Step 1: Request OTP
  async function requestRegistrationOTP({ username, fullName, email, password }) {
    try {
      const res = await api.post("/api/auth/register/request", {
        username,
        fullName,
        email,
        password,
      });

      return res.data;
    } catch (err) {
      console.log("OTP Request Error:", err.response?.data || err.message);
      throw new Error(err.response?.data?.message || "OTP request failed");
    }
  }

  // Step 2: Verify OTP
  async function verifyAndFinalizeRegister(email, otp) {
    try {
      const res = await api.post("/api/auth/register", {
        email,
        otp,
      });

      return res.data;
    } catch (err) {
      console.log("Verification Error:", err.response?.data || err.message);
      throw new Error(err.response?.data?.message || "Verification failed");
    }
  }

  /* ---------- LOGIN ---------- */

  async function login(identifier, password) {
    try {
      const res = await api.post("/api/auth/login", {
        identifier,
        password,
      });

      await AsyncStorage.setItem("token", res.data.token);
      await fetchUser();
    } catch (err) {
      console.log("Login Error:", err.response?.data || err.message);
      throw new Error(err.response?.data?.msg || "Login failed");
    }
  }

  /* ---------- FETCH USER ---------- */

  async function fetchUser() {
    try {
      const token = await getToken();

      if (!token) {
        setUser(null);
        setAuthReady(true);
        return;
      }

      const res = await api.get("/api/auth/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data);
    } catch (err) {
      console.log("Fetch User Error:", err.response?.data || err.message);
      await AsyncStorage.removeItem("token");
      setUser(null);
    } finally {
      setAuthReady(true);
    }
  }

  /* ---------- LOGOUT ---------- */

  async function logOut() {
    await AsyncStorage.removeItem("token");
    setUser(null);
    setAuthReady(true);
  }

  /* ---------- PASSWORD RECOVERY ---------- */

  async function forgotPassword(identifier) {
    try {
      const res = await api.post("/api/auth/forgot-password", { identifier });
      return res.data;
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Failed to send reset code"
      );
    }
  }

  async function resetPassword(identifier, otp, password) {
    try {
      const res = await api.post("/api/auth/reset-password", {
        identifier,
        otp,
        password,
      });
      console.log("Reset Password Response:", res.data);
      return res.data;
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Reset failed. Invalid or expired code."
      );
    }
  }

  /* ---------- INIT ---------- */

  useEffect(() => {
    fetchUser();
    return () => abortController.current?.abort();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        authReady,
        login,
        requestRegistrationOTP,
        verifyAndFinalizeRegister,
        logOut,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}



