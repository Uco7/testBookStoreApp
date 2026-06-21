import AsyncStorage from "@react-native-async-storage/async-storage";

export const getAuthStatus = async () => {
  const token = await AsyncStorage.getItem("token");
  const expiry = await AsyncStorage.getItem("tokenExpiry");

  if (!token) return "logged_out";

  if (!expiry) return "expired";

  if (Date.now() > Number(expiry)) {
    return "expired";
  }

  return "authenticated";
};