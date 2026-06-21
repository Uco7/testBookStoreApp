


import { createContext, useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { scheduleTimetableLocally } from "../utils/scheduleTimetable";
import {
  hardCancelTimetableNotifications,
  scheduleOfflineTimetable,
  muteLocalNotifications,
  unmuteLocalNotifications,
  isLocallyMuted,
} from "../utils/offlineNotificationService/offlineNotificationService";
import {backendUrl_ngrok,backendDomainUrl} from "../utils/config/appUrl"

// const APPURL=backendUrl_ngrok

const APPURL=backendUrl_ngrok


// ─────────────────────────────────────────────────────────────────────────────
// CONFIG

const AD_UNLOCK_KEY ="premium_ad_unlock"; // { unlockedAt: number, count: number }
const AD_WINDOW_HOURS = 24;
const AD_MAX_PER_WINDOW =3;

export const TimetableContext = createContext();

// ─────────────────────────────────────────────────────────────────────────────
// AD UNLOCK HELPERS (client-side mirror of server logic)
// ─────────────────────────────────────────────────────────────────────────────

/** Returns { unlocked: boolean, count: number } from AsyncStorage. */
const getAdUnlockState = async () => {
  try {
    const raw = await AsyncStorage.getItem(AD_UNLOCK_KEY);
    if (!raw) return { unlocked: false, count: 0 };
    const { unlockedAt, count } = JSON.parse(raw);
    const hoursSince = (Date.now() - unlockedAt) / (1000 * 60 * 60);
    if (hoursSince > AD_WINDOW_HOURS) {
      await AsyncStorage.removeItem(AD_UNLOCK_KEY);
      return { unlocked: false, count: 0 };
    }
    return { unlocked: true, count: count || 0 };
  } catch {
    return { unlocked: false, count: 0 };
  }
};

/** Called after the user earns a reward — opens/resets the 24-hour window. */
export const saveAdUnlock = async () => {
  await AsyncStorage.setItem(
    AD_UNLOCK_KEY,
    JSON.stringify({ unlockedAt: Date.now(), count: 0 })
  );
};

/** Increments the timetable count within the current ad-unlock window. */
export const incrementAdCount = async () => {
  try {
    const raw = await AsyncStorage.getItem(AD_UNLOCK_KEY);
    if (!raw) return;
    const parsed  = JSON.parse(raw);
    parsed.count  = (parsed.count || 0) + 1;
    await AsyncStorage.setItem(AD_UNLOCK_KEY, JSON.stringify(parsed));
  } catch {}
};

// ─────────────────────────────────────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────────────────────────────────────
export function TimetableProvider({ children }) {
  const [timetables,       setTimetables]       = useState([]);
  const [timetableLoading, setTimetableLoading] = useState(false);

  // ── ACCESS STATUS ──────────────────────────────────────────────────────────
  // Cached from the server. Used by screens to decide which UI to show.
  // phase: "fresh" | "bonus" | "grace" | "restricted"
  const [accessStatus, setAccessStatus] = useState({
    phase:"fresh",
    isPaidUser:false,
    totalTimetables:0,
    graceMaxTables:3,
    bonusExpiresAt: null,
    gracePeriodEndsAt:null,
    daysRemaining:0,
    loaded:false,
  });

  const router = useRouter();

  // ── FETCH ACCESS STATUS ────────────────────────────────────────────────────
  const fetchAccessStatus = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(
        `${APPURL}/api/v1/books/timetable/access-status`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAccessStatus({ ...res.data, loaded: true });
    } catch (err) {
      console.log("fetchAccessStatus error:", err?.response?.data || err.message);
    }
  }, []);

  // ── FETCH ALL TIMETABLES ───────────────────────────────────────────────────
  // NOTE: kept as a stable function (not recreated each render) so it is safe
  // to call from background "fire and forget" code without stale-closure risk.
  const fetchTimetables = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      setTimetableLoading(true);

      const res = await axios.get(
        `${APPURL}/api/v1/books/fetch/timetables/books`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTimetables(res.data?.timetables || []);
    } catch (err) {
      console.log("Fetch timetable error:", err?.response?.data || err.message);
    } finally {
      setTimetableLoading(false);
    }
  }, []);

  // ── CREATE TIMETABLE ───────────────────────────────────────────────────────
  // KEY FIX: this used to block on local-notification scheduling AND on
  // fetchTimetables/fetchAccessStatus before resolving — so even though the
  // server responded instantly, the screen kept spinning. Now we resolve as
  // soon as the server confirms creation, and push everything else
  // (local scheduling, list refresh, access-status refresh) into the
  // background so the success alert shows immediately.
  const createTimetable = async (params) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Unauthorized", "Please log in to continue.");
        router.replace("/login");
        return;
      }

      // Attach ad-unlock header if the client has an active unlock window
      const { unlocked: hasAdUnlock } = await getAdUnlockState();

      const payload = {
        noticeCount:Number(params.noticeCount),
        reminderTime:params.reminderTime,
        reminderType:params.reminderType,
        studyDays:params.studyDays,
        bookId:params.bookId,
        notificationMessage: params.notificationMessage,
        timetableType:params.timetableType || "regular",
      };

      const headers = {
        Authorization: `Bearer ${token}`,
        ...(hasAdUnlock ? { "x-ad-unlock": "true" } : {}),
      };

      // Give the server call a generous-but-bounded timeout so a flaky
      // network doesn't hang the UI indefinitely either.
      const res = await axios.post(
        `${APPURL}/api/v1/books/create/timetable`,
        payload,
        { headers, timeout: 15000 }
      );

      const timetable = res.data?.timetable;
      if (!timetable) return res.data;

      // ── Optimistically update local state right away ──────────────────────
      // The screen can show success the instant the server confirms, without
      // waiting on a refetch round-trip.
      setTimetables((prev) => [timetable, ...prev]);

      // ── Everything below is "nice to have" follow-up work. It must NOT ────
      // block the promise this function returns, so callers (the screen)
      // get control back immediately after server confirmation.
      (async () => {
        try {
          if (hasAdUnlock) await incrementAdCount();
        } catch (e) {
          console.log("incrementAdCount error:", e.message);
        }

        try {
          const localResult = await scheduleTimetableLocally(timetable);
          if (localResult) console.log("✅ Local schedule result:", localResult);
        } catch (e) {
          console.log("scheduleTimetableLocally error:", e.message);
        }

        try {
          await Promise.all([fetchTimetables(), fetchAccessStatus()]);
        } catch (e) {
          console.log("post-create refresh error:", e.message);
        }
      })();

      return res.data;
    } catch (err) {
      console.log("❌ CREATE TIMETABLE FAILED:", err.message);
      if (err.response) {
        console.log("STATUS:", err.response.status);
        console.log("SERVER:", err.response.data);
      }
      throw err;
    }
  };

  // ── STOP TIMETABLE ─────────────────────────────────────────────────────────
  const stopTimetable = async (id) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("No token");

      const res = await axios.patch(
        `${APPURL}/api/v1/books/stop/timetable/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await hardCancelTimetableNotifications(id);
      await fetchTimetables();
      return res.data;
    } catch (err) {
      console.log("Stop error:", err?.response?.data || err.message);
      throw new Error(err?.response?.data?.message || "Failed to stop timetable");
    }
  };

  // ── REACTIVATE TIMETABLE ───────────────────────────────────────────────────
  const reactivateTimetable = async (id) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await axios.patch(
        `${APPURL}/api/v1/books/reactivate/timetable/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const timetable = res.data.timetable;

      await hardCancelTimetableNotifications(id);
      await scheduleOfflineTimetable({
        _id: timetable._id,
        reminderTime: timetable.reminderTime,
        reminderType: timetable.reminderType,
        studyDays:timetable.studyDays,
        notificationMessage: timetable.notificationMessage,
        planType: timetable.planType,
        bookTitle: timetable.bookId?.title || "Study Reminder",
        mode:timetable.deliveryMode,
      });

      await fetchTimetables();
      return res.data;
    } catch (err) {
      console.log("Reactivate error:", err?.response?.data || err.message);
      throw err;
    }
  };

  // ── MUTE / UNMUTE ──────────────────────────────────────────────────────────
  const muteNotifications = async (id) => {
    try {
      await muteLocalNotifications(id);
    } catch (err) {
      console.log("Mute error:", err.message);
      throw err;
    }
  };

  const unmuteNotifications = async (timetable) => {
    try {
      await unmuteLocalNotifications(timetable);
    } catch (err) {
      console.log("Unmute error:", err.message);
      throw err;
    }
  };

  const getLocalMuteState = async (id) => {
    try {
      return await isLocallyMuted(id);
    } catch {
      return false;
    }
  };

  // ── DELETE TIMETABLE ───────────────────────────────────────────────────────
  const deleteTimetable = async (id) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("No token");

      await axios.delete(`${APPURL}/api/v1/books/delete/timetable/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await hardCancelTimetableNotifications(id);
      await Promise.all([fetchTimetables(), fetchAccessStatus()]);
    } catch (err) {
      console.log("Delete error:", err?.response?.data || err.message);
      throw err;
    }
  };

  // ── GET SINGLE TIMETABLE ───────────────────────────────────────────────────
  const getTimetableById = async (id) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("No token");

      const res = await axios.get(
        `${APPURL}/api/v1/books/fetch/timetable/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err) {
      console.log("Get timetable error:", err?.response?.data || err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchTimetables();
    fetchAccessStatus();
  }, []);

  return (
    <TimetableContext.Provider
      value={{
        timetables,
        timetableLoading,
        accessStatus,        // ← screens read this to decide which UI to show
        fetchAccessStatus,
        createTimetable,
        stopTimetable,
        reactivateTimetable,
        muteNotifications,
        unmuteNotifications,
        getLocalMuteState,
        fetchTimetables,
        deleteTimetable,
        getTimetableById,
        saveAdUnlock,
      }}
    >
      {children}
    </TimetableContext.Provider>
  );
}