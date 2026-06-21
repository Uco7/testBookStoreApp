import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import { BASE_URL } from "../middleWare/urlConfig";

const AdminUserContext = createContext({
  users: [],
  stats: {
    totalUsers: 0,
    verifiedUsersCount: 0,
    premiumUsersCount: 0,
    verifiedUsersPercent: 0,
    premiumUsersPercent: 0,
    onlineUsers: 0,
    offlineUsers: 0,
  },
  loading: false,
  error: "",
  refreshUsers: async () => {},
  refreshActivityStats: async () => {},
});

export const AdminUserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchedRef = useRef(false);

  const [stats, setStats] = useState({
    totalUsers: 0,
    verifiedUsersCount: 0,
    premiumUsersCount: 0,
    verifiedUsersPercent: 0,
    premiumUsersPercent: 0,
    onlineUsers: 0,
    offlineUsers: 0,
  });

  const authHeaders = () => {
    const token = localStorage.getItem("adminToken");

    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      "ngrok-skip-browser-warning": "true",
    };
  };

  // =====================================================
  // CALCULATE STATS (from the full user list)
  // =====================================================

  const calculateCounts = (userList = []) => {
    const totalUsers = userList.length;

    const verifiedUsersCount = userList.filter(
      (user) => user?.isVerified === true
    ).length;

    const premiumUsersCount = userList.filter(
      (user) => user?.premium?.isPremium === true
    ).length;

    const verifiedUsersPercent =
      totalUsers > 0
        ? Math.round(
            (verifiedUsersCount / totalUsers) * 100
          )
        : 0;

    const premiumUsersPercent =
      totalUsers > 0
        ? Math.round(
            (premiumUsersCount / totalUsers) * 100
          )
        : 0;

    // Only touch the fields derived from the user list — leave
    // onlineUsers / offlineUsers (set separately) untouched.
    setStats((prev) => ({
      ...prev,
      totalUsers,
      verifiedUsersCount,
      premiumUsersCount,
      verifiedUsersPercent,
      premiumUsersPercent,
    }));
  };

  // =====================================================
  // FETCH USERS
  // =====================================================

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${BASE_URL}/api/admin/users`,
        {
          method: "GET",
          headers: authHeaders(),
        }
      );

      if (response.status === 404) {
        setUsers([]);
        calculateCounts([]);
        return;
      }

      if (response.status === 429) {
        setError(
          "Too many requests. Please wait a few seconds and try again."
        );
        return;
      }

      if (!response.ok) {
        throw new Error(
          `Could not fetch users (status ${response.status})`
        );
      }

      const data = await response.json();

      console.log(
        "👉 REAL BACKEND DATA RECEIVED:",
        data
      );

      let userList = [];

      if (Array.isArray(data)) {
        userList = data;
      } else if (
        data &&
        typeof data === "object"
      ) {
        userList =
          data.users ||
          data.data ||
          data.allUsers ||
          Object.values(data).find(
            Array.isArray
          ) ||
          [];
      }

      setUsers(userList);
      calculateCounts(userList);
    } catch (err) {
      console.error(
        "Fetch Users Context Error:",
        err
      );

      setError(
        err.message ||
          "Unable to connect to server."
      );

      setUsers([]);

      setStats((prev) => ({
        ...prev,
        totalUsers: 0,
        verifiedUsersCount: 0,
        premiumUsersCount: 0,
        verifiedUsersPercent: 0,
        premiumUsersPercent: 0,
      }));
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FETCH ACTIVITY STATS (online / offline counts)
  // =====================================================

  const fetchActivityStats = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/admin/users/stats`,
        {
          method: "GET",
          headers: authHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Could not fetch activity stats (status ${response.status})`
        );
      }

      const data = await response.json();

      setStats((prev) => ({
        ...prev,
        onlineUsers: data?.onlineUsers ?? 0,
        offlineUsers: data?.offlineUsers ?? 0,
      }));
    } catch (err) {
      console.error(
        "Fetch Activity Stats Error:",
        err
      );

      // Don't wipe out the rest of stats — just zero out the
      // online/offline numbers since they couldn't be confirmed.
      setStats((prev) => ({
        ...prev,
        onlineUsers: 0,
        offlineUsers: 0,
      }));
    }
  };

  // =====================================================
  // INITIAL FETCH (ONLY ONCE)
  // =====================================================

  useEffect(() => {
    if (fetchedRef.current) return;

    fetchedRef.current = true;

    fetchUsers();
    fetchActivityStats();
  }, []);

  return (
    <AdminUserContext.Provider
      value={{
        users,
        stats,
        loading,
        error,
        refreshUsers: fetchUsers,
        refreshActivityStats: fetchActivityStats,
      }}
    >
      {children}
    </AdminUserContext.Provider>
  );
};

export const AdminuseUsers = () => {
  const context = useContext(AdminUserContext);

  if (!context) {
    throw new Error(
      "useUsers must be used within AdminUserProvider"
    );
  }

  return context;
};
