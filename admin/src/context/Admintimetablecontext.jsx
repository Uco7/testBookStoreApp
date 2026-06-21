// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
// } from "react";
// import { BASE_URL } from "../middleWare/urlConfig";

// const AdminTimetableContext = createContext();

// export const AdminTimetableProvider = ({ children }) => {
//   const [timetables, setTimetables] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [actionError, setActionError] = useState("");

//   const [summary, setSummary] = useState({
//     totalTimetables: 0,
//     activeTimetables: 0,
//     stoppedTimetables: 0,
//     totalRegularReminders: 0,
//     totalPremiumReminders: 0,
//     totalReminders: 0,
//   });

//   const authHeaders = () => {
//     const token = localStorage.getItem("adminToken");

//     return {
//       "Content-Type": "application/json",
//       Authorization: token ? `Bearer ${token}` : "",
//       "ngrok-skip-browser-warning": "true",
//     };
//   };

//   // =====================================================
//   // FETCH ALL TIMETABLES
//   // =====================================================
//   const fetchTimetables = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await fetch(
//         `${BASE_URL}/api/admin/timetables`,
//         {
//           method: "GET",
//           headers: authHeaders(),
//         }
//       );

//       if (response.status === 404) {
//         setTimetables([]);
//         return;
//       }

//       if (!response.ok) {
//         throw new Error(
//           `Failed to fetch timetables (${response.status})`
//         );
//       }

//       const data = await response.json();

//       console.log("TIMETABLES:", data);

//       setTimetables(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error("Fetch Timetables Error:", err);

//       setError(err.message || "Failed to fetch timetables");
//       setTimetables([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =====================================================
//   // FETCH SUMMARY
//   // =====================================================
//   const fetchSummary = async () => {
//     try {
//       console.log("Fetching timetable summary...");

//       const response = await fetch(
//         `${BASE_URL}/api/admin/timetables/summary`,
//         {
//           method: "GET",
//           headers: authHeaders(),
//         }
//       );

//       console.log(
//         "Summary response status:",
//         response.status
//       );

//       if (!response.ok) {
//         throw new Error(
//           `Summary request failed (${response.status})`
//         );
//       }

//       const data = await response.json();

//       console.log("SUMMARY API DATA:", data);

//       setSummary({
//         totalTimetables: data.totalTimetables || 0,
//         activeTimetables: data.activeTimetables || 0,
//         stoppedTimetables: data.stoppedTimetables || 0,
//         totalRegularReminders:
//           data.totalRegularReminders || 0,
//         totalPremiumReminders:
//           data.totalPremiumReminders || 0,
//         totalReminders: data.totalReminders || 0,
//       });
//     } catch (err) {
//       console.error("Summary Error:", err);
//     }
//   };

//   // =====================================================
//   // STOP TIMETABLE
//   // =====================================================
//   const stopTimetable = async (id) => {
//     try {
//       setActionError("");

//       const response = await fetch(
//         `${BASE_URL}/api/admin/timetables/${id}/stop`,
//         {
//           method: "PATCH",
//           headers: authHeaders(),
//         }
//       );

//       if (!response.ok) {
//         const body = await response.json().catch(() => ({}));

//         throw new Error(
//           body.message || "Failed to stop timetable"
//         );
//       }

//       await Promise.all([
//         fetchTimetables(),
//         fetchSummary(),
//       ]);
//     } catch (err) {
//       console.error(err);
//       setActionError(err.message);
//       throw err;
//     }
//   };

//   // =====================================================
//   // DELETE TIMETABLE
//   // =====================================================
//   const deleteTimetable = async (id) => {
//     try {
//       setActionError("");

//       const response = await fetch(
//         `${BASE_URL}/api/admin/timetables/${id}`,
//         {
//           method: "DELETE",
//           headers: authHeaders(),
//         }
//       );

//       if (!response.ok) {
//         const body = await response.json().catch(() => ({}));

//         throw new Error(
//           body.message || "Failed to delete timetable"
//         );
//       }

//       await Promise.all([
//         fetchTimetables(),
//         fetchSummary(),
//       ]);
//     } catch (err) {
//       console.error(err);
//       setActionError(err.message);
//       throw err;
//     }
//   };

//   // =====================================================
//   // INITIAL LOAD
//   // =====================================================
//   useEffect(() => {
//     console.log("AdminTimetableProvider mounted");

//     fetchTimetables();
//     fetchSummary();
//   }, []);

//   useEffect(() => {
//     console.log("SUMMARY STATE UPDATED:", summary);
//   }, [summary]);

//   return (
//     <AdminTimetableContext.Provider
//       value={{
//         timetables,
//         summary,
//         loading,
//         error,
//         actionError,
//         refreshTimetables: async () => {
//           await Promise.all([
//             fetchTimetables(),
//             fetchSummary(),
//           ]);
//         },
//         stopTimetable,
//         deleteTimetable,
//       }}
//     >
//       {children}
//     </AdminTimetableContext.Provider>
//   );
// };

// export const useAdminTimetables = () => {
//   const context = useContext(AdminTimetableContext);

//   if (!context) {
//     throw new Error(
//       "useAdminTimetables must be used within AdminTimetableProvider"
//     );
//   }

//   return context;
// };



import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { BASE_URL } from "../middleWare/urlConfig";

const AdminTimetableContext = createContext();

export const AdminTimetableProvider = ({ children }) => {
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");

  const fetchedRef = useRef(false);

  const [summary, setSummary] = useState({
    totalTimetables: 0,
    activeTimetables: 0,
    stoppedTimetables: 0,
    totalRegularReminders: 0,
    totalPremiumReminders: 0,
    totalReminders: 0,
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
  // FETCH ALL TIMETABLES
  // =====================================================

  const fetchTimetables = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${BASE_URL}/api/admin/timetables`,
        {
          headers: authHeaders(),
        }
      );

      if (response.status === 404) {
        setTimetables([]);
        return;
      }

      if (response.status === 429) {
        setError(
          "Too many requests. Please wait a few seconds."
        );
        return;
      }

      if (!response.ok) {
        throw new Error(
          `Failed to fetch timetables (${response.status})`
        );
      }

      const data = await response.json();

      setTimetables(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch Timetables Error:", err);

      setError(
        err.message || "Failed to fetch timetables"
      );

      setTimetables([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FETCH SUMMARY
  // =====================================================

  const fetchSummary = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/admin/timetables/summary`,
        {
          headers: authHeaders(),
        }
      );

      if (response.status === 429) {
        console.log("Summary rate limited");
        return;
      }

      if (!response.ok) {
        throw new Error(
          `Summary request failed (${response.status})`
        );
      }

      const data = await response.json();

      setSummary({
        totalTimetables: data?.totalTimetables || 0,
        activeTimetables: data?.activeTimetables || 0,
        stoppedTimetables: data?.stoppedTimetables || 0,
        totalRegularReminders:
          data?.totalRegularReminders || 0,
        totalPremiumReminders:
          data?.totalPremiumReminders || 0,
        totalReminders: data?.totalReminders || 0,
      });
    } catch (err) {
      console.error("Summary Error:", err);
    }
  };

  // =====================================================
  // STOP TIMETABLE
  // =====================================================

  const stopTimetable = async (id) => {
    try {
      setActionError("");

      const response = await fetch(
        `${BASE_URL}/api/admin/timetables/${id}/stop`,
        {
          method: "PATCH",
          headers: authHeaders(),
        }
      );

      const body = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          body?.message ||
            `Failed to stop timetable (${response.status})`
        );
      }

      // Update locally instead of refetching everything
      setTimetables((prev) =>
        prev.map((item) =>
          item._id === id
            ? { ...item, isActive: false }
            : item
        )
      );

      fetchSummary();

      return body;
    } catch (err) {
      console.error(err);

      setActionError(err.message);

      throw err;
    }
  };

  // =====================================================
  // DELETE TIMETABLE
  // =====================================================

  const deleteTimetable = async (id) => {
    try {
      setActionError("");

      const response = await fetch(
        `${BASE_URL}/api/admin/timetables/${id}`,
        {
          method: "DELETE",
          headers: authHeaders(),
        }
      );

      const body = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          body?.message ||
            `Failed to delete timetable (${response.status})`
        );
      }

      // Remove locally
      setTimetables((prev) =>
        prev.filter(
          (timetable) => timetable._id !== id
        )
      );

      fetchSummary();

      return body;
    } catch (err) {
      console.error(err);

      setActionError(err.message);

      throw err;
    }
  };

  // =====================================================
  // REFRESH
  // =====================================================

  const refreshTimetables = async () => {
    await Promise.all([
      fetchTimetables(),
      fetchSummary(),
    ]);
  };

  // =====================================================
  // INITIAL LOAD (ONLY ONCE)
  // =====================================================

  useEffect(() => {
    if (fetchedRef.current) return;

    fetchedRef.current = true;

    fetchTimetables();
    fetchSummary();
  }, []);

  return (
    <AdminTimetableContext.Provider
      value={{
        timetables,
        summary,
        loading,
        error,
        actionError,
        refreshTimetables,
        stopTimetable,
        deleteTimetable,
      }}
    >
      {children}
    </AdminTimetableContext.Provider>
  );
};

export const useAdminTimetables = () => {
  const context = useContext(
    AdminTimetableContext
  );

  if (!context) {
    throw new Error(
      "useAdminTimetables must be used within AdminTimetableProvider"
    );
  }

  return context;
};