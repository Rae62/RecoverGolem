import React from "react";
import { useUser } from "../../contexts/UserContext";
import { Navigate } from "react-router-dom";

export default function UserConnected({ children }) {
  const { user } = useUser();
  console.log({ user });

  return user ? children : <Navigate to="/sign-in" />;
}
