
import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as FileSystem from "expo-file-system/legacy";
import * as FileSystem from "expo-file-system";


const STORAGE_KEY = "offline_books";

export const saveBookOffline = async (book) => {
  try {
    if (!book?.fileUrl) throw new Error("No file available");

    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    const books = existing ? JSON.parse(existing) : [];

    // Return early if already saved
    const alreadyExists = books.find((b) => b._id === book._id);
    if (alreadyExists) {
      return alreadyExists.offlineUri;
    }

    const cleanUrl = book.fileUrl.split("?")[0];
    let filename = cleanUrl.split("/").pop();
    if (!filename.endsWith(".pdf")) filename += ".pdf";

    // Unique name prevents filename collisions
    const uniqueName = `${book._id}_${filename}`;
    const localUri = FileSystem.documentDirectory + uniqueName;

    const downloadResult = await FileSystem.downloadAsync(
      book.fileUrl,
      localUri
    );

    books.push({
      ...book,
      offlineUri: downloadResult.uri,
      savedOfflineAt: Date.now(),
    });

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(books));

    return downloadResult.uri;
  } catch (err) {
    console.log("Save offline error:", err);
    throw err;
  }
};

export const getOfflineBooks = async () => {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const removeOfflineBook = async (bookId) => {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  const books = data ? JSON.parse(data) : [];

  const target = books.find((b) => b._id === bookId);

  if (target?.offlineUri) {
    try {
      await FileSystem.deleteAsync(target.offlineUri, { idempotent: true });
    } catch {}
  }

  const updated = books.filter((b) => b._id !== bookId);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  return updated;
};