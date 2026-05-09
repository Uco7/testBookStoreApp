import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import { useEffect } from "react";
import { Platform } from "react-native";

import { UserProvider } from "../context/userContext";
import { PaperProvider } from "react-native-paper";
import {
  ThemeProvider,
  useTheme,
} from "../context/ThemeContext";
import { registerForPushNotificationsAsync } from "../utils/notifications";

function LayoutContent() {
  const { scheme, theme } = useTheme();

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setButtonStyleAsync(
        scheme === "dark" ? "light" : "dark"
      );
    }
  }, [scheme]);
  // Register for push notifications on component mount
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);
  //==================ensd==========================

  return (
    <>
      <StatusBar
        style={scheme === "dark" ? "light" : "dark"}
      />

      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.navBackground,
          },
          headerTitleStyle: {
            color: theme.title,
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="(auth)"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="(dashBord)"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="(reference)"
          options={{ headerShown: false }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <PaperProvider>
      <ThemeProvider>
        <UserProvider>
          <LayoutContent />
        </UserProvider>
      </ThemeProvider>
    </PaperProvider>
  );
}



// import { useColorScheme, Platform } from "react-native";
// import { Stack } from "expo-router";
// import { StatusBar } from "expo-status-bar";
// import * as NavigationBar from "expo-navigation-bar";
// import { useEffect } from "react";
// import { UserProvider } from "../context/userContext";
// import { colors } from "../constant/colors";
// import { ThemeProvider } from "../context/ThemeContext";

// export default function RootLayout() {
//   const colorScheme = useColorScheme();
//   const theme = colors[colorScheme] ?? colors.light;

//   useEffect(() => {
//     if (Platform.OS === "android") {
//       NavigationBar.setButtonStyleAsync(colorScheme === "dark" ? "light" : "dark");
//     }
//   }, [colorScheme]);

//   return (
//     <ThemeProvider value={theme}>

//       <UserProvider>
//         <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

//       <Stack
//         screenOptions={{
//           headerStyle: { backgroundColor: theme.navBackground },
//           headerTitleStyle: { color: theme.title },
//         }}
//         >
//         <Stack.Screen name="index" options={{ headerShown: false }} />
//         <Stack.Screen name="(auth)" options={{ headerShown: false }} />
//         <Stack.Screen name="(dashBord)" options={{ headerShown: false }} />
//         <Stack.Screen name="(reference)" options={{ headerShown: false }} />
//       </Stack>
//     </UserProvider>
//   </ThemeProvider>
//   );
// }



