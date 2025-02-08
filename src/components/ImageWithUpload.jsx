// src/components/ImageWithUpload.jsx
import React, { useState } from "react";
import { Avatar, IconButton, Popover, Typography, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../api/api";

const ImageWithUpload = ({ imageUrl, onChange, entityId, entityRoute }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);

    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await api.post(
          import.meta.env.VITE_IMAGE_UPLOAD_URL,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const newImageUrl = response.data.url;

        // Actualizar el registro con la nueva URL de la imagen
        await api.put(`/${entityRoute}/${entityId}`, {
          image_url: newImageUrl,
        });

        onChange(newImageUrl); // Llama a la función onChange con la nueva URL
        handleClose();
      } catch (error) {
        console.error("Error al subir la imagen:", error);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    }
  };

  const handleDeleteImage = async () => {
    try {
      // Actualizar el registro con la URL de la imagen vacía
      await api.put(`/${entityRoute}/${entityId}`, { image_url: null });

      onChange(null); // Llama a la función onChange con null para eliminar la imagen
      handleClose();
    } catch (error) {
      console.error("Error al eliminar la imagen:", error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "image-upload-popover" : undefined;

  // Construir la URL absoluta de la imagen
  const defaultImageUrl =
    "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
  const absoluteImageUrl =
    imageUrl && imageUrl.trim() !== ""
      ? import.meta.env.VITE_API_IMAGE_BASE_URL + imageUrl
      : defaultImageUrl;

  return (
    <div>
      <IconButton onClick={handleImageClick}>
        <Avatar alt="User Image" src={absoluteImageUrl} />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography>Opciones de imagen:</Typography>
          <label htmlFor="image-upload">
            <IconButton component="span">
              <EditIcon /> Cambiar
            </IconButton>
          </label>
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="image-upload"
            type="file"
            onChange={handleImageChange}
          />
          {imageUrl && (
            <IconButton onClick={handleDeleteImage}>
              <DeleteIcon /> Eliminar
            </IconButton>
          )}
        </Box>
      </Popover>
    </div>
  );
};

export default ImageWithUpload;
