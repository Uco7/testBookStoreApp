// // import React, {
// //   createContext,
// //   useState,
// //   useEffect,
// //   useRef,
// // } from "react";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import axios from "axios";
// // import { backendUrl_ngrok, backendDomainUrl } from "../utils/config/appUrl";

// // const APP_URL = backendUrl_ngrok;

// // export const SubscriptionContext = createContext({
// //   transactions: [],
// //   loading: false,
// //   verifying: false,
// //   error: "",
// //   fetchTransactions: async () => {},
// //   verifyPayment: async () => ({ success: false }),
// // });

// // export const SubscriptionProvider = ({ children }) => {
// //   const [transactions, setTransactions] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [verifying, setVerifying] = useState(false);
// //   const [error, setError] = useState("");

// //   const fetchedRef = useRef(false);

// //   const authHeaders = async () => {
// //     const token = await AsyncStorage.getItem("token");
// //     return { Authorization: token ? `Bearer ${token}` : "" };
// //   };

// //   // =====================================================
// //   // FETCH MY TRANSACTIONS
// //   // =====================================================

// //   const fetchTransactions = async () => {
// //     try {
// //       setLoading(true);
// //       setError("");

// //       const headers = await authHeaders();

// //       const res = await axios.get(
// //         `${APP_URL}/api/subscription/my-transactions`,
// //         { headers }
// //       );

// //       const data = Array.isArray(res.data)
// //         ? res.data
// //         : res.data?.transactions || [];

// //       setTransactions(data);
// //     } catch (err) {
// //       console.log(
// //         "Fetch Transactions Error:",
// //         err?.response?.data || err.message
// //       );

// //       setError(
// //         err?.response?.data?.message ||
// //           "Unable to load your transactions."
// //       );
// //       setTransactions([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // =====================================================
// //   // VERIFY A PAYMENT (used right after a Paystack redirect)
// //   // =====================================================

// //   const verifyPayment = async (reference) => {
// //     try {
// //       setVerifying(true);

// //       const headers = await authHeaders();

// //       const res = await axios.get(
// //         `${APP_URL}/api/subscription/verify/${reference}`,
// //         { headers }
// //       );

// //       // A newly-verified payment means a new transaction exists —
// //       // refresh the list so it shows up immediately.
// //       if (res.data?.success) {
// //         fetchTransactions();
// //       }

// //       return res.data;
// //     } catch (err) {
// //       console.log(
// //         "Verify Payment Error:",
// //         err?.response?.data || err.message
// //       );

// //       throw new Error(
// //         err?.response?.data?.message ||
// //           "Payment verification failed. Please contact support."
// //       );
// //     } finally {
// //       setVerifying(false);
// //     }
// //   };

// //   // =====================================================
// //   // INITIAL FETCH (ONLY ONCE)
// //   // =====================================================

// //   useEffect(() => {
// //     if (fetchedRef.current) return;
// //     fetchedRef.current = true;

// //     fetchTransactions();
// //   }, []);

// //   return (
// //     <SubscriptionContext.Provider
// //       value={{
// //         transactions,
// //         loading,
// //         verifying,
// //         error,
// //         fetchTransactions,
// //         verifyPayment,
// //       }}
// //     >
// //       {children}
// //     </SubscriptionContext.Provider>
// //   );
// // };




// import React, {
//   createContext,
//   useState,
//   useEffect,
//   useRef,
// } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import { backendUrl_ngrok } from "../utils/config/appUrl";

// const APP_URL = backendUrl_ngrok;

// export const SubscriptionContext = createContext(null);

// export const SubscriptionProvider = ({ children }) => {
//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [verifying, setVerifying] = useState(false);
//   const [subscribing, setSubscribing] = useState(false);
//   const [error, setError] = useState("");
//   const [currentSubscription, setCurrentSubscription] = useState(null);
// const [subscriptionLoading, setSubscriptionLoading] = useState(false);

//   const fetchedRef = useRef(false);

//   const authHeaders = async () => {
//     const token = await AsyncStorage.getItem("token");

//     return {
//       Authorization: token ? `Bearer ${token}` : "",
//     };
//   };

//   // =====================================================
//   // FETCH TRANSACTIONS
//   // =====================================================

//   const fetchTransactions = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const headers = await authHeaders();

//       const res = await axios.get(
//         `${APP_URL}/api/v1/subscription/my-transactions`,
//         { headers }
//       );

//       const data = Array.isArray(res.data)
//         ? res.data
//         : res.data?.transactions || [];

//       setTransactions(data);

//       return data;
//     } catch (err) {
//       console.log(
//         "Fetch Transactions Error:",
//         err?.response?.data || err.message
//       );

//       setError(
//         err?.response?.data?.message ||
//           "Unable to load transactions."
//       );

//       setTransactions([]);

//       return [];
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =====================================================
//   // INITIATE SUBSCRIPTION
//   // =====================================================

//   const initiateSubscription = async ({
//     plan,
//     fullName,
//     email,
//     phone,
//     amount,
//   }) => {
//     try {
//       setSubscribing(true);

//       const headers = await authHeaders();

//       const res = await axios.post(
//         `${APP_URL}/api/v1/subscription/initiate`,
//         {
//           plan,
//           fullName,
//           email,
//           phone,
//           amount,
//         },
//         { headers }
//       );

//       return res.data;
//     } catch (err) {
//       console.log(
//         "Initiate Subscription Error:",
//         err?.response?.data || err.message
//       );

//       throw new Error(
//         err?.response?.data?.message ||
//           "Unable to initiate subscription."
//       );
//     } finally {
//       setSubscribing(false);
//     }
//   };

//   // =====================================================
//   // VERIFY PAYMENT
//   // =====================================================

//   const verifyPayment = async (reference) => {
//     try {
//       setVerifying(true);

//       const headers = await authHeaders();

//       const res = await axios.get(
//         `${APP_URL}/api/v1/subscription/verify/${reference}`,
//         { headers }
//       );

//       if (res.data?.success) {
//         await fetchTransactions();
//       }

//       return res.data;
//     } catch (err) {
//       console.log(
//         "Verify Payment Error:",
//         err?.response?.data || err.message
//       );

//       throw new Error(
//         err?.response?.data?.message ||
//           "Payment verification failed."
//       );
//     } finally {
//       setVerifying(false);
//     }
//   };

//   // =====================================================
//   // CANCEL SUBSCRIPTION
//   // =====================================================

//   const cancelSubscription = async () => {
//     try {
//       const headers = await authHeaders();

//       const res = await axios.post(
//         `${APP_URL}/api/v1/subscription/cancel`,
//         {},
//         { headers }
//       );

//       return res.data;
//     } catch (err) {
//       console.log(
//         "Cancel Subscription Error:",
//         err?.response?.data || err.message
//       );

//       throw new Error(
//         err?.response?.data?.message ||
//           "Unable to cancel subscription."
//       );
//     }
//   };

//   // =====================================================
//   // GET CURRENT SUBSCRIPTION
//   // =====================================================

// //   const getCurrentSubscription = async () => {
// //     try {
// //       const headers = await authHeaders();

// //       const res = await axios.get(
// //         `${APP_URL}/api/subscription/current`,
// //         { headers }
// //       );

// //       return res.data;
// //     } catch (err) {
// //       console.log(
// //         "Get Subscription Error:",
// //         err?.response?.data || err.message
// //       );

// //       throw new Error(
// //         err?.response?.data?.message ||
// //           "Unable to fetch subscription."
// //       );
// //     }
// //   };


// const getCurrentSubscription = async () => {
//   try {
//     setSubscriptionLoading(true);

//     const headers = await authHeaders();

//     const res = await axios.get(
//       `${APP_URL}/api/v1/subscription/current`,
//       { headers }
//     );

//     const premium =
//       res.data?.premium ||
//       res.data?.subscription ||
//       null;

//     setCurrentSubscription(premium);

//     return premium;
//   } catch (err) {
//     console.log(
//       "Get Subscription Error:",
//       err?.response?.data || err.message
//     );

//     throw new Error(
//       err?.response?.data?.message ||
//       "Unable to fetch subscription."
//     );
//   } finally {
//     setSubscriptionLoading(false);
//   }
// };

//   // =====================================================
//   // INITIAL LOAD
//   // =====================================================

// //   useEffect(() => {
// //     if (fetchedRef.current) return;

// //     fetchedRef.current = true;

// //     fetchTransactions();
// //   }, []);


// useEffect(() => {
//   if (fetchedRef.current) return;

//   fetchedRef.current = true;

//   fetchTransactions();
//   getCurrentSubscription();
// }, []);

//   return (
//     <SubscriptionContext.Provider
//       value={{
//           transactions,
//     loading,
//     verifying,
//     subscribing,
//     error,

//     fetchTransactions,
//     initiateSubscription,
//     verifyPayment,
//     cancelSubscription,
//     getCurrentSubscription,
//       }}
//     >
//       {children}
//     </SubscriptionContext.Provider>
//   );
// };



import React, {
  createContext,
  useState,
  useEffect,
  useRef,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { backendUrl_ngrok,backendDomainUrl } from "../utils/config/appUrl";

// const APP_URL = backendUrl_ngrok;
const APP_URL = backendDomainUrl

export const SubscriptionContext = createContext(null);

export const SubscriptionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [error, setError] = useState("");
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);

  const fetchedRef = useRef(false);

  const authHeaders = async () => {
    const token = await AsyncStorage.getItem("token");

    return {
      Authorization: token ? `Bearer ${token}` : "",
    };
  };

  // =====================================================
  // FETCH TRANSACTIONS
  // =====================================================

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const headers = await authHeaders();

      const res = await axios.get(
        `${APP_URL}/api/v1/subscription/my-transactions`,
        { headers }
      );

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.transactions || [];

      setTransactions(data);

      return data;
    } catch (err) {
      console.log(
        "Fetch Transactions Error:",
        err?.response?.data || err.message
      );

      setError(
        err?.response?.data?.message ||
          "Unable to load transactions."
      );

      setTransactions([]);

      return [];
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIATE SUBSCRIPTION
  // =====================================================

  const initiateSubscription = async ({
    plan,
    fullName,
    email,
    phone,
    amount,
  }) => {
    try {
      setSubscribing(true);

      const headers = await authHeaders();

      const res = await axios.post(
        `${APP_URL}/api/v1/subscription/initiate`,
        {
          plan,
          fullName,
          email,
          phone,
          amount,
        },
        { headers }
      );

      return res.data;
    } catch (err) {
      console.log(
        "Initiate Subscription Error:",
        err?.response?.data || err.message
      );

      throw new Error(
        err?.response?.data?.message ||
          "Unable to initiate subscription."
      );
    } finally {
      setSubscribing(false);
    }
  };

  // =====================================================
  // VERIFY PAYMENT
  // =====================================================

  const verifyPayment = async (reference) => {
    try {
      setVerifying(true);

      const headers = await authHeaders();

      const res = await axios.get(
        `${APP_URL}/api/v1/subscription/verify/${reference}`,
        { headers }
      );

      if (res.data?.success) {
        await fetchTransactions();
      }

      return res.data;
    } catch (err) {
      console.log(
        "Verify Payment Error:",
        err?.response?.data || err.message
      );

      throw new Error(
        err?.response?.data?.message ||
          "Payment verification failed."
      );
    } finally {
      setVerifying(false);
    }
  };

  // =====================================================
  // CANCEL SUBSCRIPTION
  // =====================================================
  // NOTE: there is currently no matching backend route/controller
  // for this (no "/cancel" route in subscriptionRoutes.js, no
  // cancelSubscription export in subscriptionController.js).
  // This will 404 until that's added server-side.

  const cancelSubscription = async () => {
    try {
      const headers = await authHeaders();

      const res = await axios.post(
        `${APP_URL}/api/v1/subscription/cancel`,
        {},
        { headers }
      );

      return res.data;
    } catch (err) {
      console.log(
        "Cancel Subscription Error:",
        err?.response?.data || err.message
      );

      throw new Error(
        err?.response?.data?.message ||
          "Unable to cancel subscription."
      );
    }
  };

  // =====================================================
  // GET CURRENT SUBSCRIPTION
  // =====================================================

  const getCurrentSubscription = async () => {
    try {
      setSubscriptionLoading(true);

      const headers = await authHeaders();

      const res = await axios.get(
        `${APP_URL}/api/v1/subscription/current`,
        { headers }
      );

      const premium =
        res.data?.premium ||
        res.data?.subscription ||
        null;

      setCurrentSubscription(premium);

      return premium;
    } catch (err) {
      console.log(
        "Get Subscription Error:",
        err?.response?.data || err.message
      );

      throw new Error(
        err?.response?.data?.message ||
        "Unable to fetch subscription."
      );
    } finally {
      setSubscriptionLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    if (fetchedRef.current) return;

    fetchedRef.current = true;

    fetchTransactions();
    getCurrentSubscription();
  }, []);

  return (
    <SubscriptionContext.Provider
      value={{
        transactions,
        loading,
        verifying,
        subscribing,
        error,
        currentSubscription,
        subscriptionLoading,

        fetchTransactions,
        initiateSubscription,
        verifyPayment,
        cancelSubscription,
        getCurrentSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};
