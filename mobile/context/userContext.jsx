// import { registerForPushNotificationsAsync } from "../utils/notifications";

import { createContext, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {backendUrl_ngrok,backendDomainUrl} from "../utils/config/appUrl"
import { syncPushToken } from "../utils/syncPushToken";


import axios from "axios";

// const APP_URL ="https://0e22-102-90-96-16.ngrok-free.app";
const APPURL =backendDomainUrl
// const APP_URL ="https://testbookstoreapp-backend-my8t.onrender.com";
const API_TIMEOUT = 10000;

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const abortController = useRef(null);

  const api = axios.create({
    baseURL: APPURL,
    timeout: API_TIMEOUT,
    headers: { "Content-Type": "application/json" },
  });

  const getToken = async () => await AsyncStorage.getItem("token");

  /* ---------- REGISTRATION FLOW ---------- */

  // Step 1: Request OTP
  async function requestRegistrationOTP({ username, fullName, email, password }) {
    try {
      const res = await api.post("/api/v1/auth/register/request", {
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
      const res = await api.post("/api/v1/auth/register", {
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

   /* ---------- LOGIN ---------- */

  const getErrorMessage = (err) => {
    if (!err) return "Something went wrong";

    if (err.message === "Network Error") {
      return "Connection failed. Please check your internet.";
    }

    if (err.response) {
      return (
        err.response.data?.message ||
        err.response.data?.msg ||
        "Request failed"
      );
    }

    if (err.request) {
      return "Server not responding. Try again later.";
    }

    return "Something went wrong";
  };

  async function login(identifier, password) {
    try {
      const res = await api.post("/api/v1/auth/login", {
        identifier,
        password,
      });

      const authToken = res.data.token;

      await AsyncStorage.setItem("token", authToken);

      // ✔ STEP 1: FETCH USER FIRST
      await fetchUser();

      // ✔ STEP 2: PUSH TOKEN (SAFE + SEPARATE — never blocks login)
      try {
        const pushToken = await registerForPushNotificationsAsync();
        console.log("Push Token:", pushToken);

        if (pushToken) {
          await syncPushToken(pushToken);
        }
      } catch (pushErr) {
        console.log("Push registration skipped:", pushErr.message);
      }

      // ✔ STEP 3: OPTIONAL TEST (ONLY DEV MODE)
      if (__DEV__) {
        try {
          await api.post(
            "/api/v1/auth/test-notification",
            {},
            {
              headers: { Authorization: `Bearer ${authToken}` },
            }
          );
        } catch (testErr) {
          console.log("Test notification skipped:", testErr.message);
        }
      }

    } catch (err) {
      const message = getErrorMessage(err);
      console.log("Login Error:", message);
      throw new Error(message);
    }
  }


//   const getErrorMessage = (err) => {
//   if (!err) return "Something went wrong";

//   if (err.message === "Network Error") {
//     return "Connection failed. Please check your internet.";
//   }

//   if (err.response) {
//     return (
//       err.response.data?.message ||
//       err.response.data?.msg ||
//       "Request failed"
//     );
//   }

//   if (err.request) {
//     return "Server not responding. Try again later.";
//   }

//   return "Something went wrong";
// };

// async function login(identifier, password) {
//   try {
//     const res = await api.post("/api/v1/auth/login", {
//       identifier,
//       password,
//     });

//     const authToken = res.data.token;

//     await AsyncStorage.setItem("token", authToken);

//     // ✔ STEP 1: FETCH USER FIRST
//     await fetchUser();

//     // ✔ STEP 2: PUSH TOKEN (SAFE + SEPARATE)
//     const pushToken = await getExpoPushToken();

//     console.log("Push Token:", pushToken);

//     if (pushToken) {
//       await syncPushToken(pushToken);
//     }

//     // ✔ STEP 3: OPTIONAL TEST (ONLY DEV MODE)
//     if (__DEV__) {
//       await api.post(
//         "/api/v1/auth/test-notification",
//         {},
//         {
//           headers: { Authorization: `Bearer ${authToken}` },
//         }
//       );
//     }

//   } catch (err) {
//   const message = getErrorMessage(err);
//   console.log("Login Error:", message);
//   throw new Error(message);
// }
// }

  async function logOut()  {
      try {
        const token = await getToken();
  
        // Tell the backend first, while we still have a token to send —
        // this flips activityStatus.isOnline back to false server-side.
        if (token) {
          await api.post(
            "/api/v1/auth/logout",
            {},
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        }
      } catch (err) {
        // Don't block local logout on this. No internet, server down, or an
        // already-expired token should still let the user log out on-device.
        console.log("Logout Error:", err.response?.data || err.message);
      } finally {
        await AsyncStorage.removeItem("token");
        setUser(null);
        setAuthReady(true);
      }
    }
  

async function fetchUser() {
  try {
    const token = await getToken();

    if (!token) {
      setUser(null);
      setAuthReady(true);
      return;
    }

    const res = await api.get("/api/v1/auth/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setUser(res.data);
  } catch (err) {
    const isNetworkError = err.message === "Network Error";
    const isTimeout = err.code === "ECONNABORTED";

    console.log("Fetch User Error:", err.message);

    // ✅ CASE 1: OFFLINE → DO NOTHING (VERY IMPORTANT)
    if (isNetworkError || isTimeout) {
      setAuthReady(true);
      return;
    }

    // ❌ CASE 2: TOKEN INVALID → LOGOUT
    if (err.response?.status === 401) {
      await AsyncStorage.removeItem("token");
      setUser(null);
    }

    // ❌ CASE 3: OTHER ERRORS → DO NOT LOGOUT
  } finally {
    setAuthReady(true);
  }
}

  /* ---------- PASSWORD RECOVERY ---------- */

  async function forgotPassword(identifier) {
    try {
      const res = await api.post("/api/v1/auth/forgot-password", { identifier });
      return res.data;
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Failed to send reset code"
      );
    }
  }

  async function resetPassword(identifier, otp, password) {
    try {
      const res = await api.post("/api/v1/auth/reset-password", {
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



