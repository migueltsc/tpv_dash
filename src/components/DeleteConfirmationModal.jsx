// src/components/DeleteConfirmationModal.jsx
import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const DeleteConfirmationModal = ({ open, onClose, onConfirm, itemName }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"¿Eliminar " + itemName + "?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          ¿Estás seguro de que quieres eliminar este {itemName}? Esta acción no
          se puede deshacer.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onConfirm} autoFocus color="error">
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
