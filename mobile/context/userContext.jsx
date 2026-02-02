
  


// import { createContext, useEffect, useRef, useState } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";

// // let APPURl="https://testbookstoreapp.onrender.com";
// const APPURl = "http://192.168.93.202:5000";

// const API_TIMEOUT = 10000;

// export const UserContext = createContext();

// export function UserProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [authReady, setAuthReady] = useState(false);
//   const abortController = useRef(null);

//   const api = axios.create({
//     baseURL: APPURl,
//     timeout: API_TIMEOUT,
//     headers: { "Content-Type": "application/json" },
//   });

//   const getToken = () => AsyncStorage.getItem("token");

//   async function register({ username, fullName, email, password }) {
//     try {
//       const res = await api.post("/register", { username, fullName, email, password });
//             console.log("register:",res)

//       return res.data;
//     } catch (err) {
//             console.log("register:",err)
//             // console.log("register:",err.response?.data?.message || "Registration failed")

// // throw new Error(err.response?.data?.message || "Registration failed");    }
//        throw err  

// }
// }

//   async function login(identifier, password) {
//     try {
//       const res = await api.post("/login", { identifier, password });
//       console.log("res:",res)
//       await AsyncStorage.setItem("token", res.data.token);
//       await fetchUser();
//     } catch (err) {
//       // throw new Error(err.res?.data?.msg || "Login failed"||"poor Network: check your networkconnection");
//            throw err  

//     }
//   }
// async function fetchUser() {
//   try {
//     const token = await getToken();

//     if (!token) {
//       setUser(null);
//       return;
//     }

//     const res = await api.get("/user", {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     setUser(res.data);
//   } catch (err) {
//     console.warn("Fetch user error:", err.message);
//     await AsyncStorage.removeItem("token");
//     setUser(null);
//   } finally {
//     setAuthReady(true);
//   }
// }

//   async function logOut() {
//     await AsyncStorage.removeItem("token");
//     setUser(null);
//     setAuthReady(true);
//   }
//  // Step 1: Send the identifier (email/user) to get the code
// async function forgotPassword(identifier) {
//   try {
//     const res = await api.post("/forgot-password", { identifier });
//     return res.data;
//   } catch (err) {
//     throw new Error(err.response?.data?.message || "Failed to send code");
//   }
// }

// // Step 2: Send the identifier + otp + new password
// async function resetPassword(identifier, otp, password) {
//   try {
//     // We send identifier so the backend knows WHICH user's OTP to check
//     const res = await api.post("/reset-password", { identifier, otp, password });
//     return res.data;
//   } catch (err) {
//     throw new Error(err.response?.data?.message || "Reset failed. Check your code.");
//   }
// }

//   useEffect(() => {
//     fetchUser();
//     return () => abortController.current?.abort();
//   }, []);

//   return (
//     <UserContext.Provider value={{ user, authReady, login, register, logOut,forgotPassword,resetPassword }}>
//       {children}
//     </UserContext.Provider>
//   );
// }


import { createContext, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Update this to your local IP or production URL
const APPURl = "http://192.168.150.202:5000";
const API_TIMEOUT = 10000;

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const abortController = useRef(null);

  const api = axios.create({
    baseURL: APPURl,
    timeout: API_TIMEOUT,
    headers: { "Content-Type": "application/json" },
  });

  const getToken = () => AsyncStorage.getItem("token");

  /* ---------- NEW REGISTRATION FLOW ---------- */

  // Step 1: Send user details and trigger OTP email
  async function requestRegistrationOTP({ username, fullName, email, password }) {
    try {
      const res = await api.post("/register/request", { 
        username, 
        fullName, 
        email, 
        password 
      });
      return res.data;
    } catch (err) {
      console.log("OTP Request Error:", err.response?.data || err.message);
      throw err;
    }
  }

  // Step 2: Verify the OTP and finalize the account creation
  async function verifyAndFinalizeRegister(email, otp) {
    try {
      const res = await api.post("/register", { email, otp });
      // Note: If your backend returns a token immediately after verification, 
      // you can log them in here. Otherwise, they go to login screen.
      return res.data;
    } catch (err) {
      console.log("Verification Error:", err.response?.data || err.message);
      throw err;
    }
  }

  /* ---------- LOGIN & SESSION ---------- */

  async function login(identifier, password) {
    try {
      const res = await api.post("/login", { identifier, password });
      await AsyncStorage.setItem("token", res.data.token);
      await fetchUser();
    } catch (err) {
      throw err;
    }
  }

  async function fetchUser() {
    try {
      const token = await getToken();
      if (!token) {
        setUser(null);
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
    setAuthReady(true);
  }

  /* ---------- PASSWORD RECOVERY ---------- */

  async function forgotPassword(identifier) {
    try {
      const res = await api.post("/forgot-password", { identifier });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to send code");
    }
  }

  async function resetPassword(identifier, otp, password) {
    try {
      const res = await api.post("/reset-password", { identifier, otp, password });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Reset failed. Check your code.");
    }
  }

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
        requestRegistrationOTP, // New function
        verifyAndFinalizeRegister, // New function
        logOut,
        forgotPassword,
        resetPassword 
      }}
    >
      {children}
    </UserContext.Provider>
  );
}