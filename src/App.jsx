// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import useAuth from "./hooks/useAuth";
import MainLayout from "./components/layout/MainLayout";
import UserTable from "./components/users/UserTable";
import "./App.css";
import { ThemeProvider, Typography } from "@mui/material"; // Import Typography
import theme from "./theme";

const App = () => {
  const [selectedTable, setSelectedTable] = useState(null);

  const handleTableSelect = (table) => {
    setSelectedTable(table);
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <MainLayout onTableSelect={handleTableSelect}>
          {selectedTable === "users" ? (
            <UserTable />
          ) : (
            <Typography variant="h6" component="div">
              Selecciona una tabla del menú
            </Typography>
          )}
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
};

export default App;
