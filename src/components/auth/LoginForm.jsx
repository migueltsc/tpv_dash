// src/components/auth/LoginForm.jsx
import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";

const LoginForm = ({ onSubmit }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: 400,
        mx: "auto",
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Iniciar Sesión
      </Typography>
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        variant="outlined"
        size="small"
        margin="normal"
        required
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        variant="outlined"
        size="small"
        margin="normal"
        required
      />
      <Button variant="contained" color="primary" type="submit">
        Login
      </Button>
    </Box>
  );
};

export default LoginForm;
