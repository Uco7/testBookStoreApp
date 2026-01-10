
import { useColorScheme } from "react-native";
import { Stack } from "expo-router";
import { colors } from "../../constant/colors";

export default function AuthLayout() {
  const colorScheme = useColorScheme();
  const theme = colors[colorScheme] ?? colors.light;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: theme.navBackground },
        headerTitleStyle: { color: theme.title },
      }}
    >
      <Stack.Screen name="register" options={{ title: "Register" }} />
      <Stack.Screen name="login" options={{ title: "Login" }} />
    </Stack>
  );
}

