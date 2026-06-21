// // import React, { createContext, useState, useEffect, useContext } from 'react';
// // import { BASE_URL } from '../middleWare/urlConfig'; // Verify this relative path fits your layout

// // const AdminContext = createContext(null);

// // export const AdminProvider = ({ children }) => {
// //   const [admin, setAdmin] = useState(null);
// //   const [token, setToken] = useState(null);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState('');

// //   // Hydrate local context immediately upon app initialization
// //   useEffect(() => {
// //     const storedToken = localStorage.getItem('adminToken');
// //     const storedUser = localStorage.getItem('adminUser');
    
// //     if (storedToken && storedUser) {
// //       try {
// //         setToken(storedToken);
// //         setAdmin(JSON.parse(storedUser));
// //       } catch (e) {
// //         console.error("Corrupted authentication storage cleared.", e);
// //         logout();
// //       }
// //     }
// //   }, []);

// //   // Centralized authentication executor (handles both Login and Registration)
// //   const authenticateAdmin = async (isLogin, formData) => {
// //     setError('');
// //     setLoading(true);
// //     try {
// //       const endpoint = isLogin ? '/api/admin/login' : '/api/admin/register';
// //       const targetUrl = `${BASE_URL}${endpoint}`;
      
// //       const payload = isLogin 
// //         ? { email: formData.email, password: formData.password }
// //         : { 
// //             username: formData.username, 
// //             email: formData.email, 
// //             password: formData.password, 
// //             adminSecretCode: formData.adminSecretCode 
// //           };

// //       const response = await fetch(targetUrl, {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify(payload)
// //       });

// //       const data = await response.json();

// //       if (!response.ok) {
// //         throw new Error(data.message || 'Authentication request failed.');
// //       }

// //       if (isLogin) {
// //         if (!data.token) throw new Error("Server response missing authorization token.");
        
// //         localStorage.setItem('adminToken', data.token);
// //         localStorage.setItem('adminUser', JSON.stringify(data.admin));
        
// //         setToken(data.token);
// //         setAdmin(data.admin);
// //         return { success: true, action: 'login' };
// //       }

// //       return { success: true, action: 'register' };
// //     } catch (err) {
// //       setError(err.message || 'Server communication breakdown.');
// //       return { success: false, error: err.message };
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Centralized clean logout execution
// //   const logout = () => {
// //     localStorage.removeItem('adminToken');
// //     localStorage.removeItem('adminUser');
// //     setAdmin(null);
// //     setToken(null);
// //   };

// //   return (
// //     <AdminContext.Provider value={{ admin, token, loading, error, setError, authenticateAdmin, logout }}>
// //       {children}
// //     </AdminContext.Provider>
// //   );
// // };

// // // Custom Hook for clean execution across layouts
// // export const useAdmin = () => {
// //   const context = useContext(AdminContext);
// //   if (!context) {
// //     throw new Error('useAdmin must be wrapped securely within an AdminProvider wrapper');
// //   }
// //   return context;
// // };


// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { BASE_URL } from '../middleWare/urlConfig';

// const AdminContext = createContext(null);

// export const AdminProvider = ({ children }) => {
//   const [admin, setAdmin] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // Auto-restore admin details from localStorage on app boot
//   useEffect(() => {
//     const savedAdmin = localStorage.getItem('adminData');
//     if (savedAdmin) {
//       try {
//         setAdmin(JSON.parse(savedAdmin));
//       } catch (e) {
//         localStorage.removeItem('adminData');
//       }
//     }
//   }, []);

//   const authenticateAdmin = async (isLogin, formData) => {
//     setLoading(true);
//     setError('');
    
//     const endpoint = isLogin ? '/api/admin/login' : '/api/admin/register';
    
//     try {
//       const response = await fetch(`${BASE_URL || ''}${endpoint}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData)
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Authentication transaction failed.');
//       }

//       if (isLogin && data.token) {
//         // 🚨 CRITICAL COUPLING FIX: This key name must match UserContext perfectly!
//         localStorage.setItem('adminToken', data.token);
//         localStorage.setItem('adminData', JSON.stringify(data.admin));
//         setAdmin(data.admin);
//         return { success: true, action: 'login' };
//       }

//       return { success: true, action: 'register' };

//     } catch (err) {
//       setError(err.message || 'Server authentication timeout error.');
//       return { success: false };
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('adminToken');
//     localStorage.removeItem('adminData');
//     setAdmin(null);
//   };

//   return (
//     <AdminContext.Provider value={{ admin, loading, error, setError, authenticateAdmin, logout }}>
//       {children}
//     </AdminContext.Provider>
//   );
// };

// export const useAdmin = () => {
//   const context = useContext(AdminContext);
//   if (!context) {
//     throw new Error('useAdmin must be wrapped within an AdminProvider');
//   }
//   return context;
// };



import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { BASE_URL } from "../middleWare/urlConfig";

const AdminContext = createContext({
  admin: null,
  token: null,
  loading: false,
  error: "",
  authenticateAdmin: async () => {},
  logout: () => {},
});

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem("adminToken") || null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // RESTORE LOGIN STATE ON PAGE REFRESH
  // ==========================================
  useEffect(() => {
    try {
      const savedAdmin =
        localStorage.getItem("adminData");

      const savedToken =
        localStorage.getItem("adminToken");

      if (savedAdmin) {
        setAdmin(JSON.parse(savedAdmin));
      }

      if (savedToken) {
        setToken(savedToken);
      }
    } catch (err) {
      console.error(
        "Failed to restore admin session:",
        err
      );

      localStorage.removeItem("adminData");
      localStorage.removeItem("adminToken");
    }
  }, []);

  // ==========================================
  // LOGIN / REGISTER
  // ==========================================
  const authenticateAdmin = async (
    isLogin,
    formData
  ) => {
    setLoading(true);
    setError("");

    try {
      const endpoint = isLogin
        ? "/api/admin/login"
        : "/api/admin/register";

      const response = await fetch(
        `${BASE_URL}${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning":
              "true",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.status === 429) {
        throw new Error(
          "Too many requests. Please wait a moment and try again."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Authentication failed"
        );
      }

      // LOGIN
      if (isLogin) {
        localStorage.setItem(
          "adminToken",
          data.token
        );

        localStorage.setItem(
          "adminData",
          JSON.stringify(data.admin)
        );

        setAdmin(data.admin);
        setToken(data.token);

        return {
          success: true,
          action: "login",
        };
      }

      // REGISTER
      return {
        success: true,
        action: "register",
      };
    } catch (err) {
      console.error("Admin Auth Error:", err);

      setError(
        err.message ||
          "Server communication failed"
      );

      return {
        success: false,
        error: err.message,
      };
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================
  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");

    setAdmin(null);
    setToken(null);
    setError("");
  };

  return (
    <AdminContext.Provider
      value={{
        admin,
        token,
        loading,
        error,
        setError,
        authenticateAdmin,
        logout,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error(
      "useAdmin must be used inside AdminProvider"
    );
  }

  return context;
};