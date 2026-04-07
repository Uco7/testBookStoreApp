

import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Base URL
const APPURl ="https://b318-102-90-103-207.ngrok-free.app";

export const BookContext = createContext();

export function BookProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log("BookContext initialized with APPURl:", APPURl);

  // =========================
  // FETCH BOOKS (centralized)
  // =========================
  

  const fetchBooks = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(`${APPURl}/get/books`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(res.data);
    } catch (error) {
      console.log("Fetch books error:", error.response?.data || error.message);
    }
  };


  // =========================
  // CREATE BOOK
  // =========================
  const createBook = async ({ title, author, description, file, fileLink }) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const formData = new FormData();

      if (!title) {
        throw new Error("Title is required");
      }

      formData.append("title", title);

      if (author) formData.append("author", author);
      if (description) formData.append("description", description);
      if (fileLink) formData.append("fileLink", fileLink);

      if (file) {
        formData.append("file", {
          uri: file.uri,
          name: file.name,
          type: file.mimeType || "application/octet-stream",
        });
      }

      const response = await fetch(`${APPURl}/books`, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const text = await response.text();
      console.log("Backend response:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("Server did not return valid JSON");
      }

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      // ✅ IMPORTANT: refresh list after upload
      await fetchBooks();

      return data;
    } catch (error) {
      console.log("Create book error:", error.message);
      throw error;
    }
  };

  // =========================
  // UPDATE BOOK
  // =========================
  const updateBook = async (bookId, { title, author, description, file, fileLink }) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const formData = new FormData();

      if (title) formData.append("title", title);
      if (author) formData.append("author", author);
      if (description) formData.append("description", description);
      if (fileLink) formData.append("fileLink", fileLink);

      if (file) {
        formData.append("file", {
          uri: file.uri,
          type: file.mimeType || "application/octet-stream",
          name: file.name,
        });
      }

      await axios.put(`${APPURl}/books/${bookId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchBooks();
    } catch (err) {
      console.error("Update book error:", err.response?.data || err.message);
      throw err;
    }
  };

  // =========================
  // DELETE BOOK
  // =========================
  const deleteBook = async (bookId) => {
    try {
      const token = await AsyncStorage.getItem("token");

      await axios.delete(`${APPURl}/books/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchBooks();
    } catch (err) {
      console.log("Delete book error:", err.response?.data || err.message);
      throw err;
    }
  };

  // =========================
  // INIT LOAD
  // =========================
  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <BookContext.Provider
      value={{
        books,
        loading,
        createBook,
        fetchBooks,
        updateBook,
        deleteBook,
      }}
    >
      {children}
    </BookContext.Provider>
  );
}