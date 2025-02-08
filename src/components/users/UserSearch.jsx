// src/components/users/UserSearch.jsx
import React from "react";
import { TextField } from "@mui/material";

const UserSearch = ({ searchTerm, onSearch }) => {
  return (
    <TextField
      label="Buscar"
      variant="outlined"
      size="small"
      value={searchTerm}
      onChange={(e) => onSearch(e.target.value)}
      sx={{ mb: 2 }}
    />
  );
};

export default UserSearch;
