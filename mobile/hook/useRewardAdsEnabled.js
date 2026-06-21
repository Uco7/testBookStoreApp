// import React, { createContext, useContext, useState, useEffect, useRef } from "react";
// import { Platform } from "react-native";
// import { 
//   RewardedInterstitialAd, 
//   RewardedAdEventType, 
//   AdEventType, 
//   TestIds 
// } from "react-native-google-mobile-ads";

// // 🆔 REWARDED INTERSTITIAL ID ROUTER
// const REWARDED_INTERSTITIAL_ID = Platform.select({
//   // 🛠️ TESTING MODE: Uses safe universal test ID to show test ads in your dev build
//   android: "ca-app-pub-3940256099942544/5354046379", 
  
//   // 🚀 PRODUCTION MODE: Uncomment this line later when compiling your final release APK
//   // android: "ca-app-pub-8923799920726415/6836123231",
  
//   ios: TestIds.REWARDED_INTERSTITIAL, 
//   default: TestIds.REWARDED_INTERSTITIAL,
// });

// const AdGateContext = createContext(null);

// export const AdGateProvider = ({ children }) => {
//   const [isLoaded, setIsLoaded] = useState(false);
//   const adInstance = useRef(null);
//   const nextAction = useRef(() => {});

//   // Caching method loop to keep ad instances populated
//   const loadAd = () => {
//     const ad = RewardedInterstitialAd.createForAdRequest(REWARDED_INTERSTITIAL_ID, {
//       requestNonPersonalizedAdsOnly: false,
//     });

//     // Event 1: Ad successfully loaded into local storage
//     const unsubLoaded = ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
//       setIsLoaded(true);
//     });

//     // Event 2: User watches the ad through to completion
//     const unsubRewarded = ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
//       setIsLoaded(false);
//       nextAction.current(); 
//       loadAd(); // Fetch a new ad immediately for the next transition
//     });

//     // Event 3: User skips or exits the ad screen midway
//     const unsubClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
//       setIsLoaded(false);
//       nextAction.current(); 
//       loadAd(); // Refill cache instance immediately
//     });

//     // Event 4: Network request failure handling
//     const unsubError = ad.addAdEventListener(AdEventType.ERROR, (error) => {
//       console.log("AdMob Caching Engine Error:", error);
//       setIsLoaded(false);
//       nextAction.current(); // Auto-bypass fallback so navigation never hangs up
//     });

//     ad.load();
//     adInstance.current = ad;

//     return () => {
//       unsubLoaded();
//       unsubRewarded();
//       unsubClosed();
//       unsubError();
//     };
//   };

//   useEffect(() => {
//     const cleanup = loadAd();
//     return () => cleanup && cleanup();
//   }, []);

//   // Policy compliant routing handler method
//   const gate = (navigationAction) => {
//     if (isLoaded && adInstance.current) {
//       nextAction.current = navigationAction;
//       adInstance.current.show();
//     } else {
//       // If the ad isn't loaded yet, immediately let them pass without layout freezes
//       navigationAction();
//     }
//   };

//   return (
//     <AdGateContext.Provider value={{ gate, isLoaded }}>
//       {children}
//     </AdGateContext.Provider>
//   );
// };

// export const useAdGate = () => {
//   const context = useContext(AdGateContext);
//   if (!context) {
//     throw new Error("useAdGate hook must be mounted deep within an AdGateProvider framework tree");
//   }
//   return context;
// };

// // Placeholder stub hook so the TimetableScreen doesn't throw module resolution errors
// export const useRewardAdsEnabled = () => {
//   const context = useContext(AdGateContext);
//   if (!context) return false;
//   return context.isLoaded;
// };




import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from "react";
import { Platform } from "react-native";
import { 
  RewardedInterstitialAd, 
  RewardedAdEventType, 
  AdEventType, 
  TestIds 
} from "react-native-google-mobile-ads";
import { useUser } from "./useUser";

// 🆔 REWARDED INTERSTITIAL ID ROUTER
const REWARDED_INTERSTITIAL_ID = Platform.select({
  // 🛠️ TESTING MODE: Uses safe universal test ID to show test ads in your dev build
  android: "ca-app-pub-3940256099942544/5354046379", 

  // 🚀 PRODUCTION MODE: Uncomment this line later when compiling your final release APK
  // android: "ca-app-pub-8923799920726415/6836123231",

  ios: TestIds.REWARDED_INTERSTITIAL, 
  default: TestIds.REWARDED_INTERSTITIAL,
});

// ── Ad eligibility rules ─────────────────────────────────────────────────
// A user is eligible to be shown this rewarded INTERSTITIAL (Home /
// Timetable screens) only when BOTH are true:
//   1. They are NOT premium (premium.adsRemoved === true, OR an active
//      paid plan / trial) — premium users never see ANY ad, ever.
//   2. 90 days have passed since their account was created
//      (user.createdAt, Mongoose's automatic timestamp — no separate
//      field needed).
//
// IMPORTANT: this is intentionally a DIFFERENT clock from
// user.welcomeBonus. welcomeBonus governs how many timetables a non-
// premium user can create before being asked to watch a (different,
// non-interstitial) rewarded ad in component/AdsManager.jsx — its clock
// starts at first timetable creation, not account creation, and has
// nothing to do with this interstitial gate.
const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

// ── DEV-ONLY TESTING OVERRIDE ────────────────────────────────────────────
// Flip this to `true` while developing to force every account past the
// 90-day mark instantly, without touching the database. __DEV__ is set
// by React Native/Expo automatically and is always `false` in release
// builds, so this can never leak into production no matter what this
// flag is left set to.
const DEV_FORCE_PAST_NINETY_DAYS = true;

const isPastNinetyDayMark = (user) => {
  if (__DEV__ && DEV_FORCE_PAST_NINETY_DAYS) return true;

  const createdAt = user?.createdAt;
  if (!createdAt) {
    // No createdAt on record at all — fail safe by treating them as
    // already past it rather than permanently blocking ads.
    return true;
  }
  return Date.now() - new Date(createdAt).getTime() >= NINETY_DAYS_MS;
};

const isPremiumUser = (user) => {
  if (!user?.premium) return false;
  const now = new Date();
  const p = user.premium;

  // A one-time/permanent "ads removed" flag — never expires.
  if (p.adsRemoved) return true;

  if (p.isPremium && p.premiumPlan === "lifetime") return true;
  if (p.isPremium && p.premiumExpiresAt && new Date(p.premiumExpiresAt) > now) return true;
  if (p.trialExpiresAt && new Date(p.trialExpiresAt) > now) return true;

  return false;
};

const AdGateContext = createContext(null);

export const AdGateProvider = ({ children }) => {
  const { user } = useUser();
  const [isLoaded, setIsLoaded] = useState(false);

  // adInstance/loadToken together guard against overlapping loads. Every
  // call to loadAd() stamps a fresh token; event listeners from a stale
  // load check their token before acting, so a late-arriving event from
  // an old, superseded ad instance can never clobber the current one or
  // trigger a duplicate reload. This stops back-to-back / racing ad
  // requests — the kind of irregular pattern AdMob's invalid-traffic
  // detection flags.
  const adInstance = useRef(null);
  const nextAction = useRef(() => {});
  const loadToken = useRef(0);
  const isLoadingRef = useRef(false);

  const isPremium = useMemo(() => isPremiumUser(user), [user]);
  const pastNinetyDays = useMemo(() => isPastNinetyDayMark(user), [user]);
  const adsEligible = !isPremium && pastNinetyDays;

  // Caching method loop to keep ad instances populated.
  const loadAd = () => {
    if (isLoadingRef.current) {
      // A load is already in flight — never stack a second request on
      // top of it.
      return () => {};
    }

    isLoadingRef.current = true;
    const myToken = ++loadToken.current;

    const ad = RewardedInterstitialAd.createForAdRequest(REWARDED_INTERSTITIAL_ID, {
      requestNonPersonalizedAdsOnly: false,
    });

    const isStale = () => myToken !== loadToken.current;

    // Event 1: Ad successfully loaded into local storage
    const unsubLoaded = ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
      isLoadingRef.current = false;
      if (isStale()) return; // a newer load superseded this one — ignore
      adInstance.current = ad;
      setIsLoaded(true);
    });

    // Event 2: User watches the ad through to completion.
    // Note: the SDK always fires CLOSED right after EARNED_REWARD, and
    // CLOSED is what triggers the cache refill below — so a refill still
    // happens after a completed reward even though this handler itself
    // doesn't call loadAd().
    const unsubRewarded = ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
      if (isStale()) return;
      setIsLoaded(false);
      nextAction.current();
    });

    // Event 3: User skips or exits the ad screen midway (also fires
    // after EARNED_REWARD completes — see note above)
    const unsubClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      isLoadingRef.current = false;
      if (isStale()) return;
      setIsLoaded(false);
      nextAction.current();
      loadAd(); // Refill cache instance immediately
    });

    // Event 4: Network request failure handling
    const unsubError = ad.addAdEventListener(AdEventType.ERROR, (error) => {
      isLoadingRef.current = false;
      console.log("AdMob Caching Engine Error:", error);
      if (isStale()) return;
      setIsLoaded(false);
      nextAction.current(); // Auto-bypass fallback so navigation never hangs up
    });

    ad.load();

    return () => {
      unsubLoaded();
      unsubRewarded();
      unsubClosed();
      unsubError();
    };
  };

  // Only start caching ads once the user is actually eligible — never
  // request/cache ads for premium users or users still inside their
  // first 90 days. Debounced slightly so a rapid flip in eligibility
  // (e.g. the user record settling right after login) doesn't tear down
  // and restart ad loading multiple times in a row.
  useEffect(() => {
    if (!adsEligible) {
      setIsLoaded(false);
      adInstance.current = null;
      loadToken.current++; // invalidate any in-flight load immediately
      isLoadingRef.current = false;
      return;
    }

    let cleanup = () => {};
    const debounceId = setTimeout(() => {
      cleanup = loadAd();
    }, 400);

    return () => {
      clearTimeout(debounceId);
      cleanup();
    };
  }, [adsEligible]);

  // Policy compliant routing handler method.
  // Includes a cooldown so gate() can't fire back-to-back across multiple
  // taps/buttons — excessive ad frequency is a real AdMob policy risk even
  // for rewarded interstitials, which don't require a pre-ad opt-in screen
  // but DO still need to avoid feeling intrusive/repetitive.
  const lastShownAt = useRef(0);
  const MIN_GATE_INTERVAL_MS = 30 * 1000; // don't re-show within 60s

  const gate = (navigationAction) => {
    const now = Date.now();
    const cooledDown = now - lastShownAt.current >= MIN_GATE_INTERVAL_MS;

    if (adsEligible && isLoaded && adInstance.current && cooledDown) {
      lastShownAt.current = now;
      nextAction.current = navigationAction;
      adInstance.current.show();
    } else {
      // Premium, still within first 90 days, ad not ready, or cooling
      // down — let them pass without delay.
      navigationAction();
    }
  };

  return (
    <AdGateContext.Provider
      value={{ gate, isLoaded, adsEligible, isPremium, isPastNinetyDays: pastNinetyDays }}
    >
      {children}
    </AdGateContext.Provider>
  );
};

export const useAdGate = () => {
  const context = useContext(AdGateContext);
  if (!context) {
    throw new Error("useAdGate hook must be mounted deep within an AdGateProvider framework tree");
  }
  return context;
};

// Returns true only when ALL of the following hold:
//   1. The user is NOT premium (no ads for premium users, ever)
//   2. 90 days have passed since account creation (user.createdAt)
//   3. A rewarded interstitial is actually loaded and ready right now
// Screens should treat this as "is it OK to call gate() expecting an ad
// to actually play", and must always fall through to their normal action
// when it's false — ad availability/eligibility must never block core
// app functionality.
export const useRewardAdsEnabled = () => {
  const context = useContext(AdGateContext);
  if (!context) return false;
  return context.adsEligible && context.isLoaded;
};

// Convenience hooks for screens that want to show different UI for
// premium users vs. users still within their first 90 days (e.g.
// "Ad-free for 47 more days" messaging), without needing the full
// ad-gate machinery.
export const useIsPremiumUser = () => {
  const context = useContext(AdGateContext);
  return context ? context.isPremium : false;
};

export const useIsPastNinetyDays = () => {
  const context = useContext(AdGateContext);
  return context ? context.isPastNinetyDays : false;
};