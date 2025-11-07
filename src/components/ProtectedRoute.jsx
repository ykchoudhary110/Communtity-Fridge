// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // while checking auth, show nothing (or spinner)
  if (loading) return null;

  // if not signed in, redirect to /login
  if (!user) return <Navigate to="/login" replace />;

  // else render child pages
  return children;
}
