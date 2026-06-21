
// import React, {
//   createContext,
//   useState,
//   useEffect,
//   useContext,
//   useRef,
// } from "react";
// import { BASE_URL } from '../middleWare/urlConfig';

// const AdminSubscriptionContext = createContext({
//   subscriptions: [],
//   summary: {
//     totalSubscriptions: 0,
//     successfulCount: 0,
//     pendingCount: 0,
//     failedCount: 0,
//     totalRevenue: 0,
//     planBreakdown: { monthly: 0, yearly: 0, lifetime: 0 },
//   },
//   loading: false,
//   error: '',
//   actionError: '',
//   refreshSubscriptions: async () => {},
//   grantPremiumManually: async () => {},
// });

// export const AdminSubscriptionProvider = ({ children }) => {
//   const [subscriptions, setSubscriptions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [actionError, setActionError] = useState('');

//   const [summary, setSummary] = useState({
//     totalSubscriptions: 0,
//     successfulCount: 0,
//     pendingCount: 0,
//     failedCount: 0,
//     totalRevenue: 0,
//     planBreakdown: { monthly: 0, yearly: 0, lifetime: 0 },
//   });

//   const authHeaders = () => {
//     const token = localStorage.getItem('adminToken');
//     return {
//       'Content-Type': 'application/json',
//       'Authorization': token ? `Bearer ${token}` : '',
//       'ngrok-skip-browser-warning': 'true',
//     };
//   };

//   // ── FETCH ALL SUBSCRIPTIONS ───────────────────────────────────────────
//   const fetchSubscriptions = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const response = await fetch(`${BASE_URL || ''}/api/admin/subscriptions`, {
//         method: 'GET',
//         headers: authHeaders(),
//       });

//       // Backend returns 404 on an empty subscriptions collection — a valid
//       // "no payments yet" result, not a real failure. Same convention as
//       // UserContext and AdminTimetableContext.
//       if (response.status === 404) {
//         setSubscriptions([]);
//         return;
//       }

//       if (!response.ok) {
//         throw new Error(`Could not fetch subscriptions (status ${response.status}).`);
//       }

//       const data = await response.json();
//       setSubscriptions(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error('Fetch Subscriptions Context Error:', err);
//       setError(err.message || 'Server connection failed.');
//       setSubscriptions([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── FETCH REVENUE/SUBSCRIPTION SUMMARY ────────────────────────────────
//   const fetchSummary = async () => {
//     try {
//       const response = await fetch(`${BASE_URL || ''}/api/admin/subscriptions/summary`, {
//         method: 'GET',
//         headers: authHeaders(),
//       });

//       if (!response.ok) {
//         console.log('Subscription summary fetch failed:', response.status);
//         return;
//       }

//       const data = await response.json();
//       setSummary({
//         totalSubscriptions: data?.totalSubscriptions ?? 0,
//         successfulCount: data?.successfulCount ?? 0,
//         pendingCount: data?.pendingCount ?? 0,
//         failedCount: data?.failedCount ?? 0,
//         totalRevenue: data?.totalRevenue ?? 0,
//         planBreakdown: data?.planBreakdown ?? { monthly: 0, yearly: 0, lifetime: 0 },
//       });
//     } catch (err) {
//       console.log('Subscription summary error:', err.message);
//     }
//   };

//   // ── MANUAL PREMIUM GRANT (support override) ──────────────────────────
//   // Deliberately separate from the normal webhook-driven flow — see the
//   // backend controller's notes. Always re-confirms with the server's
//   // response message rather than assuming success locally, since this is
//   // a sensitive billing-adjacent action.
//   const grantPremiumManually = async (userId, plan) => {
//     setActionError('');
//     try {
//       const response = await fetch(
//         `${BASE_URL || ''}/api/admin/subscriptions/${userId}/grant-premium`,
//         {
//           method: 'PATCH',
//           headers: authHeaders(),
//           body: JSON.stringify({ plan }),
//         }
//       );

//       const body = await response.json().catch(() => ({}));

//       if (!response.ok) {
//         throw new Error(body?.message || `Failed to grant premium (status ${response.status}).`);
//       }

//       // Refresh both lists, since a manual grant can affect revenue/plan
//       // breakdown displays even though it doesn't create a Subscription
//       // record itself.
//       await Promise.all([fetchSubscriptions(), fetchSummary()]);

//       return body;
//     } catch (err) {
//       console.error('Grant Premium Manually error:', err);
//       setActionError(err.message || 'Failed to grant premium.');
//       throw err;
//     }
//   };

//   useEffect(() => {
//     fetchSubscriptions();
//     fetchSummary();
//   }, []);


//   return (
//     <AdminSubscriptionContext.Provider
//       value={{
//         subscriptions,
//         summary,
//         loading,
//         error,
//         actionError,
//         refreshSubscriptions: fetchSubscriptions,
//         grantPremiumManually,
//       }}
//     >
//       {children}
//     </AdminSubscriptionContext.Provider>
//   );
// };

// export const useAdminSubscriptions = () => {
//   const context = useContext(AdminSubscriptionContext);
//   if (!context) {
//     throw new Error('useAdminSubscriptions must be used within an AdminSubscriptionProvider');
//   }
//   return context;
// };



import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";

import { BASE_URL } from "../middleWare/urlConfig";

const AdminSubscriptionContext = createContext(null);

export const AdminSubscriptionProvider = ({
  children,
}) => {
  const [subscriptions, setSubscriptions] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [actionError, setActionError] =
    useState("");

  const [summary, setSummary] =
    useState({
      totalSubscriptions: 0,
      successfulCount: 0,
      pendingCount: 0,
      failedCount: 0,
      totalRevenue: 0,

      planBreakdown: {
        monthly: 0,
        yearly: 0,
        lifetime: 0,
      },
    });

  const hasFetched = useRef(false);

  const authHeaders = () => {
    const token =
      localStorage.getItem("adminToken");

    return {
      "Content-Type": "application/json",
      Authorization: token
        ? `Bearer ${token}`
        : "",
      "ngrok-skip-browser-warning":
        "true",
    };
  };

  // =====================================================
  // FETCH SUBSCRIPTIONS
  // =====================================================

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${BASE_URL}/api/admin/subscriptions`,
        {
          method: "GET",
          headers: authHeaders(),
        }
      );

      if (response.status === 429) {
        setError(
          "Too many requests. Please wait a few seconds and try again."
        );

        setSubscriptions([]);
        return;
      }

      if (response.status === 404) {
        setSubscriptions([]);
        return;
      }

      if (!response.ok) {
        throw new Error(
          `Could not fetch subscriptions (${response.status})`
        );
      }

      const data = await response.json();

      setSubscriptions(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.error(
        "Fetch Subscriptions Context Error:",
        err
      );

      setError(
        err.message ||
          "Server connection failed."
      );

      setSubscriptions([]);
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
        `${BASE_URL}/api/admin/subscriptions/summary`,
        {
          method: "GET",
          headers: authHeaders(),
        }
      );

      if (response.status === 429) {
        console.log(
          "Too many requests while fetching summary."
        );
        return;
      }

      if (!response.ok) {
        console.log(
          "Subscription summary fetch failed:",
          response.status
        );
        return;
      }

      const data = await response.json();

      setSummary({
        totalSubscriptions:
          data?.totalSubscriptions ?? 0,

        successfulCount:
          data?.successfulCount ?? 0,

        pendingCount:
          data?.pendingCount ?? 0,

        failedCount:
          data?.failedCount ?? 0,

        totalRevenue:
          data?.totalRevenue ?? 0,

        planBreakdown:
          data?.planBreakdown ?? {
            monthly: 0,
            yearly: 0,
            lifetime: 0,
          },
      });
    } catch (err) {
      console.log(
        "Subscription summary error:",
        err.message
      );
    }
  };

  // =====================================================
  // MANUAL PREMIUM GRANT
  // =====================================================

  const grantPremiumManually = async (
    userId,
    plan
  ) => {
    try {
      setActionError("");

      const response = await fetch(
        `${BASE_URL}/api/admin/subscriptions/${userId}/grant-premium`,
        {
          method: "PATCH",
          headers: authHeaders(),
          body: JSON.stringify({
            plan,
          }),
        }
      );

      const body =
        await response
          .json()
          .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          body?.message ||
            `Failed to grant premium (${response.status})`
        );
      }

      await Promise.all([
        fetchSubscriptions(),
        fetchSummary(),
      ]);

      return body;
    } catch (err) {
      console.error(
        "Grant Premium Manually Error:",
        err
      );

      setActionError(
        err.message ||
          "Failed to grant premium."
      );

      throw err;
    }
  };

  // =====================================================
  // INITIAL FETCH
  // =====================================================

  useEffect(() => {
    if (hasFetched.current) return;

    hasFetched.current = true;

    fetchSubscriptions();
    fetchSummary();
  }, []);

  // =====================================================
  // PROVIDER
  // =====================================================

  return (
    <AdminSubscriptionContext.Provider
      value={{
        subscriptions,

        summary,

        loading,

        error,

        actionError,

        refreshSubscriptions:
          async () => {
            await Promise.all([
              fetchSubscriptions(),
              fetchSummary(),
            ]);
          },

        grantPremiumManually,
      }}
    >
      {children}
    </AdminSubscriptionContext.Provider>
  );
};

// =====================================================
// CUSTOM HOOK
// =====================================================

export const useAdminSubscriptions =
  () => {
    const context = useContext(
      AdminSubscriptionContext
    );

    if (!context) {
      throw new Error(
        "useAdminSubscriptions must be used within an AdminSubscriptionProvider"
      );
    }

    return context;
  };