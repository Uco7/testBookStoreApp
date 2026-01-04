// import { useContext } from "react";
// import { UserContext } from "../context/UserContext";
// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const APP_URL = "http://192.168.83.202:5000";

// export function useBook() {
//   const { user } = useContext(UserContext);

//   const createBook = async ({ title, author, description, file }) => {
//     const token = await AsyncStorage.getItem("token");

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("author", author);
//     formData.append("description", description);
//     formData.append("file", {
//       uri: file.uri,
//       name: file.name,
//       type: file.mimeType
//     });

//     const res = await axios.post(`${APP_URL}/books`, formData, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "multipart/form-data"
//       }
//     });

//     return res.data;
//   };

//   return { createBook };
// }


import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

let APPURl="https://testbookstoreapp.onrender.com";

export const BookContext = createContext();

export function BookProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const createBook = async ({ title, author, description, file }) => {
    if (!title || !file) throw new Error("Title and file required");

    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("No auth token found");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("description", description);
    formData.append("file", {
      uri: file.uri,
      type: file.mimeType || file.type || "application/pdf",
      name: file.name,
    });

    try {
      const res = await axios.post(`${APPURl}/books`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Book uploaded", res.data);

      // Optionally update local state
      setBooks((prev) => [res.data, ...prev]);

      return res.data; // <-- return the created book
    } catch (err) {
      console.log("Create book error:", err.response?.data || err.message);
      throw new Error(err.response?.data?.message || err.message);
    }
  };



  async function fetchBooks() {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await axios.get(`${APPURl}/get/books`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBooks(res.data);
    } catch (error) {
      console.log("fetch books error:", error.response?.data || error.message);
    }
  }

  useEffect(() => {
    fetchBooks();
  }, []);


  const updateBook = async (bookId, data) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("author", data.author);
    formData.append("description", data.description);
    if (data.file) {
      formData.append("file", {
        uri: data.file.uri,
        type: data.file.type || "application/pdf",
        name: data.file.name,
      });
    }

    await axios.put(`${APPURl}/books/${bookId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    fetchBooks(); // refresh list
  } catch (err) {
    console.log(err);
  }
};
const deleteBook = async (bookId) => {
  try {
    const token = await AsyncStorage.getItem("token");
    await axios.delete(`${APPURl}/books/${bookId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchBooks(); // refresh list
  } catch (err) {
    console.log(err);
  }
};


  return (
    <BookContext.Provider value={{ books, loading, createBook, fetchBooks, updateBook,deleteBook }}>
      {children}
    </BookContext.Provider>
  );
}

