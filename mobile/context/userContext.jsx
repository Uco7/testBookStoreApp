import { createContext, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const APP_URL ="https://testbookstoreapp.onrender.com";
// const APP_URL ="https://b318-102-90-103-207.ngrok-free.app";
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
      const res = await api.post("/register/request", {
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
      const res = await api.post("/register", {
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
      const res = await api.post("/login", {
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

      const res = await api.get("/user", {
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
      const res = await api.post("/forgot-password", { identifier });
      return res.data;
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Failed to send reset code"
      );
    }
  }

  async function resetPassword(identifier, otp, password) {
    try {
      const res = await api.post("/reset-password", {
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





// import { createContext, useEffect, useRef, useState } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";

// // Update this to your local IP or production URL
// // const APPURL = "http://192.168.177.20:5000";
// // const APPURL = "https://testbookstoreapp.onrender.com";
// const APPURL ="https://35ff-102-90-97-101.ngrok-free.app";

// const API_TIMEOUT = 10000;

// export const UserContext = createContext();

// export function UserProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [authReady, setAuthReady] = useState(false);
//   const abortController = useRef(null);
//   console.log("UserContext initialized with APPURL:", APPURL);

//   const api = axios.create({
//     baseURL: APPURL,
//     timeout: API_TIMEOUT,
//     headers: { "Content-Type": "application/json" },
//   });

//   const getToken = () => AsyncStorage.getItem("token");

//   /* ---------- REGISTER (NO OTP) ---------- */
//   async function register({ username, fullName, email, password }) {
//     console.log("Registering user:", { username, fullName, email });
//     try {
//       const res = await api.post("/register", {
//         username,
//         fullName,
//         email,
//         password,
//       });

//       return res.data;
//     } catch (err) {
//       console.log("Register Error:", err.response?.data || err.message);
//           throw err; // ✅ PRESERVE AXIOS ERROR

//     }
//   }

//   /* ---------- LOGIN ---------- */
//   async function login(identifier, password) {
//     try {
//       const res = await api.post("/login", { identifier, password });
      

//       if (!res.data?.token) {
//         throw new Error("Invalid login response");
//       }

//       await AsyncStorage.setItem("token", res.data.token);
//       await fetchUser();

//       return res.data;
//     } catch (err) {
//       console.log("Login Error:", err.response?.data || err.message);
//           throw err; // ✅ PRESERVE AXIOS ERROR

//     }
//   }

//   /* ---------- FETCH USER ---------- */
//   async function fetchUser() {
//     try {
//       const token = await getToken();

//       if (!token) {
//         setUser(null);
//         return;
//       }

//       const res = await api.get("/user", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setUser(res.data);
//     } catch (err) {
//       console.warn("Fetch User Error:", err.response?.data || err.message);
//       await AsyncStorage.removeItem("token");
//       setUser(null);
//     } finally {
//       setAuthReady(true);
//     }
//   }

//   /* ---------- LOGOUT ---------- */
//   async function logOut() {
//     try {
//       await AsyncStorage.removeItem("token");
//       setUser(null);
//       setAuthReady(true);
//     } catch (err) {
//       console.log("Logout Error:", err.message);
//     }
//   }

//   /* ---------- INIT ---------- */
//   useEffect(() => {
//     fetchUser();
//     return () => abortController.current?.abort();
//   }, []);

//   return (
//     <UserContext.Provider
//       value={{
//         user,
//         authReady,
//         register,
//         login,
//         logOut,
//       }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// }
