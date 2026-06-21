// // /**
// //  * AdsManager.jsx
// //  *
// //  * Exports:
// //  *   BannerAdComponent   — 50px banner, hidden for premium users
// //  *   RewardedAdModal     — modal with close button, plays rewarded ad inside
// //  *   useRewardedAdModal  — hook to control the modal from any screen
// //  *   AD_UNITS            — raw ad unit IDs
// //  */

// // import React, { useState, useMemo, useRef, useEffect } from "react";
// // import {
// //   View,
// //   Modal,
// //   Pressable,
// //   StyleSheet,
// //   Dimensions,
// //   Animated,
// // } from "react-native";
// // import {
// //   BannerAd,
// //   BannerAdSize,
// //   RewardedAd,
// //   RewardedAdEventType,
// //   TestIds,
// // } from "react-native-google-mobile-ads";
// // import { Ionicons } from "@expo/vector-icons";
// // import { useUser } from "../hook/useUser";
// // import ThemeText from "./ThemeText";

// // const { width: SCREEN_WIDTH } = Dimensions.get("window");

// // // ─────────────────────────────────────────────────────────────────────────────
// // // AD UNIT IDs
// // // ─────────────────────────────────────────────────────────────────────────────
// // export const AD_UNITS = {
// //   BANNER:   __DEV__ ? TestIds.BANNER   : "ca-app-pub-8923799920726415/1058769092",
// //   REWARDED: __DEV__ ? TestIds.REWARDED : "ca-app-pub-8923799920726415/9518542183",
// // };

// // // Modal dimensions
// // const MODAL_WIDTH  = SCREEN_WIDTH * 0.88;
// // const MODAL_HEIGHT = 320;

// // // ─────────────────────────────────────────────────────────────────────────────
// // // PREMIUM CHECK HOOK
// // // ─────────────────────────────────────────────────────────────────────────────
// // export const useIsPremium = () => {
// //   const { user } = useUser();
// //   return useMemo(() => {
// //     if (!user?.premium) return false;
// //     const now = new Date();
// //     const p   = user.premium;
// //     if (p.isPremium && p.premiumPlan === "lifetime") return true;
// //     if (p.isPremium && p.premiumExpiresAt && new Date(p.premiumExpiresAt) > now) return true;
// //     if (p.trialExpiresAt && new Date(p.trialExpiresAt) > now) return true;
// //     return false;
// //   }, [user]);
// // };

// // // ─────────────────────────────────────────────────────────────────────────────
// // // BANNER AD — 50px fixed height, hidden for premium users
// // // ─────────────────────────────────────────────────────────────────────────────
// // export const BannerAdComponent = ({ style }) => {
// //   const isPremium = useIsPremium();
// //   const [failed,  setFailed]  = useState(false);
// //   const [loaded,  setLoaded]  = useState(false);

// //   if (isPremium || failed) return null;

// //   return (
// //     <View style={[styles.bannerWrapper, style]}>
// //       {/* Fixed 50px container — ad fills it, no layout jump */}
// //       <View style={styles.bannerContainer}>
// //         <BannerAd
// //           unitId={AD_UNITS.BANNER}
// //           size={BannerAdSize.BANNER}          // 320×50 standard
// //           requestOptions={{ requestNonPersonalizedAdsOnly: true }}
// //           onAdLoaded={()      => { setLoaded(true); }}
// //           onAdFailedToLoad={(e) => { setFailed(true); console.log("Banner failed:", e?.message); }}
// //         />
// //       </View>
// //     </View>
// //   );
// // };

// // // ─────────────────────────────────────────────────────────────────────────────
// // // useRewardedAdModal HOOK
// // // Controls open/close + loads the rewarded ad
// // //
// // // Returns:
// // //   openAdModal()   — call this on button press to show the modal
// // //   modalProps      — spread onto <RewardedAdModal />
// // // ─────────────────────────────────────────────────────────────────────────────
// // export const useRewardedAdModal = ({
// //   onEarned    = () => {},
// //   onDismissed = () => {},
// // } = {}) => {
// //   const isPremium          = useIsPremium();
// //   const [visible, setVisible] = useState(false);

// //   const openAdModal = () => {
// //     if (isPremium) {
// //       // Premium users skip the ad — treat as earned immediately
// //       onEarned();
// //       return;
// //     }
// //     setVisible(true);
// //   };

// //   const closeAdModal = () => {
// //     setVisible(false);
// //     onDismissed();
// //   };

// //   const handleEarned = () => {
// //     setVisible(false);
// //     onEarned();
// //   };

// //   return {
// //     openAdModal,
// //     modalProps: {
// //       visible,
// //       onClose:  closeAdModal,
// //       onEarned: handleEarned,
// //     },
// //   };
// // };

// // // ─────────────────────────────────────────────────────────────────────────────
// // // REWARDED AD MODAL
// // // A contained modal card with a close icon and the rewarded ad playing inside.
// // //
// // // Props (spread from useRewardedAdModal().modalProps):
// // //   visible   — boolean
// // //   onClose   — called when user taps X or backdrop
// // //   onEarned  — called when reward is earned
// // // ─────────────────────────────────────────────────────────────────────────────
// // export const RewardedAdModal = ({ visible, onClose, onEarned }) => {
// //   const fadeAnim   = useRef(new Animated.Value(0)).current;
// //   const scaleAnim  = useRef(new Animated.Value(0.92)).current;

// //   const [adState, setAdState] = useState("idle"); // idle | loading | playing | earned | failed
// //   const rewardedRef           = useRef(null);

// //   // Animate in when visible
// //   useEffect(() => {
// //     if (visible) {
// //       setAdState("loading");
// //       Animated.parallel([
// //         Animated.timing(fadeAnim,  { toValue: 1, duration: 220, useNativeDriver: true }),
// //         Animated.spring(scaleAnim, { toValue: 1, friction: 7,   useNativeDriver: true }),
// //       ]).start();
// //       loadAd();
// //     } else {
// //       fadeAnim.setValue(0);
// //       scaleAnim.setValue(0.92);
// //       setAdState("idle");
// //     }
// //   }, [visible]);

// //   const loadAd = () => {
// //     const rewarded = RewardedAd.createForAdRequest(AD_UNITS.REWARDED, {
// //       requestNonPersonalizedAdsOnly: true,
// //     });
// //     rewardedRef.current = rewarded;

// //     rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
// //       setAdState("playing");
// //       rewarded.show();
// //     });

// //     rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
// //       setAdState("earned");
// //       onEarned?.();
// //     });

// //     rewarded.addAdEventListener("closed", () => {
// //       // If closed without earning, just close modal
// //       if (adState !== "earned") onClose?.();
// //     });

// //     rewarded.addAdEventListener("error", () => {
// //       setAdState("failed");
// //     });

// //     rewarded.load();
// //   };

// //   if (!visible) return null;

// //   const stateLabel = {
// //     idle:    "",
// //     loading: "Loading ad…",
// //     playing: "Ad is playing…",
// //     earned:  "Reward earned! 🎉",
// //     failed:  "Ad unavailable",
// //   }[adState];

// //   const stateIcon = {
// //     loading: "time-outline",
// //     playing: "play-circle-outline",
// //     earned:  "checkmark-circle-outline",
// //     failed:  "alert-circle-outline",
// //   }[adState];

// //   const stateColor = {
// //     loading: "#6366f1",
// //     playing: "#059669",
// //     earned:  "#059669",
// //     failed:  "#dc2626",
// //   }[adState];

// //   return (
// //     <Modal
// //       transparent
// //       visible={visible}
// //       animationType="none"
// //       statusBarTranslucent
// //       onRequestClose={onClose}
// //     >
// //       {/* Backdrop */}
// //       <Pressable style={styles.backdrop} onPress={onClose}>
// //         {/* Card — stop backdrop press leaking through */}
// //         <Animated.View
// //           style={[
// //             styles.modalCard,
// //             { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
// //           ]}
// //         >
// //           <Pressable onPress={() => {}} style={{ width: "100%" }}>

// //             {/* ── Header ── */}
// //             <View style={styles.modalHeader}>
// //               <ThemeText style={styles.modalTitle}>Sponsored</ThemeText>
// //               <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={12}>
// //                 <Ionicons name="close" size={20} color="#6b7280" />
// //               </Pressable>
// //             </View>

// //             {/* ── Ad content area ── */}
// //             <View style={styles.adArea}>
// //               {/* State icon */}
// //               {stateIcon && (
// //                 <Ionicons name={stateIcon} size={48} color={stateColor} />
// //               )}

// //               {/* State label */}
// //               {stateLabel ? (
// //                 <ThemeText style={[styles.adStateText, { color: stateColor }]}>
// //                   {stateLabel}
// //                 </ThemeText>
// //               ) : null}

// //               {/* Inline banner inside the modal for visual content */}
// //               {(adState === "loading" || adState === "playing") && (
// //                 <View style={styles.inlineBanner}>
// //                   <BannerAd
// //                     unitId={AD_UNITS.BANNER}
// //                     size={BannerAdSize.MEDIUM_RECTANGLE}
// //                     requestOptions={{ requestNonPersonalizedAdsOnly: true }}
// //                   />
// //                 </View>
// //               )}

// //               {/* Failed state */}
// //               {adState === "failed" && (
// //                 <Pressable onPress={loadAd} style={styles.retryBtn}>
// //                   <ThemeText style={styles.retryText}>Try again</ThemeText>
// //                 </Pressable>
// //               )}
// //             </View>

// //             {/* ── Footer ── */}
// //             <View style={styles.modalFooter}>
// //               <ThemeText style={styles.footerText}>
// //                 {adState === "earned"
// //                   ? "Thanks for watching!"
// //                   : "Watch the ad to continue"}
// //               </ThemeText>
// //             </View>

// //           </Pressable>
// //         </Animated.View>
// //       </Pressable>
// //     </Modal>
// //   );
// // };

// // // ─────────────────────────────────────────────────────────────────────────────
// // // STYLES
// // // ─────────────────────────────────────────────────────────────────────────────
// // const styles = StyleSheet.create({
// //   // ── Banner ──
// //   bannerWrapper: {
// //     width:           "100%",
// //     alignItems:      "center",
// //     backgroundColor: "transparent",
// //   },
// //   bannerContainer: {
// //     width:           "100%",
// //     height:          50,           // fixed 50px — never shifts layout
// //     alignItems:      "center",
// //     justifyContent:  "center",
// //     overflow:        "hidden",
// //   },

// //   // ── Modal backdrop ──
// //   backdrop: {
// //     flex:            1,
// //     backgroundColor: "rgba(0,0,0,0.55)",
// //     justifyContent:  "center",
// //     alignItems:      "center",
// //   },

// //   // ── Modal card ──
// //   modalCard: {
// //     width:           MODAL_WIDTH,
// //     minHeight:       MODAL_HEIGHT,
// //     backgroundColor: "#ffffff",
// //     borderRadius:    20,
// //     overflow:        "hidden",
// //     shadowColor:     "#000",
// //     shadowOffset:    { width: 0, height: 8 },
// //     shadowOpacity:   0.18,
// //     shadowRadius:    16,
// //     elevation:       10,
// //   },

// //   // ── Modal header ──
// //   modalHeader: {
// //     flexDirection:   "row",
// //     alignItems:      "center",
// //     justifyContent:  "space-between",
// //     paddingHorizontal: 16,
// //     paddingTop:      14,
// //     paddingBottom:   10,
// //     borderBottomWidth: 1,
// //     borderBottomColor: "rgba(0,0,0,0.06)",
// //   },
// //   modalTitle: {
// //     fontSize:   13,
// //     fontWeight: "600",
// //     color:      "#9ca3af",
// //     letterSpacing: 0.5,
// //     textTransform: "uppercase",
// //   },
// //   closeBtn: {
// //     width:          32,
// //     height:         32,
// //     borderRadius:   16,
// //     backgroundColor: "rgba(0,0,0,0.06)",
// //     alignItems:     "center",
// //     justifyContent: "center",
// //   },

// //   // ── Ad content area ──
// //   adArea: {
// //     flex:           1,
// //     minHeight:      200,
// //     alignItems:     "center",
// //     justifyContent: "center",
// //     paddingVertical: 20,
// //     gap:            12,
// //   },
// //   adStateText: {
// //     fontSize:   14,
// //     fontWeight: "600",
// //     textAlign:  "center",
// //   },
// //   inlineBanner: {
// //     marginTop:  10,
// //     alignItems: "center",
// //   },

// //   // ── Retry button ──
// //   retryBtn: {
// //     marginTop:       12,
// //     paddingVertical: 10,
// //     paddingHorizontal: 24,
// //     backgroundColor: "#6366f1",
// //     borderRadius:    10,
// //   },
// //   retryText: {
// //     color:      "#fff",
// //     fontWeight: "600",
// //     fontSize:   14,
// //   },

// //   // ── Modal footer ──
// //   modalFooter: {
// //     paddingHorizontal: 16,
// //     paddingVertical:   12,
// //     borderTopWidth:    1,
// //     borderTopColor:    "rgba(0,0,0,0.06)",
// //     alignItems:        "center",
// //   },
// //   footerText: {
// //     fontSize: 12,
// //     color:    "#9ca3af",
// //   },
// // });





// /**
//  * AdsManager.jsx (REFACTORED)
//  *
//  * Exports:
//  *  - BannerAdComponent
//  *  - RewardedAdModal
//  *  - useRewardedAdModal (low-level)
//  *  - useAdGate (🔥 HIGH-LEVEL reusable system)
//  *  - AD_UNITS
//  */



// // import React, { useState, useMemo, useRef, useEffect } from "react";
// // import {
// //   View,
// //   Modal,
// //   Pressable,
// //   StyleSheet,
// //   Dimensions,
// //   Animated,
// // } from "react-native";

// // import {
// //   BannerAd,
// //   BannerAdSize,
// //   RewardedAd,
// //   RewardedAdEventType,
// //   TestIds,
// // } from "react-native-google-mobile-ads";

// // import { Ionicons } from "@expo/vector-icons";
// // import { useUser } from "../hook/useUser";
// // import ThemeText from "./ThemeText";

// // const { width: SCREEN_WIDTH } = Dimensions.get("window");

// // // ─────────────────────────────────────────────
// // // AD UNITS
// // // ─────────────────────────────────────────────
// // export const AD_UNITS = {
// //   BANNER: __DEV__
// //     ? TestIds.BANNER
// //     : "ca-app-pub-8923799920726415/1058769092",

// //   REWARDED: __DEV__
// //     ? TestIds.REWARDED
// //     : "ca-app-pub-8923799920726415/9518542183",
// // };

// // // ─────────────────────────────────────────────
// // // PREMIUM CHECK
// // // ─────────────────────────────────────────────
// // export const useIsPremium = () => {
// //   const { user } = useUser();

// //   return useMemo(() => {
// //     if (!user?.premium) return false;

// //     const now = new Date();
// //     const p = user.premium;

// //     if (p.isPremium && p.premiumPlan === "lifetime") return true;
// //     if (p.isPremium && p.premiumExpiresAt && new Date(p.premiumExpiresAt) > now)
// //       return true;
// //     if (p.trialExpiresAt && new Date(p.trialExpiresAt) > now)
// //       return true;

// //     return false;
// //   }, [user]);
// // };

// // // ─────────────────────────────────────────────
// // // BANNER AD
// // // ─────────────────────────────────────────────
// // export const BannerAdComponent = ({ style }) => {
// //   const isPremium = useIsPremium();
// //   const [failed, setFailed] = useState(false);

// //   if (isPremium || failed) return null;

// //   return (
// //     <View style={[styles.bannerWrapper, style]}>
// //       <View style={styles.bannerContainer}>
// //         <BannerAd
// //           unitId={AD_UNITS.BANNER}
// //           size={BannerAdSize.BANNER}
// //           requestOptions={{ requestNonPersonalizedAdsOnly: true }}
// //           onAdFailedToLoad={(e) => {
// //             setFailed(true);
// //             console.log("Banner failed:", e?.message);
// //           }}
// //         />
// //       </View>
// //     </View>
// //   );
// // };

// // // ─────────────────────────────────────────────
// // // LOW LEVEL HOOK (unchanged core logic)
// // // ─────────────────────────────────────────────
// // export const useRewardedAdModal = ({ onEarned = () => {}, onDismissed = () => {} } = {}) => {
// //   const isPremium = useIsPremium();
// //   const [visible, setVisible] = useState(false);

// //   const openAdModal = () => {
// //     if (isPremium) {
// //       onEarned();
// //       return;
// //     }
// //     setVisible(true);
// //   };

// //   const closeAdModal = () => {
// //     setVisible(false);
// //     onDismissed();
// //   };

// //   const handleEarned = () => {
// //     setVisible(false);
// //     onEarned();
// //   };

// //   return {
// //     openAdModal,
// //     modalProps: {
// //       visible,
// //       onClose: closeAdModal,
// //       onEarned: handleEarned,
// //     },
// //   };
// // };

// // // ─────────────────────────────────────────────
// // // 🔥 HIGH LEVEL HOOK (REUSABLE ACROSS APP)
// // // ─────────────────────────────────────────────
// // export const useAdGate = (config = {}) => {
// //   const pendingAction = useRef(null);
// //   const lastAdTime = useRef(0);

// //   const { openAdModal, modalProps } = useRewardedAdModal({
// //     onEarned: () => {
// //       if (pendingAction.current) {
// //         pendingAction.current();
// //         pendingAction.current = null;
// //       }
// //       config.onEarned?.();
// //     },

// //     onDismissed: () => {
// //       pendingAction.current = null;
// //       config.onDismissed?.();
// //     },
// //   });

// //   const gate = (action, options = {}) => {
// //     if (typeof action !== "function") return;

// //     const now = Date.now();
// //     const cooldown = options.cooldown ?? 0;

// //     // Optional cooldown (prevents ad spam)
// //     if (cooldown && now - lastAdTime.current < cooldown) {
// //       action();
// //       return;
// //     }

// //     lastAdTime.current = now;
// //     pendingAction.current = action;
// //     openAdModal();
// //   };

// //   return {
// //     gate,
// //     modalProps,
// //   };
// // };

// // // ─────────────────────────────────────────────
// // // REWARDED MODAL
// // // ─────────────────────────────────────────────
// // export const RewardedAdModal = ({ visible, onClose, onEarned }) => {
// //   const fadeAnim = useRef(new Animated.Value(0)).current;
// //   const scaleAnim = useRef(new Animated.Value(0.92)).current;

// //   const [state, setState] = useState("idle");
// //   const rewardedRef = useRef(null);

// //   useEffect(() => {
// //     if (!visible) return;

// //     setState("loading");

// //     Animated.parallel([
// //       Animated.timing(fadeAnim, {
// //         toValue: 1,
// //         duration: 220,
// //         useNativeDriver: true,
// //       }),
// //       Animated.spring(scaleAnim, {
// //         toValue: 1,
// //         friction: 7,
// //         useNativeDriver: true,
// //       }),
// //     ]).start();

// //     loadAd();

// //     return () => {
// //       fadeAnim.setValue(0);
// //       scaleAnim.setValue(0.92);
// //       setState("idle");
// //     };
// //   }, [visible]);

// //   const loadAd = () => {
// //     const rewarded = RewardedAd.createForAdRequest(AD_UNITS.REWARDED, {
// //       requestNonPersonalizedAdsOnly: true,
// //     });

// //     rewardedRef.current = rewarded;

// //     rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
// //       setState("playing");
// //       rewarded.show();
// //     });

// //     rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
// //       setState("earned");
// //       onEarned?.();
// //     });

// //     rewarded.addAdEventListener("closed", () => {
// //       if (state !== "earned") onClose?.();
// //     });

// //     rewarded.addAdEventListener("error", () => {
// //       setState("failed");
// //     });

// //     rewarded.load();
// //   };

// //   if (!visible) return null;

// //   const label =
// //     state === "loading"
// //       ? "Loading ad..."
// //       : state === "playing"
// //       ? "Ad playing..."
// //       : state === "earned"
// //       ? "Reward earned 🎉"
// //       : "Ad failed";

// //   return (
// //     <Modal transparent visible={visible} animationType="none">
// //       <Pressable style={styles.backdrop} onPress={onClose}>
// //         <Animated.View
// //           style={[
// //             styles.modalCard,
// //             { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
// //           ]}
// //         >
// //           <Pressable style={{ width: "100%" }}>
// //             <View style={styles.modalHeader}>
// //               <ThemeText style={styles.modalTitle}>Sponsored</ThemeText>
// //               <Pressable onPress={onClose}>
// //                 <Ionicons name="close" size={20} color="#666" />
// //               </Pressable>
// //             </View>

// //             <View style={styles.adArea}>
// //               <ThemeText>{label}</ThemeText>
// //             </View>

// //             <View style={styles.footer}>
// //               <ThemeText style={styles.footerText}>
// //                 Watch ad to continue
// //               </ThemeText>
// //             </View>
// //           </Pressable>
// //         </Animated.View>
// //       </Pressable>
// //     </Modal>
// //   );
// // };

// // // ─────────────────────────────────────────────
// // // STYLES
// // // ─────────────────────────────────────────────
// // const styles = StyleSheet.create({
// //   bannerWrapper: { width: "100%", alignItems: "center" },
// //   bannerContainer: {
// //     width: "100%",
// //     height: 50,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     overflow: "hidden",
// //   },

// //   backdrop: {
// //     flex: 1,
// //     backgroundColor: "rgba(0,0,0,0.55)",
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },

// //   modalCard: {
// //     width: SCREEN_WIDTH * 0.85,
// //     minHeight: 280,
// //     backgroundColor: "#fff",
// //     borderRadius: 18,
// //     overflow: "hidden",
// //   },

// //   modalHeader: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     padding: 14,
// //   },

// //   modalTitle: {
// //     fontSize: 12,
// //     fontWeight: "600",
// //     color: "#888",
// //   },

// //   adArea: {
// //     flex: 1,
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },

// //   footer: {
// //     padding: 12,
// //     borderTopWidth: 1,
// //     borderTopColor: "#eee",
// //     alignItems: "center",
// //   },

// //   footerText: {
// //     fontSize: 12,
// //     color: "#999",
// //   },
// // });



// // import React, { useState, useMemo, useRef, useEffect } from "react";
// // import {
// //   View,
// //   Modal,
// //   Pressable,
// //   StyleSheet,
// //   Dimensions,
// //   Animated,
// // } from "react-native";

// // import {
// //   BannerAd,
// //   BannerAdSize,
// //   RewardedAd,
// //   RewardedAdEventType,
// //   TestIds,
// // } from "react-native-google-mobile-ads";

// // import { Ionicons } from "@expo/vector-icons";
// // import { useUser } from "../hook/useUser";
// // import ThemeText from "./ThemeText";

// // const { width: SCREEN_WIDTH } = Dimensions.get("window");

// // // ─────────────────────────────────────────────
// // // AD UNITS
// // // ─────────────────────────────────────────────
// // export const AD_UNITS = {
// //   BANNER: __DEV__
// //     ? TestIds.BANNER
// //     : "ca-app-pub-8923799920726415/1058769092",

// //   REWARDED: __DEV__
// //     ? TestIds.REWARDED
// //     : "ca-app-pub-8923799920726415/9518542183",
// // };

// // // ─────────────────────────────────────────────
// // // PREMIUM CHECK
// // // ─────────────────────────────────────────────
// // export const useIsPremium = () => {
// //   const { user } = useUser();

// //   return useMemo(() => {
// //     if (!user?.premium) return false;

// //     const now = new Date();
// //     const p = user.premium;

// //     if (p.isPremium && p.premiumPlan === "lifetime") return true;
// //     if (p.isPremium && p.premiumExpiresAt && new Date(p.premiumExpiresAt) > now)
// //       return true;
// //     if (p.trialExpiresAt && new Date(p.trialExpiresAt) > now)
// //       return true;

// //     return false;
// //   }, [user]);
// // };

// // // ─────────────────────────────────────────────
// // // BANNER AD
// // // ─────────────────────────────────────────────
// // export const BannerAdComponent = ({ style }) => {
// //   const isPremium = useIsPremium();
// //   const [failed, setFailed] = useState(false);

// //   if (isPremium || failed) return null;

// //   return (
// //     <View style={[styles.bannerWrapper, style]}>
// //       <View style={styles.bannerContainer}>
// //         <BannerAd
// //           unitId={AD_UNITS.BANNER}
// //           size={BannerAdSize.BANNER}
// //           requestOptions={{ requestNonPersonalizedAdsOnly: true }}
// //           onAdFailedToLoad={(e) => {
// //             setFailed(true);
// //             console.log("Banner failed:", e?.message);
// //           }}
// //         />
// //       </View>
// //     </View>
// //   );
// // };

// // // ─────────────────────────────────────────────
// // // LOW LEVEL HOOK
// // // ─────────────────────────────────────────────
// // export const useRewardedAdModal = ({ onEarned = () => {}, onDismissed = () => {} } = {}) => {
// //   const isPremium = useIsPremium();
// //   const [visible, setVisible] = useState(false);

// //   const openAdModal = () => {
// //     if (isPremium) {
// //       onEarned();
// //       return;
// //     }
// //     setVisible(true);
// //   };

// //   const closeAdModal = () => {
// //     setVisible(false);
// //     onDismissed();
// //   };

// //   const handleEarned = () => {
// //     setVisible(false);
// //     onEarned();
// //   };

// //   return {
// //     openAdModal,
// //     modalProps: {
// //       visible,
// //       onClose: closeAdModal,
// //       onEarned: handleEarned,
// //     },
// //   };
// // };

// // // ─────────────────────────────────────────────
// // // HIGH LEVEL HOOK
// // // ─────────────────────────────────────────────
// // export const useAdGate = (config = {}) => {
// //   const pendingAction = useRef(null);
// //   const lastAdTime = useRef(0);

// //   const { openAdModal, modalProps } = useRewardedAdModal({
// //     onEarned: () => {
// //       if (pendingAction.current) {
// //         pendingAction.current();
// //         pendingAction.current = null;
// //       }
// //       config.onEarned?.();
// //     },

// //     onDismissed: () => {
// //       pendingAction.current = null;
// //       config.onDismissed?.();
// //     },
// //   });

// //   const gate = (action, options = {}) => {
// //     if (typeof action !== "function") return;

// //     const now = Date.now();
// //     const cooldown = options.cooldown ?? 0;

// //     if (cooldown && now - lastAdTime.current < cooldown) {
// //       action();
// //       return;
// //     }

// //     lastAdTime.current = now;
// //     pendingAction.current = action;
// //     openAdModal();
// //   };

// //   return {
// //     gate,
// //     modalProps,
// //   };
// // };

// // // ─────────────────────────────────────────────
// // // REWARDED MODAL
// // // ─────────────────────────────────────────────
// // export const RewardedAdModal = ({ visible, onClose, onEarned }) => {
// //   const fadeAnim = useRef(new Animated.Value(0)).current;
// //   const scaleAnim = useRef(new Animated.Value(0.92)).current;

// //   const [state, setState] = useState("idle");
// //   const stateRef = useRef("idle"); // Fixes stale closure tracking
// //   const rewardedRef = useRef(null);

// //   // Sync state tracking ref safely
// //   const updateState = (newState) => {
// //     setState(newState);
// //     stateRef.current = newState;
// //   };

// //   useEffect(() => {
// //     if (!visible) return;

// //     updateState("loading");

// //     Animated.parallel([
// //       Animated.timing(fadeAnim, {
// //         toValue: 1,
// //         duration: 220,
// //         useNativeDriver: true,
// //       }),
// //       Animated.spring(scaleAnim, {
// //         toValue: 1,
// //         friction: 7,
// //         useNativeDriver: true,
// //       }),
// //     ]).start();

// //     // Instantiate Google Mobile Ad
// //     const rewarded = RewardedAd.createForAdRequest(AD_UNITS.REWARDED, {
// //       requestNonPersonalizedAdsOnly: true,
// //     });
// //     rewardedRef.current = rewarded;

// //     const l1 = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
// //       updateState("playing");
// //       rewarded.show();
// //     });

// //     const l2 = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
// //       updateState("earned");
// //       onEarned?.();
// //     });

// //     const l3 = rewarded.addAdEventListener("closed", () => {
// //       // Accessing mutable ref prevents evaluating old state closures
// //       if (stateRef.current !== "earned") {
// //         onClose?.();
// //       }
// //     });

// //     const l4 = rewarded.addAdEventListener("error", (err) => {
// //       console.log("Ad Error: ", err?.message);
// //       updateState("failed");
// //     });

// //     rewarded.load();

// //     // Clean up animation states & unlisten listeners to avoid memory leaks
// //     return () => {
// //       fadeAnim.setValue(0);
// //       scaleAnim.setValue(0.92);
// //       updateState("idle");
      
// //       try {
// //         l1(); l2(); l3(); l4();
// //       } catch (e) {
// //         // Fallback catch-all clean up
// //         rewarded.removeAllListeners();
// //       }
// //     };
// //   }, [visible]);

// //   if (!visible) return null;

// //   const label =
// //     state === "loading"
// //       ? "Loading ad..."
// //       : state === "playing"
// //       ? "Ad playing..."
// //       : state === "earned"
// //       ? "Reward earned 🎉"
// //       : "Ad failed";

// //   return (
// //     <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
// //       <Pressable style={styles.backdrop} onPress={onClose}>
// //         <Animated.View
// //           style={[
// //             styles.modalCard,
// //             { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
// //           ]}
// //         >
// //           {/* Added flex: 1 to ensure structural layout scales correctly */}
// //           <Pressable style={styles.modalContent}>
// //             <View style={styles.modalHeader}>
// //               <ThemeText style={styles.modalTitle}>Sponsored</ThemeText>
// //               <Pressable onPress={onClose}>
// //                 <Ionicons name="close" size={20} color="#666" />
// //               </Pressable>
// //             </View>

// //             <View style={styles.adArea}>
// //               <ThemeText>{label}</ThemeText>
// //             </View>

// //             <View style={styles.footer}>
// //               <ThemeText style={styles.footerText}>
// //                 Watch ad to continue
// //               </ThemeText>
// //             </View>
// //           </Pressable>
// //         </Animated.View>
// //       </Pressable>
// //     </Modal>
// //   );
// // };

// // // ─────────────────────────────────────────────
// // // STYLES
// // // ─────────────────────────────────────────────
// // const styles = StyleSheet.create({
// //   bannerWrapper: { width: "100%", alignItems: "center" },
// //   bannerContainer: {
// //     width: "100%",
// //     height: 50,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     overflow: "hidden",
// //   },

// //   backdrop: {
// //     flex: 1,
// //     backgroundColor: "rgba(0,0,0,0.55)",
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },

// //   modalCard: {
// //     width: SCREEN_WIDTH * 0.85,
// //     minHeight: 280,
// //     backgroundColor: "#fff",
// //     borderRadius: 18,
// //     overflow: "hidden",
// //   },
  
// //   modalContent: {
// //     flex: 1,
// //     width: "100%",
// //   },

// //   modalHeader: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     padding: 14,
// //   },

// //   modalTitle: {
// //     fontSize: 12,
// //     fontWeight: "600",
// //     color: "#888",
// //   },

// //   adArea: {
// //     flex: 1,
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },

// //   footer: {
// //     padding: 12,
// //     borderTopWidth: 1,
// //     borderTopColor: "#eee",
// //     alignItems: "center",
// //   },

// //   footerText: {
// //     fontSize: 12,
// //     color: "#999",
// //   },
// // });





// /**
//  * AdsManager.jsx
//  *
//  * Exports:
//  * BannerAdComponent   — 50px standard banner, auto-hidden for premium and offline users
//  * RewardedAdModal     — Context-isolated animated modal containing the Google Rewarded Ad
//  * useRewardedAdModal  — Low-level state hook controller
//  * useAdGate           — High-level event protection hook with action execution and optional cooldowns
//  * AD_UNITS            — Global centralized layout resource Ad Unit IDs
//  */

// import React, { useState, useMemo, useRef, useEffect } from "react";
// import {
//   View,
//   Modal,
//   Pressable,
//   StyleSheet,
//   Dimensions,
//   Animated,
// } from "react-native";

// import {
//   BannerAd,
//   BannerAdSize,
//   RewardedAd,
//   RewardedAdEventType,
//   TestIds,
// } from "react-native-google-mobile-ads";

// import NetInfo from "@react-native-community/netinfo";
// import { Ionicons } from "@expo/vector-icons";
// import { useUser } from "../hook/useUser";
// import ThemeText from "./ThemeText";

// const { width: SCREEN_WIDTH } = Dimensions.get("window");

// // ─────────────────────────────────────────────
// // AD UNITS
// // ─────────────────────────────────────────────
// export const AD_UNITS = {
//   BANNER: __DEV__
//     ? TestIds.BANNER
//     : "ca-app-pub-8923799920726415/1058769092",

//   REWARDED: __DEV__
//     ? TestIds.REWARDED
//     : "ca-app-pub-8923799920726415/9518542183",
// };

// // ─────────────────────────────────────────────
// // PREMIUM CHECK
// // ─────────────────────────────────────────────
// export const useIsPremium = () => {
//   const { user } = useUser();

//   return useMemo(() => {
//     if (!user?.premium) return false;

//     const now = new Date();
//     const p = user.premium;

//     if (p.isPremium && p.premiumPlan === "lifetime") return true;
//     if (p.isPremium && p.premiumExpiresAt && new Date(p.premiumExpiresAt) > now)
//       return true;
//     if (p.trialExpiresAt && new Date(p.trialExpiresAt) > now)
//       return true;

//     return false;
//   }, [user]);
// };

// // ─────────────────────────────────────────────
// // BANNER AD
// // ─────────────────────────────────────────────
// export const BannerAdComponent = ({ style }) => {
//   const isPremium = useIsPremium();
//   const [failed, setFailed] = useState(false);
//   const [isOnline, setIsOnline] = useState(true);

//   // Monitor network connectivity state to prevent ad rendering crashes while offline
//   useEffect(() => {
//     const unsubscribe = NetInfo.addEventListener((state) => {
//       setIsOnline(!!state.isConnected && !!state.isInternetReachable);
//     });
//     return () => unsubscribe();
//   }, []);

//   if (isPremium || failed || !isOnline) return null;

//   return (
//     <View style={[styles.bannerWrapper, style]}>
//       <View style={styles.bannerContainer}>
//         <BannerAd
//           unitId={AD_UNITS.BANNER}
//           size={BannerAdSize.BANNER}
//           requestOptions={{ requestNonPersonalizedAdsOnly: true }}
//           onAdFailedToLoad={(e) => {
//             setFailed(true);
//             console.log("Banner failed:", e?.message);
//           }}
//         />
//       </View>
//     </View>
//   );
// };

// // ─────────────────────────────────────────────
// // LOW LEVEL HOOK
// // ─────────────────────────────────────────────
// export const useRewardedAdModal = ({ onEarned = () => {}, onDismissed = () => {} } = {}) => {
//   const isPremium = useIsPremium();
//   const [visible, setVisible] = useState(false);

//   const openAdModal = () => {
//     if (isPremium) {
//       onEarned();
//       return;
//     }
//     setVisible(true);
//   };

//   const closeAdModal = () => {
//     setVisible(false);
//     onDismissed();
//   };

//   const handleEarned = () => {
//     setVisible(false);
//     onEarned();
//   };

//   return {
//     openAdModal,
//     modalProps: {
//       visible,
//       onClose: closeAdModal,
//       onEarned: handleEarned,
//     },
//   };
// };

// // ─────────────────────────────────────────────
// // HIGH LEVEL HOOK
// // ─────────────────────────────────────────────
// export const useAdGate = (config = {}) => {
//   const pendingAction = useRef(null);
//   const lastAdTime = useRef(0);

//   const { openAdModal, modalProps } = useRewardedAdModal({
//     onEarned: () => {
//       if (pendingAction.current) {
//         pendingAction.current();
//         pendingAction.current = null;
//       }
//       config.onEarned?.();
//     },

//     onDismissed: () => {
//       pendingAction.current = null;
//       config.onDismissed?.();
//     },
//   });

//   const gate = (action, options = {}) => {
//     if (typeof action !== "function") return;

//     const now = Date.now();
//     const cooldown = options.cooldown ?? 0;

//     if (cooldown && now - lastAdTime.current < cooldown) {
//       action();
//       return;
//     }

//     lastAdTime.current = now;
//     pendingAction.current = action;
//     openAdModal();
//   };

//   return {
//     gate,
//     modalProps,
//   };
// };

// // ─────────────────────────────────────────────
// // REWARDED MODAL
// // ─────────────────────────────────────────────
// export const RewardedAdModal = ({ visible, onClose, onEarned }) => {
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const scaleAnim = useRef(new Animated.Value(0.92)).current;

//   const [state, setState] = useState("idle");
//   const stateRef = useRef("idle"); 
//   const rewardedRef = useRef(null);

//   // Sync state tracking ref safely to avoid stale state context inside event callbacks
//   const updateState = (newState) => {
//     setState(newState);
//     stateRef.current = newState;
//   };

//   useEffect(() => {
//     if (!visible) return;

//     updateState("loading");

//     Animated.parallel([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 220,
//         useNativeDriver: true,
//       }),
//       Animated.spring(scaleAnim, {
//         toValue: 1,
//         friction: 7,
//         useNativeDriver: true,
//       }),
//     ]).start();

//     // Instantiate Google Mobile Ad Request Instance
//     const rewarded = RewardedAd.createForAdRequest(AD_UNITS.REWARDED, {
//       requestNonPersonalizedAdsOnly: true,
//     });
//     rewardedRef.current = rewarded;

//     const l1 = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
//       updateState("playing");
//       rewarded.show();
//     });

//     const l2 = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
//       updateState("earned");
//       onEarned?.();
//     });

//     const l3 = rewarded.addAdEventListener("closed", () => {
//       if (stateRef.current !== "earned") {
//         onClose?.();
//       }
//     });

//     const l4 = rewarded.addAdEventListener("error", (err) => {
//       console.log("Ad Error: ", err?.message);
//       updateState("failed");
//     });

//     rewarded.load();

//     // Clean up animation states & unregister listeners to eliminate memory leaks
//     return () => {
//       fadeAnim.setValue(0);
//       scaleAnim.setValue(0.92);
//       updateState("idle");
      
//       try {
//         l1(); l2(); l3(); l4();
//       } catch (e) {
//         // Fallback robust unmount listener scrub execution
//         rewarded.removeAllListeners();
//       }
//     };
//   }, [visible]);

//   if (!visible) return null;

//   const label =
//     state === "loading"
//       ? "Loading ad..."
//       : state === "playing"
//       ? "Ad playing..."
//       : state === "earned"
//       ? "Reward earned 🎉"
//       : "Ad failed";

//   return (
//     <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
//       <Pressable style={styles.backdrop} onPress={onClose}>
//         <Animated.View
//           style={[
//             styles.modalCard,
//             { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
//           ]}
//         >
//           <Pressable style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <ThemeText style={styles.modalTitle}>Sponsored</ThemeText>
//               <Pressable onPress={onClose} hitSlop={8}>
//                 <Ionicons name="close" size={20} color="#666" />
//               </Pressable>
//             </View>

//             <View style={styles.adArea}>
//               <ThemeText>{label}</ThemeText>
//             </View>

//             <View style={styles.footer}>
//               <ThemeText style={styles.footerText}>
//                 Watch ad to continue
//               </ThemeText>
//             </View>
//           </Pressable>
//         </Animated.View>
//       </Pressable>
//     </Modal>
//   );
// };

// // ─────────────────────────────────────────────
// // STYLES
// // ─────────────────────────────────────────────
// const styles = StyleSheet.create({
//   bannerWrapper: { 
//     width: "100%", 
//     alignItems: "center" 
//   },
//   bannerContainer: {
//     width: "100%",
//     height: 50,
//     justifyContent: "center",
//     alignItems: "center",
//     overflow: "hidden",
//   },
//   backdrop: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.55)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalCard: {
//     width: SCREEN_WIDTH * 0.85,
//     minHeight: 280,
//     backgroundColor: "#fff",
//     borderRadius: 18,
//     overflow: "hidden",
//   },
//   modalContent: {
//     flex: 1,
//     width: "100%",
//   },
//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 14,
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     borderBottomColor: "#eee",
//   },
//   modalTitle: {
//     fontSize: 12,
//     fontWeight: "600",
//     color: "#888",
//   },
//   adArea: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   footer: {
//     padding: 12,
//     borderTopWidth: 1,
//     borderTopColor: "#eee",
//     alignItems: "center",
//   },
//   footerText: {
//     fontSize: 12,
//     color: "#999",
//   },
// });



import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  View,
  Modal,
  Pressable,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";

import {
  BannerAd,
  BannerAdSize,
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from "react-native-google-mobile-ads";

import NetInfo from "@react-native-community/netinfo";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "../hook/useUser";
import ThemeText from "./ThemeText";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ─────────────────────────────────────────────
// AD UNITS
// ─────────────────────────────────────────────
export const AD_UNITS = {
  BANNER: __DEV__
    ? TestIds.BANNER
    : "ca-app-pub-8923799920726415/1058769092",

  REWARDED: __DEV__
    ? TestIds.REWARDED
    : "ca-app-pub-8923799920726415/9518542183",
};

// ─────────────────────────────────────────────
// PREMIUM CHECK
// Premium/subscribed users never see this rewarded ad. Everyone else
// (including users inside their 30-day welcome bonus) sees it on demand
// whenever a gated action is taken — there is no grace period here.
// That 90-day rule belongs ONLY to the rewarded INTERSTITIAL system in
// hook/useRewardAdsEnabled.js (Home/Timetable screens), not this one.
// ─────────────────────────────────────────────
export const useIsPremium = () => {
  const { user } = useUser();

  return useMemo(() => {
    if (!user?.premium) return false;

    const now = new Date();
    const p = user.premium;

    if (p.isPremium && p.premiumPlan === "lifetime") return true;
    if (p.isPremium && p.premiumExpiresAt && new Date(p.premiumExpiresAt) > now)
      return true;
    if (p.trialExpiresAt && new Date(p.trialExpiresAt) > now)
      return true;

    return false;
  }, [user]);
};

// ─────────────────────────────────────────────
// BANNER AD
// ─────────────────────────────────────────────
export const BannerAdComponent = ({ style }) => {
  const isPremium = useIsPremium();
  const [failed, setFailed] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Monitor network connectivity state to prevent ad rendering crashes while offline
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(!!state.isConnected && !!state.isInternetReachable);
    });
    return () => unsubscribe();
  }, []);

  if (isPremium || failed || !isOnline) return null;

  return (
    <View style={[styles.bannerWrapper, style]}>
      <View style={styles.bannerContainer}>
        <BannerAd
          unitId={AD_UNITS.BANNER}
          size={BannerAdSize.BANNER}
          requestOptions={{ requestNonPersonalizedAdsOnly: true }}
          onAdFailedToLoad={(e) => {
            setFailed(true);
            console.log("Banner failed:", e?.message);
          }}
        />
      </View>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────
// BACKGROUND REWARDED-AD PRELOADER
// Loads (and keeps reloading) a RewardedAd instance silently, with no UI,
// so callers can check readiness BEFORE deciding to show anything.
// ─────────────────────────────────────────────────────────────────────────
const useRewardedAdPreloader = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const adRef = useRef(null);

  const load = () => {
    setIsLoaded(false);

    const rewarded = RewardedAd.createForAdRequest(AD_UNITS.REWARDED, {
      requestNonPersonalizedAdsOnly: true,
    });
    adRef.current = rewarded;

    const unsubLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setIsLoaded(true);
    });

    const unsubError = rewarded.addAdEventListener("error", (err) => {
      console.log("Rewarded preload error:", err?.message);
      setIsLoaded(false);
      // Retry the load so a fresh ad is ready for next time.
      setTimeout(load, 5000);
    });

    rewarded.load();

    return () => {
      unsubLoaded();
      unsubError();
    };
  };

  useEffect(() => {
    const cleanup = load();
    return () => cleanup && cleanup();
  }, []);

  // Call this to actually show the currently-loaded ad. Returns true if
  // it could show, false if nothing was ready (caller should fall back).
  const showLoadedAd = ({ onEarned, onClosed, onError } = {}) => {
    const rewarded = adRef.current;
    if (!isLoaded || !rewarded) return false;

    const unsubEarned = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
      onEarned?.();
    });
    const unsubClosed = rewarded.addAdEventListener("closed", () => {
      unsubEarned();
      unsubClosed();
      setIsLoaded(false);
      load(); // pre-cache the next one
      onClosed?.();
    });
    const unsubError = rewarded.addAdEventListener("error", (err) => {
      unsubEarned();
      unsubClosed();
      unsubError();
      setIsLoaded(false);
      load();
      onError?.(err);
    });

    rewarded.show();
    return true;
  };

  return { isLoaded, showLoadedAd };
};

// ─────────────────────────────────────────────
// LOW LEVEL HOOK
// Now backed by the preloader — the modal is only ever told to become
// visible once an ad is confirmed loaded.
// ─────────────────────────────────────────────
export const useRewardedAdModal = ({ onEarned = () => {}, onDismissed = () => {} } = {}) => {
  const isPremium = useIsPremium();
  const [visible, setVisible] = useState(false);
  const { isLoaded, showLoadedAd } = useRewardedAdPreloader();

  // Returns true if the modal was actually opened, false if there was
  // nothing ready to show (caller should run their fallback action).
  const openAdModal = () => {
    if (isPremium) {
      // Premium users skip the ad — treat as earned immediately.
      onEarned();
      return true;
    }

    if (!isLoaded) {
      // Nothing ready — do NOT open a modal with no ad behind it.
      return false;
    }

    setVisible(true);
    return true;
  };

  const closeAdModal = () => {
    setVisible(false);
    onDismissed();
  };

  const handleEarned = () => {
    setVisible(false);
    onEarned();
  };

  return {
    openAdModal,
    isAdReady: isLoaded,
    modalProps: {
      visible,
      isLoaded,
      showLoadedAd,
      onClose: closeAdModal,
      onEarned: handleEarned,
    },
  };
};

// ─────────────────────────────────────────────
// HIGH LEVEL HOOK
// ─────────────────────────────────────────────
export const useAdGate = (config = {}) => {
  const pendingAction = useRef(null);
  const lastAdTime = useRef(0);

  const { openAdModal, modalProps } = useRewardedAdModal({
    onEarned: () => {
      if (pendingAction.current) {
        pendingAction.current();
        pendingAction.current = null;
      }
      config.onEarned?.();
    },

    onDismissed: () => {
      // If the modal is dismissed without earning the reward, still let
      // the user's action through — ads must never permanently block
      // core functionality.
      if (pendingAction.current) {
        pendingAction.current();
        pendingAction.current = null;
      }
      config.onDismissed?.();
    },
  });

  const gate = (action, options = {}) => {
    if (typeof action !== "function") return;

    const now = Date.now();
    const cooldown = options.cooldown ?? 0;

    // Cooldown not elapsed yet — skip the ad, just run the action.
    if (cooldown && now - lastAdTime.current < cooldown) {
      action();
      return;
    }

    pendingAction.current = action;
    const opened = openAdModal();

    if (opened) {
      lastAdTime.current = now;
    } else {
      // No ad ready — never block the user, just proceed.
      pendingAction.current = null;
      action();
    }
  };

  return {
    gate,
    modalProps,
  };
};

// ─────────────────────────────────────────────
// REWARDED MODAL
// Only ever rendered visible by a caller that already confirmed an ad is
// loaded (see useRewardedAdModal.openAdModal). On mount it immediately
// shows the already-loaded ad rather than loading one from scratch.
// ─────────────────────────────────────────────
export const RewardedAdModal = ({ visible, isLoaded, showLoadedAd, onClose, onEarned }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const [state, setState] = useState("idle");
  const stateRef = useRef("idle");

  const updateState = (newState) => {
    setState(newState);
    stateRef.current = newState;
  };

  useEffect(() => {
    if (!visible) {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.92);
      updateState("idle");
      return;
    }

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // The ad is already loaded by the time this modal is shown (the
    // caller verified that before setting visible=true). Just play it.
    updateState("playing");

    const didShow = showLoadedAd?.({
      onEarned: () => {
        updateState("earned");
        onEarned?.();
      },
      onClosed: () => {
        if (stateRef.current !== "earned") onClose?.();
      },
      onError: () => {
        updateState("failed");
      },
    });

    if (!didShow) {
      // Edge case: ad expired between the readiness check and this mount.
      updateState("failed");
    }
  }, [visible]);

  if (!visible) return null;

  const label =
    state === "playing"
      ? "Ad playing..."
      : state === "earned"
      ? "Reward earned 🎉"
      : state === "failed"
      ? "Ad unavailable"
      : "";

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Animated.View
          style={[
            styles.modalCard,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Pressable style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemeText style={styles.modalTitle}>Sponsored</ThemeText>
              <Pressable onPress={onClose} hitSlop={8}>
                <Ionicons name="close" size={20} color="#666" />
              </Pressable>
            </View>

            <View style={styles.adArea}>
              <ThemeText>{label}</ThemeText>
            </View>

            <View style={styles.footer}>
              <ThemeText style={styles.footerText}>
                Watch ad to continue
              </ThemeText>
            </View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const styles = StyleSheet.create({
  bannerWrapper: {
    width: "100%",
    alignItems: "center",
  },
  bannerContainer: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: SCREEN_WIDTH * 0.85,
    minHeight: 280,
    backgroundColor: "#fff",
    borderRadius: 18,
    overflow: "hidden",
  },
  modalContent: {
    flex: 1,
    width: "100%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#888",
  },
  adArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  footer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#999",
  },
});
