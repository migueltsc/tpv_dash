import React, { createContext, useState, useEffect } from "react";
import api, { loginUrl } from "../api/api";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post(loginUrl, { email, password });
      const userData = response.data;
      updateUserContext(userData); // Utiliza la función updateUserContext
      return true;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Nueva función para actualizar el contexto del usuario
  const updateUserContext = (newUserData) => {
    setUser(newUserData);
    localStorage.setItem("user", JSON.stringify(newUserData));
  };

  const authContextValue = {
    user,
    login,
    logout,
    updateUserContext, // Agrega la función al contexto
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
