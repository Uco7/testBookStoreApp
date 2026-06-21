
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "../../context/ThemeContext";
import { BookProvider } from "../../context/bookContext";

export default function DashBordLayout() {
  const { theme } = useTheme();
  // console.log("DashBordLayout theme:", theme);

  return (
    <BookProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: theme.navBackground,
          },
          tabBarActiveTintColor: theme.title,
          tabBarInactiveTintColor: theme.text,
        }}
      >
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={20}
                color={theme.iconColor}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="book"
          options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "book" : "book-outline"}
                size={20}
                color={theme.iconColor}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="create"
          options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "create" : "create-outline"}
                size={20}
                color={theme.iconColor}
              />
            ),
          }}
        />
       
       

        <Tabs.Screen name="pdf-viewer" options={{ href: null }} />
        <Tabs.Screen name="updateBook" options={{ href: null }} />
        <Tabs.Screen name="createTimetable" options={{ href: null }} />
        <Tabs.Screen   name="offlineBooks" options={{ href: null }} />
        <Tabs.Screen   name="offlineTimetable" options={{ href: null }} />
        <Tabs.Screen   name="timetableScreen" options={{ href: null }} />
        <Tabs.Screen   name="subscribeScreen" options={{ href: null }} />
        <Tabs.Screen   name="payment-success" options={{ href: null }} />
        <Tabs.Screen   name="transactionscreen" options={{ href: null }} />
      </Tabs>
    </BookProvider>
  );
}
