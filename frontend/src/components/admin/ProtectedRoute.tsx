// src/components/admin/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: any) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token) {
    return <Navigate to="/login" />;  // no token = go to login
  }

  if (user.role !== "admin") {
    return <Navigate to="/login" />;  // not admin = go to login
  }

  return children;
}