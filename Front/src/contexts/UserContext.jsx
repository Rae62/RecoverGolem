import React, { createContext, useContext, useState, useEffect } from "react";
import * as userApi from "../apis/auth.api.js"; // importe tout l'API utilisateur
import { useLoaderData } from "react-router-dom";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const initialUser = useLoaderData();
  const [tempUser, setTempUser] = useState({});
  const [user, setUser] = useState(initialUser);

  useEffect(() => {
    if (!user?._id) {
      userApi.getCurrentUser().then((current) => {
        if (current && current._id) setUser(current);
      });
    }
  }, [user?._id]);

  // Méthode login dans le contexte : appelle l'API login puis met à jour le state user
  const login = async ({ email, password }) => {
    const response = await userApi.login({ email, password });
    if (response.success && response.user) {
      setUser(response.user);
    }
    return response;
  };

  // Méthode signup dans le contexte : appelle l'API signup, stocke tempUser éventuellement
  const signup = async (values) => {
    const response = await userApi.signup(values);
    if (response.success) {
      setTempUser(values); // stocker temporairement, à adapter selon besoin
    }
    return response;
  };

  return (
    <UserContext.Provider
      value={{
        tempUser,
        setTempUser,
        user,
        setUser,
        login,
        signup,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
