// src/components/common/tables/GenericTableActions.jsx
import React from "react";
import { IconButton, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const GenericTableActions = ({ entityId, onEdit, onDelete }) => {
  return (
    <Box key={"actions_" + entityId}>
      <IconButton aria-label="edit" onClick={() => onEdit(entityId)}>
        <EditIcon />
      </IconButton>
      <IconButton aria-label="delete" onClick={() => onDelete(entityId)}>
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};

export default GenericTableActions;