// hook/appUpdate.js
import { useEffect, useState } from "react";
import { Alert, Platform, Linking } from "react-native";
import Constants from "expo-constants";
import * as Updates from "expo-updates";

export const useAppUpdate = () => {
  const [updateChecked, setUpdateChecked] = useState(false);

  const checkForUpdate = async () => {
    try {
      const response = await fetch(`https://testbookstoreapp.onrender.com/app/version?platform=${Platform.OS}`);
      const data = await response.json();

     const currentVersion = Constants.expoConfig?.version || "1.0.0";
const currentBuild = parseInt(
  Constants.expoConfig?.android?.versionCode || Constants.expoConfig?.ios?.buildNumber || 1
);


      if (data.build > currentBuild) {
        if (Platform.OS === "android" && data.downloadUrl) {
          Alert.alert(
            "Update Available",
            "A new version is available. Update to continue.",
            [
              { text: "Update Now", onPress: () => Linking.openURL(data.downloadUrl) },
              { text: "Later", style: "cancel" },
            ],
            { cancelable: !data.mandatory }
          );
        } else if (data.otaEnabled) {
          const update = await Updates.checkForUpdateAsync();
          if (update.isAvailable) {
            await Updates.fetchUpdateAsync();
            Alert.alert(
              "Update Ready",
              "A new update is ready. Restart to apply changes?",
              [
                { text: "Restart", onPress: () => Updates.reloadAsync() },
                { text: "Later", style: "cancel" },
              ]
            );
          }
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
