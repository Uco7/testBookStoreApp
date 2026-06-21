// import React, { createContext, useState, useEffect, useContext } from 'react';
// import { BASE_URL } from '../middleWare/urlConfig';


// import { useRef } from "react";





// export const AdminBookProvider = ({ children }) => {
//     const [books, setBooks] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [actionError, setActionError] = useState('');
//     const [deletingId, setDeletingId] = useState(null);
//     const fetchedRef = useRef(false);

//   const authHeaders = () => {
//     const token = localStorage.getItem('adminToken');
//     return {
//       'Content-Type': 'application/json',
//       'Authorization': token ? `Bearer ${token}` : '',
//       // Bypasses the ngrok interception page, same as your other contexts.
//       'ngrok-skip-browser-warning': 'true',
//     };
//   };

//   // ── FETCH ALL UPLOADED BOOKS ──────────────────────────────────────────
//   const fetchBooks = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       // NOTE: this assumes adminBookRoute.js has been fixed to use
//       // router.get("/", getAllUploadedBooks) rather than
//       // router.get("/admin/books", ...). With the original route, this
//       // request would actually need to hit
//       // /api/admin/books/admin/books — that mismatch is a routing bug,
//       // not something to work around here.
//       const response = await fetch(`${BASE_URL || ''}/api/admin/books`, {
//         method: 'GET',
//         headers: authHeaders(),
//       });

//       // The backend returns 404 when there are zero uploaded books — a
//       // valid "nothing uploaded yet" result, not a real server error.
//       // Same convention as UserContext / AdminTimetableContext.
//       if (response.status === 404) {
//         setBooks([]);
//         return;
//       }

//       if (!response.ok) {
//         throw new Error(`Could not fetch books (status ${response.status}).`);
//       }

//       const data = await response.json();
//       setBooks(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error('Fetch Books Context Error:', err);
//       setError(err.message || 'Server connection failed.');
//       setBooks([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── DELETE BOOK (admin action) ────────────────────────────────────────
//   const deleteBook = async (id) => {
//     setActionError('');
//     setDeletingId(id);
//     try {
//       const response = await fetch(`${BASE_URL || ''}/api/admin/books/${id}`, {
//         method: 'DELETE',
//         headers: authHeaders(),
//       });

//       const body = await response.json().catch(() => ({}));

//       if (!response.ok) {
//         throw new Error(body?.message || `Failed to delete book (status ${response.status}).`);
//       }

//       // Re-pull from the server rather than just splicing local state, so
//       // this stays correct if other admin views/dashboard cards also
//       // depend on book counts.
//       await fetchBooks();

//       return body;
//     } catch (err) {
//       console.error('Delete Book (admin) error:', err);
//       setActionError(err.message || 'Failed to delete book.');
//       throw err;
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   const AdminBookContext = createContext({
//     books: [],
//     loading: false,
//     error: '',
//     refreshBooks: async () => {},
//     deleteBook: async () => {},
// });

//   return (
//     <AdminBookContext.Provider
//       value={{
//         books,
//         loading,
//         error,
//         actionError,
//         deletingId,
//         refreshBooks: fetchBooks,
//         deleteBook,
//       }}
//     >
//       {children}
//     </AdminBookContext.Provider>
//   );
// };

// export const useAdminBooks = () => {
//   const context = useContext(AdminBookContext);
//   if (!context) {
//     throw new Error('useAdminBooks must be used within an AdminBookProvider');
//   }
//   return context;
// };
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import { BASE_URL } from "../middleWare/urlConfig";

const AdminBookContext = createContext({
  books: [],
  loading: false,
  error: "",
  actionError: "",
  deletingId: null,
  refreshBooks: async () => {},
  deleteBook: async () => {},
});

export const AdminBookProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // Prevent duplicate requests in React StrictMode
  const fetchedRef = useRef(false);

  const authHeaders = () => {
    const token = localStorage.getItem("adminToken");

    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      "ngrok-skip-browser-warning": "true",
    };
  };

  // =====================================================
  // FETCH BOOKS
  // =====================================================
  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${BASE_URL}/api/admin/books`,
        {
          method: "GET",
          headers: authHeaders(),
        }
      );

      // Empty collection
      if (response.status === 404) {
        setBooks([]);
        return;
      }

      // Rate limit
      if (response.status === 429) {
        setError(
          "Too many requests. Please wait a few seconds and refresh."
        );
        return;
      }

      if (!response.ok) {
        throw new Error(
          `Could not fetch books (status ${response.status})`
        );
      }

      const data = await response.json();

      setBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch Books Context Error:", err);

      setError(
        err.message || "Unable to connect to server."
      );

      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // DELETE BOOK
  // =====================================================
  const deleteBook = async (id) => {
    try {
      setDeletingId(id);
      setActionError("");

      const response = await fetch(
        `${BASE_URL}/api/admin/books/${id}`,
        {
          method: "DELETE",
          headers: authHeaders(),
        }
      );

      const body = await response
        .json()
        .catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          body?.message ||
            `Delete failed (${response.status})`
        );
      }

      setBooks((prev) =>
        prev.filter((book) => book._id !== id)
      );

      return body;
    } catch (err) {
      console.error(
        "Delete Book Error:",
        err
      );

      setActionError(
        err.message || "Failed to delete book."
      );

      throw err;
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================================
  // FETCH ONCE
  // =====================================================
  useEffect(() => {
    if (fetchedRef.current) return;

    fetchedRef.current = true;
    fetchBooks();
  }, []);

  return (
    <AdminBookContext.Provider
      value={{
        books,
        loading,
        error,
        actionError,
        deletingId,
        refreshBooks: fetchBooks,
        deleteBook,
      }}
    >
      {children}
    </AdminBookContext.Provider>
  );
};

export const useAdminBooks = () => {
  const context = useContext(AdminBookContext);

  if (!context) {
    throw new Error(
      "useAdminBooks must be used within an AdminBookProvider"
    );
  }

  return context;
};