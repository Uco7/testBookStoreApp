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
// const APPURl = "http://192.168.150.202:5000";

export const BookContext = createContext();

export function BookProvider({ children }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Create Book (supports uploaded file OR external link)
  const createBook = async ({ title, author, description, file, fileLink }) => {
    if (!title || (!file && !fileLink)) {
      throw new Error("Title and either file or link required");
    }

    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("No auth token found");

    const formData = new FormData();
    formData.append("title", title);
    if (author) formData.append("author", author);
    if (description) formData.append("description", description);
    if (file) {
      formData.append("file", {
        uri: file.uri,
        type: file.mimeType || file.type || "application/pdf",
        name: file.name,
      });
    }
    if (fileLink) formData.append("fileLink", fileLink);

    try {
      const res = await axios.post(`${APPURl}/books`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Book created", res.data);

      // Update local state
      setBooks((prev) => [res.data, ...prev]);
      return res.data;
    } catch (err) {
      console.log("Create book error:", err.response?.data || err.message);
      throw new Error(err.response?.data?.message || err.message);
    }
  };

  // Fetch all books
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

  // Update Book (supports uploaded file OR external link)
  const updateBook = async (bookId, { title, author, description, file, fileLink }) => {
  try {
    const token = await AsyncStorage.getItem("token");
    const formData = new FormData();

    if (title) formData.append("title", title);
    if (author) formData.append("author", author);
    if (description) formData.append("description", description);

    if (file) {
      formData.append("file", {
        uri: file.uri,
        type: file.mimeType || "application/octet-stream",
        name: file.name,
      });
    }

    if (fileLink) formData.append("fileLink", fileLink);

    await axios.put(`${APPURl}/books/${bookId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });

    fetchBooks();
  } catch (err) {
    console.error("Update book error:", err.response?.data || err.message);
    throw err;
  }
};

  // const updateBook = async (bookId, { title, author, description, file, fileLink }) => {
  //   try {
  //     const token = await AsyncStorage.getItem("token");
  //     const formData = new FormData();

  //     if (title) formData.append("title", title);
  //     if (author) formData.append("author", author);
  //     if (description) formData.append("description", description);
  //     if (file) {
  //       formData.append("file", {
  //         uri: file.uri,
  //         type: file.type || "application/pdf",
  //         name: file.name,
  //       });
  //     }
  //     if (fileLink) formData.append("fileLink", fileLink);

  //     await axios.put(`${APPURl}/books/${bookId}`, formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     fetchBooks(); // refresh list
  //   } catch (err) {
  //     console.log("Update book error:", err.response?.data || err.message);
  //     throw err;
  //   }
  // };

  // Delete Book
  const deleteBook = async (bookId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.delete(`${APPURl}/books/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBooks();
    } catch (err) {
      console.log("Delete book error:", err.response?.data || err.message);
      throw err;
    }
  };

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
