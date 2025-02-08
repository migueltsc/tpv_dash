// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import MainLayout from "./components/layout/MainLayout";
import UserTable from "./components/users/UserTable";
import RolesTable from "./components/roles/RolesTable"; // Importa RolesTable
import "./App.css";
import { ThemeProvider, Typography } from "@mui/material";
import theme from "./theme";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <MainLayout>
          <Routes>
            <Route
              path="/"
              element={
                <Typography variant="h6" component="div">
                  Selecciona una tabla del menú
                </Typography>
              }
            />
            <Route path="/users" element={<UserTable />} />
            <Route path="/roles" element={<RolesTable />} /> {/* Ruta para la tabla de Roles */}
            <Route path="/roles/:id" element={<RolesTable />} /> {/* **Nueva ruta para editar un rol específico** */}
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
};

export default App;