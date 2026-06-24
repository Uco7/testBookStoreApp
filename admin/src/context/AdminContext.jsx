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
          // formData already includes adminSecretCode (now required on
          // both login and register from AdminAuth.jsx) — this stays
          // generic and passes through whatever fields the form sends,
          // so no change was needed here for that part.
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
      // 🔧 FIX: previously logged the full error object via
      // console.error("Admin Auth Error:", err). For a 403 (wrong
      // secret code) or 401 (wrong email/password), `err.message` is
      // just the server's message string — harmless. But logging the
      // whole `err` object risks dumping extra context (stack traces,
      // and in some browsers/fetch polyfills, request details) to the
      // console on every failed attempt, including ones containing the
      // values the admin just typed. Logging only the message string is
      // enough for debugging without that risk.
      console.error("Admin auth failed:", err.message);

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