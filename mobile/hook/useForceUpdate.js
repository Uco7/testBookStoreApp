import { useEffect, useState, useCallback } from "react";
import { Platform } from "react-native";
import Constants from "expo-constants";

// Point this at the endpoint above once it's deployed.
const VERSION_CHECK_URL = "https://testbookstoreapp-backend-my8t.onrender.com/api/app-version";

const parseVersion = (v) =>
  (v || "0.0.0").split(".").map((n) => parseInt(n, 10) || 0);

// Returns 1 if a > b, -1 if a < b, 0 if equal
const compareVersions = (a, b) => {
  const pa = parseVersion(a);
  const pb = parseVersion(b);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const diff = (pa[i] || 0) - (pb[i] || 0);
    if (diff !== 0) return diff > 0 ? 1 : -1;
  }
  return 0;
};

export function useForceUpdate() {
  const [state, setState] = useState({
    checked: false,
    needsUpdate: false,
    message: null,
    storeUrl: null,
  });

  const check = useCallback(async () => {
    try {
      const currentVersion = Constants.expoConfig?.version || "0.0.0";

      const res = await fetch(VERSION_CHECK_URL, { cache: "no-store" });
      if (!res.ok) throw new Error(`Bad status ${res.status}`);
      const data = await res.json();

      const isBelowMin = compareVersions(currentVersion, data.minVersion) < 0;
      const needsUpdate = Boolean(data.forceUpdate) || isBelowMin;

      setState({
        checked: true,
        needsUpdate,
        message:
          data.message || "A new version of the app is required to continue.",
        storeUrl: Platform.OS === "android" ? data.storeUrlAndroid : data.storeUrlIos,
      });
    } catch (err) {
      // Fail OPEN: never lock users out because the endpoint is briefly
      // down, unreachable, or misconfigured. Log and move on.
      console.log("Force update check failed:", err?.message);
      setState((prev) => ({ ...prev, checked: true, needsUpdate: false }));
    }
  }, []);

  useEffect(() => {
    check();
  }, [check]);

  return { ...state, recheck: check };
}