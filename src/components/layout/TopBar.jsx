// src/components/layout/TopBar.jsx
import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  styled,
  Button,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";

const Logo = styled("img")({
  height: 40,
  marginRight: 10,
});

const TopBar = ({ user, logout, toggleSidebar }) => {
  return (
    <AppBar position="fixed" color="primary">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={toggleSidebar} // Llama a toggleSidebar al hacer clic
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Logo src="/tsc-logo.png" alt="TSC Logo" />
          </Link>
          {user && (
            <Typography variant="h6" component="div" color="textPrimary">
              Hola, {user?.user?.name}
            </Typography>
          )}
        </Box>
        {user && (
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
