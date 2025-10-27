import React from "react";
import { Navigate } from "react-router-dom";

export default function AuthRedirect({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  if (isAuthenticated) {
    return <Navigate to="/jobs" replace />;
  }

  return <>{children}</>;
}
