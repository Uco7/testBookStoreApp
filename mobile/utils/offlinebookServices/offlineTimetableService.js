


import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as FileSystem from "expo-file-system/legacy";
import * as FileSystem from "expo-file-system";


const STORAGE_KEY = "offline_timetables";

export const saveTimetableOffline = async (timetable) => {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    const list = existing ? JSON.parse(existing) : [];

    // Return early if already saved
    const alreadyExists = list.find((t) => t._id === timetable._id);
    if (alreadyExists) return alreadyExists;

    const book = timetable.bookId;
    let localUri = null;

    // Download the PDF locally if it's a file type
    if (book?.fileUrl && book?.fileType !== "link") {
      const cleanUrl = book.fileUrl.split("?")[0];
      let filename = cleanUrl.split("/").pop() || `${book._id}.pdf`;
      if (!filename.endsWith(".pdf")) filename += ".pdf";

      // Unique name to prevent collisions
      const uniqueName = `timetable_${timetable._id}_${filename}`;
      const localPath = FileSystem.documentDirectory + uniqueName;

      const info = await FileSystem.getInfoAsync(localPath);

      if (!info.exists) {
        const download = await FileSystem.downloadAsync(cleanUrl, localPath);
        localUri = download.uri;
      } else {
        localUri = localPath;
      }
    }

    const entry = {
      ...timetable,
      localUri,                          // local PDF path (null for link-type books)
      remoteUrl: book?.fileUrl || null,  // fallback remote URL
      savedOfflineAt: Date.now(),
    };

    list.push(entry);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));

    console.log("✅ Timetable saved offline:", timetable._id);
    return entry;
  } catch (err) {
    console.log("saveTimetableOffline error:", err);
    throw err;
  }
};

export const getOfflineTimetables = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const removeOfflineTimetable = async (timetableId) => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    const list = data ? JSON.parse(data) : [];

    const target = list.find((t) => t._id === timetableId);

    // Delete physical file from device if it exists
    if (target?.localUri) {
      await FileSystem.deleteAsync(target.localUri, { idempotent: true }).catch(
        () => {}
      );
    }

    const updated = list.filter((t) => t._id !== timetableId);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    console.log("🗑️ Offline timetable removed:", timetableId);
    return updated;
  } catch (err) {
    console.log("removeOfflineTimetable error:", err);
    throw err;
  }
};

export const isOfflineTimetable = async (timetableId) => {
  const list = await getOfflineTimetables();
  return list.some((t) => t._id === timetableId);
};