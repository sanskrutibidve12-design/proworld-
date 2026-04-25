// src/components/student/StudentRoute.tsx
import { Navigate } from "react-router-dom";

export default function StudentRoute({ children }: any) {
  const token = localStorage.getItem("token");
  console.log("token being sent:",token);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token || user.role !== "student") {
    return <Navigate to="/login" />;
  }

  return children;
}