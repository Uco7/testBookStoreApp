



import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import * as Notifications from "expo-notifications";

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
  );
}