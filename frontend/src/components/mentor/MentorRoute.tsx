import { Navigate } from "react-router-dom";

export default function ProtectedRouteMentor({ children }: any) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ❌ No token → login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // ❌ Not mentor → block
  if (user.role !== "mentor") {
    return <Navigate to="/login" />;
  }

  // ✅ Mentor → allow access
  return children;
}