// hooks/useAppUpdate.js
import { useEffect, useState } from "react";
import { Alert, Platform, Linking } from "react-native";
import Constants from "expo-constants";
import * as Updates from "expo-updates";

export const useAppUpdate = () => {
  const [updateChecked, setUpdateChecked] = useState(false);

  const checkForUpdate = async () => {
    try {
      const response = await fetch(
        `https://testbookstoreapp.onrender.com/app/version?platform=${Platform.OS}`
      );
      const data = await response.json();

      const currentVersion = Constants.nativeAppVersion || "1.0.0";
      const currentBuild = parseInt(Constants.nativeBuildVersion || "1", 10);

      // 🔴 Native update required
      if (data.build > currentBuild) {
        if (Platform.OS === "android" && data.downloadUrl) {
          Alert.alert(
            "Update Available",
            "A new version is available. Please update to continue.",
            [
              {
                text: "Update Now",
                onPress: () => Linking.openURL(data.downloadUrl),
              },
            ],
            { cancelable: !data.mandatory }
          );
        }
        return;
      }

      // 🟢 OTA update (same build only)
      if (data.otaEnabled && Updates.isEnabled) {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          Alert.alert(
            "Update Ready",
            "A new update is ready. Restart now?",
            [
              { text: "Restart", onPress: () => Updates.reloadAsync() },
              { text: "Later", style: "cancel" },
            ]
          );
        }
      }
    } catch (err) {
      console.log("Update check failed:", err.message);
    } finally {
      setUpdateChecked(true);
    }
  };

  useEffect(() => {
    checkForUpdate();
  }, []);

  return { updateChecked };
};