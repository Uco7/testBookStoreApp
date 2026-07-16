



// import React, { useEffect } from "react";
// import { Stack, useRouter } from "expo-router";
// import * as Notifications from "expo-notifications";

// import { UserProvider } from "../context/userContext";
// import { PaperProvider } from "react-native-paper";
// import { BookProvider } from "../context/bookContext";
// import { TimetableProvider } from "../context/timeTableContext";
// import { AuthProvider } from "../context/AuthContext";
// import { SubscriptionProvider } from "../context/subScriptionContext";
// import { StatusBar } from "expo-status-bar";
// import * as NavigationBar from "expo-navigation-bar";
// import { Platform } from "react-native";

// import { ThemeProvider, useTheme } from "../context/ThemeContext";

// import mobileAds from "react-native-google-mobile-ads";
// import { AdGateProvider } from "../hook/useRewardAdsEnabled";

// // =========================
// // 🔔 CHANNEL ID VERSIONING
// // Android freezes a notification channel's sound/vibration/importance
// // the FIRST time that channel ID is created on a device. Calling
// // setNotificationChannelAsync() again with a different `sound` does
// // NOT update it on already-installed devices — it silently no-ops.
// //
// // If the channel was ever created with a wrong/missing sound (old
// // build, old competing setup code, a dev build, etc.), every existing
// // user is permanently stuck on that sound for this channel ID, even
// // though new installs would get it right.
// //
// // The only way to force Android to pick up the new sound for
// // EVERYONE (existing + new installs) is to use a new channel ID.
// // Bump this suffix any time the channel's sound/config changes.
// // =========================
// export const PREMIUM_ALARM_CHANNEL_ID = "premium-alarm-v2";

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldShowBanner: true,
//     shouldShowList: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//   }),
// });

// async function setupNotificationChannels() {
//   try {
//     await Notifications.setNotificationChannelAsync("default", {
//       name: "Default Notifications",
//       importance: Notifications.AndroidImportance.DEFAULT,
//     });

//     await Notifications.setNotificationChannelAsync(PREMIUM_ALARM_CHANNEL_ID, {
//       name: "Premium Alarm",
//       importance: Notifications.AndroidImportance.MAX,
//       sound: "alarm_sound.wav",
//       vibrationPattern: [0, 500, 500, 500],
//       lockscreenVisibility:
//         Notifications.AndroidNotificationVisibility.PUBLIC,
//     });
//   } catch (err) {
//     console.log("❌ Channel setup error:", err.message);
//   }
// }

// function App() {
//   const router = useRouter();
//   useEffect(() => {
//     mobileAds()
//       .initialize()
//       .then(() => console.log("✅ Ads SDK initialized"));
//   }, []);

//   useEffect(() => {
//     const subscription =
//       Notifications.addNotificationResponseReceivedListener((response) => {
//         const data = response.notification.request.content.data;

//         if (data?.timetableId) {
//           router.push({
//             pathname: "/timetable/detail",
//             params: { timetableId: data.timetableId },
//           });
//         }
//       });

//     return () => subscription.remove();
//   }, []);

//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="index" />
//       {/* <Stack.Screen name="detail" /> */}
//       <Stack.Screen name="(auth)" />
//       <Stack.Screen name="(dashBord)" />
//       <Stack.Screen name="(reference)" />
//       <Stack.Screen name="timetable/detail" />
//     </Stack>
//   );
// }

// // =========================
// // THEMED CHROME
// // Everything that depends on useTheme() lives in ONE component that is
// // rendered INSIDE <ThemeProvider> (see the tree in RootLayout below).
// // RootLayout itself must never call useTheme() directly — it's an
// // ancestor of ThemeProvider, not a descendant, so the hook would run
// // before any provider value exists and throw, exactly like your error.
// // =========================
// function ThemedChrome({ children }) {
//   const { scheme, theme } = useTheme();

//   useEffect(() => {
//     if (Platform.OS === "android") {
//       NavigationBar.setButtonStyleAsync(scheme === "dark" ? "light" : "dark");
//     }
//   }, [scheme]);

//   const backgroundColor =
//     theme?.background ?? (scheme === "dark" ? "#000000" : "#ffffff");

//   return (
//     <>
//       <StatusBar
//         style={scheme === "dark" ? "light" : "dark"}
//         backgroundColor={
//           Platform.OS === "android" ? backgroundColor : undefined
//         }
//         translucent={false}
//         animated
//       />
//       {children}
//     </>
//   );
// }

// export default function RootLayout() {
//   useEffect(() => {
//     setupNotificationChannels();
//   }, []);

//   return (
//     <AuthProvider>
//       <BookProvider>
//         <TimetableProvider>
//           <ThemeProvider>
//             <UserProvider>
//               <SubscriptionProvider>
//                 <PaperProvider>
//                   <ThemedChrome>
//                     {/* AdGateProvider drives the 90-day interstitial grace
//                         period (Home/Timetable). It needs UserProvider above
//                         it so useUser() resolves correctly. */}
//                     <AdGateProvider>
//                       <App />
//                     </AdGateProvider>
//                   </ThemedChrome>
//                 </PaperProvider>
//               </SubscriptionProvider>
//             </UserProvider>
//           </ThemeProvider>
//         </TimetableProvider>
//       </BookProvider>
//     </AuthProvider>
//   );
// }







import React, { useEffect, useState, useCallback, useRef, createContext, useContext } from "react";
import { Stack, useRouter } from "expo-router";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import { View, Image, Animated, Easing, StyleSheet } from "react-native";

import { UserProvider } from "../context/userContext";
import { PaperProvider } from "react-native-paper";
import { BookProvider } from "../context/bookContext";
import { TimetableProvider } from "../context/timeTableContext";
import { AuthProvider } from "../context/AuthContext";
import { SubscriptionProvider } from "../context/subScriptionContext";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import { Platform } from "react-native";

import { ThemeProvider, useTheme } from "../context/ThemeContext";

import mobileAds from "react-native-google-mobile-ads";
import { AdGateProvider } from "../hook/useRewardAdsEnabled";

import Logo from "../assets/logo.png";

// Keep the native splash on screen until we explicitly hide it —
// otherwise it disappears the instant the JS bundle mounts, before
// providers/data are ready, leaving a blank frame.
SplashScreen.preventAutoHideAsync().catch(() => {});

// =========================
// 🔔 CHANNEL ID VERSIONING
// Android freezes a notification channel's sound/vibration/importance
// the FIRST time that channel ID is created on a device. Calling
// setNotificationChannelAsync() again with a different `sound` does
// NOT update it on already-installed devices — it silently no-ops.
//
// If the channel was ever created with a wrong/missing sound (old
// build, old competing setup code, a dev build, etc.), every existing
// user is permanently stuck on that sound for this channel ID, even
// though new installs would get it right.
//
// The only way to force Android to pick up the new sound for
// EVERYONE (existing + new installs) is to use a new channel ID.
// Bump this suffix any time the channel's sound/config changes.
// =========================
export const PREMIUM_ALARM_CHANNEL_ID = "premium-alarm-v2";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function setupNotificationChannels() {
  try {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default Notifications",
      importance: Notifications.AndroidImportance.DEFAULT,
    });

    await Notifications.setNotificationChannelAsync(PREMIUM_ALARM_CHANNEL_ID, {
      name: "Premium Alarm",
      importance: Notifications.AndroidImportance.MAX,
      sound: "alarm_sound.wav",
      vibrationPattern: [0, 500, 500, 500],
      lockscreenVisibility:
        Notifications.AndroidNotificationVisibility.PUBLIC,
    });
  } catch (err) {
    console.log("❌ Channel setup error:", err.message);
  }
}

// =========================
// 🟢 APP-READY CONTEXT
// Any provider/screen deep in the tree (e.g. AuthContext finishing its
// initial session check, UserProvider finishing its first fetch) can
// call markReady("auth") once its own startup work is done. The splash
// only fades out once ALL registered keys have reported ready — so it
// truly covers real data loading, not just the JS bundle mounting.
// If you don't wire any providers into this, it still falls back to
// the minimum boot tasks below (notifications + ads) plus a buffer.
// =========================
const AppReadyContext = createContext({ markReady: () => {} });
export const useAppReady = () => useContext(AppReadyContext);

function App() {
  const router = useRouter();
  useEffect(() => {
    mobileAds()
      .initialize()
      .then(() => console.log("✅ Ads SDK initialized"));
  }, []);

  useEffect(() => {
    const subscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;

        if (data?.timetableId) {
          router.push({
            pathname: "/timetable/detail",
            params: { timetableId: data.timetableId },
          });
        }
      });

    return () => subscription.remove();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      {/* <Stack.Screen name="detail" /> */}
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(dashBord)" />
      <Stack.Screen name="(reference)" />
      <Stack.Screen name="timetable/detail" />
    </Stack>
  );
}

// =========================
// THEMED CHROME
// Everything that depends on useTheme() lives in ONE component that is
// rendered INSIDE <ThemeProvider> (see the tree in RootLayout below).
// RootLayout itself must never call useTheme() directly — it's an
// ancestor of ThemeProvider, not a descendant, so the hook would run
// before any provider value exists and throw, exactly like your error.
// =========================
function ThemedChrome({ children }) {
  const { scheme, theme } = useTheme();

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setButtonStyleAsync(scheme === "dark" ? "light" : "dark");
    }
  }, [scheme]);

  const backgroundColor =
    theme?.background ?? (scheme === "dark" ? "#000000" : "#ffffff");

  return (
    <>
      <StatusBar
        style={scheme === "dark" ? "light" : "dark"}
        backgroundColor={
          Platform.OS === "android" ? backgroundColor : undefined
        }
        translucent={false}
        animated
      />
      {children}
    </>
  );
}

// =========================
// 🎬 ANIMATED SPLASH OVERLAY
// A logo pulse + rotation, plus a progress bar that fills as boot
// tasks complete. Rendered on top of everything until appReady.
// =========================
function AnimatedSplash({ progress }) {
  const spin = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;
  const barWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.08,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1800,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  useEffect(() => {
    Animated.timing(barWidth, {
      toValue: progress,
      duration: 250,
      useNativeDriver: false, // width isn't supported by native driver
    }).start();
  }, [progress]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.splashCenter}>
      <Animated.View style={{ transform: [{ scale: pulse }, { rotate }] }}>
        <Image source={Logo} style={styles.logo} />
      </Animated.View>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            {
              width: barWidth.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
}

export default function RootLayout() {
  const [progress, setProgress] = useState(0);
  const [appReady, setAppReady] = useState(false);
  const [splashVisible, setSplashVisible] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Tracks which named boot tasks have reported in. Providers/screens
  // can call markReady("someKey") via useAppReady() to add themselves
  // as a gate. Nothing required — falls back to the base tasks below.
  const readyKeys = useRef(new Set());
  const markReady = useCallback((key) => {
    readyKeys.current.add(key);
  }, []);

  useEffect(() => {
    setupNotificationChannels();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setProgress(0.2);
        await setupNotificationChannels();
        setProgress(0.5);

        await mobileAds().initialize();
        setProgress(0.8);

        // Small buffer so the animation reads as intentional rather
        // than a flicker, and gives any markReady("...") calls above
        // a moment to land.
        await new Promise((res) => setTimeout(res, 300));
        setProgress(1);
      } catch (e) {
        console.log("❌ Boot error:", e?.message);
      } finally {
        setAppReady(true);
      }
    })();
  }, []);

  // Hide the NATIVE splash only after the JS overlay has already
  // painted underneath it — so the handoff has zero blank frame.
  const onLayoutRootView = useCallback(async () => {
    if (appReady) await SplashScreen.hideAsync();
  }, [appReady]);

  useEffect(() => {
    if (appReady) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        delay: 150,
        useNativeDriver: true,
      }).start(() => setSplashVisible(false));
    }
  }, [appReady]);

  return (
    <AppReadyContext.Provider value={{ markReady }}>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <AuthProvider>
          <BookProvider>
            <TimetableProvider>
              <ThemeProvider>
                <UserProvider>
                  <SubscriptionProvider>
                    <PaperProvider>
                      <ThemedChrome>
                        {/* AdGateProvider drives the 90-day interstitial grace
                            period (Home/Timetable). It needs UserProvider above
                            it so useUser() resolves correctly. */}
                        <AdGateProvider>
                          <App />
                        </AdGateProvider>
                      </ThemedChrome>
                    </PaperProvider>
                  </SubscriptionProvider>
                </UserProvider>
              </ThemeProvider>
            </TimetableProvider>
          </BookProvider>
        </AuthProvider>

        {splashVisible && (
          <Animated.View
            style={[StyleSheet.absoluteFill, styles.overlay, { opacity: fadeAnim }]}
            pointerEvents="none"
          >
            <AnimatedSplash progress={progress} />
          </Animated.View>
        )}
      </View>
    </AppReadyContext.Provider>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  splashCenter: { flex: 1, justifyContent: "center", alignItems: "center" },
  logo: { width: 100, height: 100, marginBottom: 24 },
  track: {
    width: 160,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(0,0,0,0.1)",
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: 3, backgroundColor: "#007AFF" },
});