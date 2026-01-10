

import { useColorScheme } from "react-native";
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors } from "../../constant/colors";
import { BookProvider } from "../../context/bookContext";

export default function DashBordLayout() {
  const colorScheme = useColorScheme();
  const theme = colors[colorScheme] ?? colors.light;

  return (
    <BookProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { backgroundColor: theme.navBackground },
          tabBarActiveTintColor: theme.title,
          tabBarInactiveTintColor: theme.text,
        }}
      >
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ focused }) => (
              <Ionicons name={focused ? "person" : "person-outline"} size={20} color={theme.iconColor} />
            ),
          }}
        />
        <Tabs.Screen
          name="book"
          options={{
            title: "Book Shelf",
            tabBarIcon: ({ focused }) => (
              <Ionicons name={focused ? "book" : "book-outline"} size={20} color={theme.iconColor} />
            ),
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: "Upload",
            tabBarIcon: ({ focused }) => (
              <Ionicons name={focused ? "create" : "create-outline"} size={20} color={theme.iconColor} />
            ),
          }}
        />
        <Tabs.Screen name="updateBook" options={{ href: null }} />
      </Tabs>
    </BookProvider>
  );
}
