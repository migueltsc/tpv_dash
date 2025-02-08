// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Importa Routes y Route
import useAuth from "./hooks/useAuth";
import MainLayout from "./components/layout/MainLayout";
import UserTable from "./components/users/UserTable";
// import RolesTable from "./components/roles/RolesTable"; // Si tuvieras un componente RolesTable, importalo aquí
import "./App.css";
import { ThemeProvider, Typography } from "@mui/material";
import theme from "./theme";

const App = () => {
  // Ya no necesitamos el estado selectedTable ni handleTableSelect
  // const [selectedTable, setSelectedTable] = useState(null);
  // const handleTableSelect = (table) => {
  //   setSelectedTable(table);
  // };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <MainLayout /* onTableSelect={handleTableSelect} Ya no es necesario */>
          <Routes> {/* Envuelve tus Route dentro de Routes */}
            <Route path="/" element={ // Ruta por defecto (/)
              <Typography variant="h6" component="div">
                Selecciona una tabla del menú
              </Typography>
            } />
            <Route path="/users" element={<UserTable />} /> {/* Ruta para la tabla de usuarios */}
            {/* <Route path="/roles" element={<RolesTable />} /> */} {/* Ruta para la tabla de roles (si la tuvieras) */}
            {/* Puedes añadir más rutas aquí para otras tablas (productos, etc.) */}
          </Routes>
        </MainLayout>
      </Router>
    </ThemeProvider>
  );
};

export default App;