import React from "react";
import { useUser } from "../../contexts/UserContext";
import { Navigate } from "react-router-dom";

export default function UserNotConnected({ children }) {
  const { user } = useUser();
  return !user ? children : <Navigate to="/home" />;
}
