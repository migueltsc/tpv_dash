// src/components/users/UserActions.jsx
import React, { useContext } from "react";
import { IconButton, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { AuthContext } from "../../context/AuthProvider"; // Importa el contexto de autenticación

const UserActions = ({ userId, onEdit, onDelete }) => {
  const { user } = useContext(AuthContext); // Obtiene el usuario autenticado

  return (
    <Box key={"actions_" + userId}>
      <IconButton aria-label="edit" onClick={() => onEdit(userId)}>
        <EditIcon />
      </IconButton>
      <IconButton
        aria-label="delete"
        onClick={() => onDelete(userId)}
        disabled={userId === (user?.user?.id || null)} // Deshabilita el botón si es el usuario actual
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};

export default UserActions;
