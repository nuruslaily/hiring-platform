import React from "react";
import { Navigate } from "react-router-dom";

export default function TestingRedirect({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuthenticatedTesting = localStorage.getItem("isAuthenticatedTesting");

  if (isAuthenticatedTesting) {
    return <Navigate to="/notification" replace />;
  }

  return <>{children}</>;
}
