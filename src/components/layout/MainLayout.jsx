// src/components/layout/MainLayout.jsx
import React, { useState } from "react";
import { Box, Toolbar } from "@mui/material";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import useAuth from "../../hooks/useAuth";
import LoginForm from "../auth/LoginForm";

const MainLayout = ({ children /*, onTableSelect Ya no necesitamos onTableSelect */ }) => { // Elimina onTableSelect de las props
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const { user, logout, login } = useAuth();

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleLogin = async (email, password) => {
    await login(email, password);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <TopBar user={user} logout={logout} toggleSidebar={toggleSidebar} />
      <Sidebar
        open={sidebarVisible}
        onClose={toggleSidebar}
        /* onTableSelect={onTableSelect} Ya no necesitamos onTableSelect */
      />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {user ? children : <LoginForm onSubmit={handleLogin} />} {/* Renderiza children (que serán los componentes de las rutas) */}
      </Box>
    </Box>
  );
};

export default MainLayout;