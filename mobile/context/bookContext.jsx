

import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Alert } from "react-native";
import { useRouter } from "expo-router";

// Base URL
const APPURl ="https://0e22-102-90-96-16.ngrok-free.app";
// const APPURl ="https://testbookstoreapp-backend-my8t.onrender.com";

export const BookContext = createContext();

export function BookProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  console.log("BookContext initialized with APPURl:", APPURl);

  // =========================
  // FETCH BOOKS (centralized)
  // =========================
  

  const fetchBooks = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if(!token) {
        Alert.alert("Unauthorized Access", "Please log in.");
        setTimeout(()=>{
          router.replace("/login");

        },1000
        )
        return;
        
        
      }
      const res = await axios.get(`${APPURl}/api/books/get/all-books`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched books:", res);
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
      if (!token) {
        Alert.alert("Unauthorized", "Please log in to create a book.");
        router.replace("/login");
        return;
       
      }

      const formData = new FormData();
      console.log( "formdata created",formData)

      if (!title) {
        throw new Error("Title field is required");
          }

      formData.append("title", title);

      if (author) formData.append("author", author);
      if (description) formData.append("description", description);
      if (fileLink) formData.append("fileLink", fileLink);

      if (file?.uri) {
        formData.append("file", {
          uri: file.uri,
          name: file.name,
          type: file.mimeType || "application/octet-stream",
        });
      }
      console.log("FormData prepared for upload:", formData);
      if (file) {
        console.log("File details:");
        console.log("URI:", file.uri);
        console.log("Name:", file.name);
        console.log("MIME Type:", file.mimeType);
      } else {
        console.log("No file selected.");
      }
      

      const response = await fetch(`${APPURl}/api/books/create-book`, {
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
      } catch (err) {
        throw new Error("Server can not be reached"||err.message);
      }

      if (!response.ok) {
        console.log("not ok response",data.message)
        throw new Error(data.message );
      }

      // ✅ IMPORTANT: refresh list after upload
      await fetchBooks();

      return data;
    } catch (err) {
      let errorMessage = "Something went wrong";

      if (err.message === "Network Error") {
        errorMessage = "Network request failed. Please check your internet connection.";
      } else if (err.response) {
        errorMessage =  "Request failed. Please try again.";
      } else if (err.request) {
        errorMessage = "Server is not responding. Try again later.";
      }
      else {errorMessage = err.message || "An unexpected error occurred.";
      }
      console.log("Create book error:", errorMessage);
       throw new Error(errorMessage);
      // console
      // console.log("Create book error:", err.message);
      throw new Error(err.message || "Failed to create book. Please try again.");
    }
  };

  // =========================
  // UPDATE BOOK
  // =========================
  const updateBook = async (bookId, { title, author, description, file, fileLink }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Unauthorized", "Please log in to update a book.");
        router.replace("/login");
        return;
      }

      const formData = new FormData();

      if (title) formData.append("title", title);
      if (author) formData.append("author", author);
      if (description) formData.append("description", description);
      if (fileLink) formData.append("fileLink", fileLink);

      if (file?.uri) {
        formData.append("file", {
          uri: file.uri,
          type: file.mimeType || "application/octet-stream",
          name: file.name,
        });
        console.log("File included in update:", file);
      }

      await axios.put(`${APPURl}/api/books/update-book/${bookId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchBooks();
    } catch (err) {
      let errorMessage = "Something went wrong";

      if (err.message === "Network Error") {
        errorMessage = "Network request failed. Please check your internet connection.";
      } else if (err.response) {
        errorMessage =  "Request failed. Please try again.";
      } else if (err.request) {
        errorMessage = "Server is not responding. Try again later.";
      }
      else {errorMessage = err.message || "An unexpected error occurred.";
      }
      console.log("Update book error:", err.response?.data || err.message);
      throw new Error(errorMessage);
    }
  };

  // =========================
  // DELETE BOOK
  // =========================
  const deleteBook = async (bookId) => {
    try {
      const token = await AsyncStorage.getItem("token");

      await axios.delete(`${APPURl}/api/books/delete-book/${bookId}`, {
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