// components/AdminProtectedRoute.jsx
//
// Guards admin-only routes. Redirects to the admin login/register page
// if there's no authenticated admin (no token in context).
//
// Usage in your router config:
//
//   import AdminProtectedRoute from './components/AdminProtectedRoute';
//
//   <Route
//     path="/admin/dasbord-page"
//     element={
//       <AdminProtectedRoute>
//         <Dashbord />
//       </AdminProtectedRoute>
//     }
//   />
//
// Wrap EVERY admin-only route this way (Users, Uploaded Items,
// Timetables, Subscribed Users, Users Activities, etc.) — not just the
// dashboard — otherwise someone can bypass the guard by navigating
// directly to those other URLs.

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";

const AdminProtectedRoute = ({ children }) => {
  const { admin, token } = useAdmin();
  const location = useLocation();

  // Treat "authenticated" as having both a token AND admin data. Token
  // alone could be a stale/cleared localStorage edge case; checking
  // both matches how AdminContext's restore-on-refresh effect sets them
  // together.
  const isAuthenticated = Boolean(token && admin);

  if (!isAuthenticated) {
    // `state={{ from: location }}` lets the login page redirect back to
    // wherever the admin was trying to go, after a successful login —
    // optional to use, but harmless to pass along.
    return <Navigate to="/admin/auth-page" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminProtectedRoute;