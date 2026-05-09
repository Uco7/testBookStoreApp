import { registerForPushNotificationsAsync } from "../utils/notifications";
import { createContext, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const APP_URL ="https://0e22-102-90-96-16.ngrok-free.app";
// const APP_URL ="https://testbookstoreapp-backend-my8t.onrender.com";
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
      let message = "Something went wrong.";

    if (err.message === "Network Error") {
      message = "No internet connection. Please check your network.";
    } else if (err.response) {
      message = err.response.data?.message || "Request failed. Please try again.";
    } else if (err.request) {
      message = "Server is not responding. Try again later.";
    }

    console.log("OTP Request Error:", message);

    throw new Error(message);
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
    // const token = await registerForPushNotificationsAsync();
      const res = await api.post("/api/auth/login", {
        identifier,
        password,
      });
      try {
        
      const authToken = res.data.token;
      await AsyncStorage.setItem("token", authToken);
      const pushToken = await registerForPushNotificationsAsync();
      console.log("Obtained Push Token:", pushToken);

    if (pushToken) {
      await api.post(
        "/api/auth/save-push-token",
        { token: pushToken },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
    }


    await api.post(
  "/api/auth/test-notification",
  {},
  {
    headers: { Authorization: `Bearer ${authToken}` },
  }
);

      } catch (error) {
        console.log("Push Token Error:", error.message);
        
      }
      
      await fetchUser();
    } catch (err) {
      
      let errorMessage = "Something went wrong";

    if (err.message === "Network Error") {
      errorMessage =
        "Connection failed. Please check your internet.";
    } 
    else if (err.response) {
      errorMessage =
        err.response.data?.message ||
        err.response.data?.msg ||
        "Login failed , Server is unreachable. Try again later";
    } 
    else if (err.request) {
      errorMessage =
        "Server not responding. Try again later.";
    }

    console.log("Login Error:", errorMessage);

    // ✅ IMPORTANT: pass STRING only
    throw new Error(errorMessage);
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



