// // import { Stack } from "expo-router";
// // import { StatusBar } from "expo-status-bar";
// // import * as NavigationBar from "expo-navigation-bar";
// // import { useEffect } from "react";
// // import { Platform } from "react-native";

// // import { UserProvider } from "../context/userContext";
// // import { PaperProvider } from "react-native-paper";
// // import {
// //   ThemeProvider,
// //   useTheme,
// // } from "../context/ThemeContext";
// // import { registerForPushNotificationsAsync } from "../utils/notifications";

// // function LayoutContent() {
// //   const { scheme, theme } = useTheme();

// //   useEffect(() => {
// //     if (Platform.OS === "android") {
// //       NavigationBar.setButtonStyleAsync(
// //         scheme === "dark" ? "light" : "dark"
// //       );
// //     }
// //   }, [scheme]);
  
  

// //   // Register for push notifications on component mount
// //   useEffect(() => {
// //     registerForPushNotificationsAsync();
// //   }, []);

  
// //   //==================ensd==========================

// //   return (
// //     <>
// //       <StatusBar
// //         style={scheme === "dark" ? "light" : "dark"}
// //       />

// //       <Stack
// //         screenOptions={{
// //           headerStyle: {
// //             backgroundColor: theme.navBackground,
// //           },
// //           headerTitleStyle: {
// //             color: theme.title,
// //           },
// //         }}
// //       >
// //         <Stack.Screen
// //           name="index"
// //           options={{ headerShown: false }}
// //         />

// //         <Stack.Screen
// //           name="(auth)"
// //           options={{ headerShown: false }}
// //         />

// //         <Stack.Screen
// //           name="(dashBord)"
// //           options={{ headerShown: false }}
// //         />

// //         <Stack.Screen
// //           name="(reference)"
// //           options={{ headerShown: false }}
// //         />
// //         {/* <Stack.Screen
// //           name="(alarm)"
// //           options={{ headerShown: false }}
// //         /> */}
// //       </Stack>
// //     </>
// //   );
// // }

// // export default function RootLayout() {
// //   return (
// //     <PaperProvider>
// //       <ThemeProvider>
// //         <UserProvider>
// //           <LayoutContent />
// //         </UserProvider>
// //       </ThemeProvider>
// //     </PaperProvider>
// //   );
// // }



// // // import { useColorScheme, Platform } from "react-native";
// // // import { Stack } from "expo-router";
// // // import { StatusBar } from "expo-status-bar";
// // // import * as NavigationBar from "expo-navigation-bar";
// // // import { useEffect } from "react";
// // // import { UserProvider } from "../context/userContext";
// // // import { colors } from "../constant/colors";
// // // import { ThemeProvider } from "../context/ThemeContext";

// // // export default function RootLayout() {
// // //   const colorScheme = useColorScheme();
// // //   const theme = colors[colorScheme] ?? colors.light;

// // //   useEffect(() => {
// // //     if (Platform.OS === "android") {
// // //       NavigationBar.setButtonStyleAsync(colorScheme === "dark" ? "light" : "dark");
// // //     }
// // //   }, [colorScheme]);

// // //   return (
// // //     <ThemeProvider value={theme}>

// // //       <UserProvider>
// // //         <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

// // //       <Stack
// // //         screenOptions={{
// // //           headerStyle: { backgroundColor: theme.navBackground },
// // //           headerTitleStyle: { color: theme.title },
// // //         }}
// // //         >
// // //         <Stack.Screen name="index" options={{ headerShown: false }} />
// // //         <Stack.Screen name="(auth)" options={{ headerShown: false }} />
// // //         <Stack.Screen name="(dashBord)" options={{ headerShown: false }} />
// // //         <Stack.Screen name="(reference)" options={{ headerShown: false }} />
// // //       </Stack>
// // //     </UserProvider>
// // //   </ThemeProvider>
// // //   );
// // // }


// import React, {
//   useEffect,
//   useRef,
// } from "react";

// import { Platform } from "react-native";

// import { Stack, useRouter } from "expo-router";

// import { StatusBar } from "expo-status-bar";

// import * as NavigationBar from "expo-navigation-bar";

// import * as Notifications from "expo-notifications";

// import {
//   PaperProvider,
// } from "react-native-paper";

// import {
//   ThemeProvider,
//   useTheme,
// } from "../context/ThemeContext";

// import {
//   UserProvider,
// } from "../context/userContext";

// // ===============================================
// // GLOBAL NOTIFICATION HANDLER
// // ===============================================

// Notifications.setNotificationHandler({
//   handleNotification:
//     async () => ({
//       shouldShowBanner: true,
//       shouldShowList: true,
//       shouldPlaySound: true,
//       shouldSetBadge: false,
//     }),
// });

// // ===============================================
// // INNER APP
// // ===============================================

// function AppContent() {
//   const router = useRouter();

//   const {
//     scheme,
//     theme,
//   } = useTheme();

//   const notificationListener =
//     useRef(null);

//   const responseListener =
//     useRef(null);

//   // =========================================
//   // ANDROID NAVIGATION BAR
//   // =========================================

//   useEffect(() => {
//     if (Platform.OS === "android") {
//       NavigationBar.setButtonStyleAsync(
//         scheme === "dark"
//           ? "light"
//           : "dark"
//       );
//     }
//   }, [scheme]);

//   // =========================================
//   // NOTIFICATION LISTENERS
//   // =========================================

//   useEffect(() => {
//     // FOREGROUND LISTENER

//     notificationListener.current =
//       Notifications.addNotificationReceivedListener(
//         (notification) => {
//           console.log(
//             "🔔 Notification received:",
//             notification.request.content
//               .title
//           );
//         }
//       );

//     // TAP LISTENER

//     responseListener.current =
//       Notifications.addNotificationResponseReceivedListener(
//         (response) => {
//           const data =
//             response.notification.request
//               .content.data;

//           console.log(
//             "📨 Notification tapped:",
//             data
//           );

//           if (
//             data?.type ===
//             "premium_alarm"
//           ) {
//             router.push(
//               "/(dashBord)/alarm-screen"
//             );
//           } else {
//             router.push(
//               "/(dashBord)/reminder-screen"
//             );
//           }
//         }
//       );

//     // CLEANUP

//     return () => {
//       notificationListener.current?.remove();

//       responseListener.current?.remove();
//     };
//   }, []);

//   // =========================================
//   // UI
//   // =========================================

//   return (
//     <PaperProvider theme={theme}>
//       <StatusBar
//         style={
//           scheme === "dark"
//             ? "light"
//             : "dark"
//         }
//       />

//       <Stack
//         screenOptions={{
//           headerShown: false,
//         }}
//       >
//         <Stack.Screen name="index" />

//         <Stack.Screen name="(auth)" />

//         <Stack.Screen name="(dashBord)" />

//         <Stack.Screen name="(reference)" />

//         <Stack.Screen name="(alarm)" />
//       </Stack>
//     </PaperProvider>
//   );
// }

// // ===============================================
// // ROOT LAYOUT
// // ===============================================

// export default function RootLayout() {
//   return (
//     <ThemeProvider>
//       <UserProvider>
//         <AppContent />
//       </UserProvider>
//     </ThemeProvider>
//   );
// }


// import React, { useEffect } from "react";
// import { Stack, useRouter } from "expo-router";
// import * as Notifications from "expo-notifications";

// import { ThemeProvider } from "../context/ThemeContext";
// import { UserProvider } from "../context/userContext";
// import { PaperProvider } from "react-native-paper";

// // IMPORTANT: keep handler global
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowBanner: true,
//     shouldShowList: true,
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//   }),
// });

// export default function RootLayout() {
//   return (
//     <ThemeProvider>
//       <UserProvider>
//         <PaperProvider>
//           <App />
//         </PaperProvider>
//       </UserProvider>
//     </ThemeProvider>
//   );
// }

// function App() {
//   const router = useRouter();

//   useEffect(() => {
//     const subscription =
//       Notifications.addNotificationResponseReceivedListener(
//         async (response) => {
//           const data =
//             response.notification.request.content.data;

//           if (data?.type === "START_SESSION_CYCLE") {
//             console.log("🔥 Starting cycle:", data);

//             await startSessionCycle(data);
//           }
//         }
//       );

//     return () => subscription.remove();
//   }, []);

//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="index" />
//       <Stack.Screen name="(auth)" />
//       <Stack.Screen name="(dashBord)" />
//       <Stack.Screen name="(reference)" />
//     </Stack>
//   );
// }





// import React, { useEffect } from "react";
// import { Stack } from "expo-router";
// import * as Notifications from "expo-notifications";
// import { ThemeProvider } from "../context/ThemeContext";
// import { UserProvider } from "../context/userContext";
// import { PaperProvider } from "react-native-paper";
// import { registerForPushNotificationsAsync } from "../utils/registerPushToken";
// import { setupNotificationInterceptor } from "../utils/setupNotificationInterceptor";
// import { setupNotificationChannels } from "../utils/notificationChannels";
// import { useRouter } from "expo-router";
// import {BookProvider} from "../context/bookContext";
// // import UserProvider from "../context/userContext";
// import { TimetableProvider } from "../context/timeTableContext";
// import { AuthProvider } from "../context/AuthContext";
// // import * as Notifications from "expo-notifications";
// import { setupNotificationHandler } from "../utils/notificationHandler";



// export default function RootLayout() {
  

  
//  useEffect(() => {
//     setupNotificationHandler();
//   }, []);
 

  
//   return (
//     <AuthProvider>

//   <BookProvider>
//     <TimetableProvider>   

//     <ThemeProvider>
//       <UserProvider>
//         <PaperProvider>
//           <App />
//         </PaperProvider>
//       </UserProvider>
//     </ThemeProvider>
//     </TimetableProvider>
// </BookProvider>
// </AuthProvider>
//   );
// }

// function App() {
//   const router = useRouter(); // ✅ REQUIRED
//   useEffect(() => {
//   setupNotificationInterceptor();
//   setupNotificationChannels();
// }, []);


//  useEffect(() => {
//     const sub =
//       Notifications.addNotificationResponseReceivedListener(
//         (response) => {
//           const data =
//             response.notification.request.content.data;

//           if (data?.timetableId) {
//             router.push({
//               pathname: "/timetable/detail",
//               params: {
//                 timetableId: data.timetableId,
//               },
//             });
//           }
//         }
//       );

//     return () => sub.remove();
//   }, []);

//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="index" />
//       <Stack.Screen name="detail" />
//       <Stack.Screen name="(auth)" />
//       <Stack.Screen name="(dashBord)" />
//       <Stack.Screen name="(reference)" />

//     </Stack>
//   );
// }






// import React, { useEffect } from "react";
// import { Stack, useRouter } from "expo-router";
// import * as Notifications from "expo-notifications";

// import { ThemeProvider } from "../context/ThemeContext";
// import { UserProvider } from "../context/userContext";
// import { PaperProvider } from "react-native-paper";
// import { BookProvider } from "../context/bookContext";
// import { TimetableProvider } from "../context/timeTableContext";
// import { AuthProvider } from "../context/AuthContext";


// import mobileAds from "react-native-google-mobile-ads";




// // =========================
// // NOTIFICATION HANDLER
// // =========================
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,    // ← this is what Android needs
//     shouldShowBanner: true,   // keep for iOS
//     shouldShowList: true,     // keep for iOS
//     shouldPlaySound: true,
//     shouldSetBadge: false,
//   }),
// });

// // =========================
// // CHANNEL SETUP
// // =========================
// async function setupNotificationChannels() {
//   try {
//     await Notifications.setNotificationChannelAsync("default", {
//       name: "Default Notifications",
//       importance: Notifications.AndroidImportance.DEFAULT,
//     });

//     await Notifications.setNotificationChannelAsync("premium-alarm", {
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

// // =========================
// // APP NAVIGATION
// // =========================
// function App() {
//   const router = useRouter();
//   useEffect(() => {
//   mobileAds()
//     .initialize()
//     .then(() => console.log("✅ Ads SDK initialized"));
// }, []);

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
//       <Stack.Screen name="detail" />
//       <Stack.Screen name="(auth)" />
//       <Stack.Screen name="(dashBord)" />
//       <Stack.Screen name="(reference)" />
//       <Stack.Screen name="timetable/detail" />
//     </Stack>
//   );
// }

// // =========================
// // ROOT LAYOUT (FIXED)
// // =========================
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
//               <PaperProvider>
//                 <App />
//               </PaperProvider>
//             </UserProvider>
//           </ThemeProvider>
//         </TimetableProvider>
//       </BookProvider>
//     </AuthProvider>
//   );
// }


import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import * as Notifications from "expo-notifications";

import { ThemeProvider } from "../context/ThemeContext";
import { UserProvider } from "../context/userContext";
import { PaperProvider } from "react-native-paper";
import { BookProvider } from "../context/bookContext";
import { TimetableProvider } from "../context/timeTableContext";
import { AuthProvider } from "../context/AuthContext";
import {  SubscriptionProvider } from "../context/subScriptionContext";


import mobileAds from "react-native-google-mobile-ads";

// AdGateProvider lives in hook/useRewardAdsEnabled.js — it's the 90-day
// rewarded-INTERSTITIAL system used by Home/Timetable screens. It is NOT
// in component/AdsManager.jsx; that file has its own separate, provider-
// free useAdGate() for the rewarded (non-interstitial) ad on the Create
// Timetable screen, and doesn't need to be mounted here.
import { AdGateProvider } from "../hook/useRewardAdsEnabled";

// =========================
// NOTIFICATION HANDLER
// =========================
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,    // ← this is what Android needs
    shouldShowBanner: true,   // keep for iOS
    shouldShowList: true,     // keep for iOS
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// =========================
// CHANNEL SETUP
// =========================
async function setupNotificationChannels() {
  try {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default Notifications",
      importance: Notifications.AndroidImportance.DEFAULT,
    });

    await Notifications.setNotificationChannelAsync("premium-alarm", {
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
// APP NAVIGATION
// =========================
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
      <Stack.Screen name="detail" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(dashBord)" />
      <Stack.Screen name="(reference)" />
      <Stack.Screen name="timetable/detail" />
    </Stack>
  );
}

// =========================
// ROOT LAYOUT
// =========================
export default function RootLayout() {
  useEffect(() => {
    setupNotificationChannels();
  }, []);

  return (
    <AuthProvider>
      <BookProvider>
        <TimetableProvider>
          <ThemeProvider>
            <UserProvider>
              <SubscriptionProvider>

              <PaperProvider>
                {/* AdGateProvider drives the 90-day interstitial grace
                    period (Home/Timetable). It needs UserProvider above
                    it so useUser() resolves correctly. */}
                <AdGateProvider>
                  <App />
                </AdGateProvider>
              </PaperProvider>
              </SubscriptionProvider>
            </UserProvider>
          </ThemeProvider>
        </TimetableProvider>
      </BookProvider>
    </AuthProvider>
  );
}
