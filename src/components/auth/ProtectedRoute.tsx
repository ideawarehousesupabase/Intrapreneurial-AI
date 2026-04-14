import React from "react";
import { Navigate } from "react-router-dom";
import { User } from "@/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role: "Employee" | "Manager";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
  const userStr = localStorage.getItem("user");
  if (!userStr) {
    return <Navigate to="/" replace />;
  }

  try {
    const user: User = JSON.parse(userStr);
    if (user.role !== role) {
      // If role mismatch, fallback securely to index
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  } catch (err) {
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;
