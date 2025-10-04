// src/components/RequireAuth.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    // Redirect to /login, keep attempted path in state so you can implement post-login redirect if desired
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
