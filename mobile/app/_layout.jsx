

import { useColorScheme, Platform } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import { useEffect } from "react";
import { UserProvider } from "../context/userContext";
import { colors } from "../constant/colors";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colors[colorScheme] ?? colors.light;

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setButtonStyleAsync(colorScheme === "dark" ? "light" : "dark");
    }
  }, [colorScheme]);

  return (
    <UserProvider>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.navBackground },
          headerTitleStyle: { color: theme.title },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(dashBord)" options={{ headerShown: false }} />
        <Stack.Screen name="(reference)" options={{ headerShown: false }} />
      </Stack>
    </UserProvider>
  );
}

