// src/components/UserForm.jsx
import React, { useState, useEffect, useContext } from "react";
import {
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import api from "../../api/api";
import { AuthContext } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import useUserValidation from "../../hooks/useGenericValidation";
import ImageWithUpload from "../ImageWithUpload";

const UserForm = ({
  initialValues,
  onSubmit,
  roles,
  onClose,
  isRegistering = false,
}) => {
  const { user, updateUserContext } = useContext(AuthContext);
  const [values, setValues] = useState(
    initialValues || {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
      role_id: "",
      image_url: "",
    }
  );
  const [isNewUser, setIsNewUser] = useState(!initialValues);
  const [showPassword, setShowPassword] = useState(isNewUser);
  const [passwordModified, setPasswordModified] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  const navigate = useNavigate();

  const errors = useUserValidation(values, isRegistering, formTouched);

  useEffect(() => {
    setIsNewUser(!initialValues);
    setShowPassword(!initialValues);
    setValues(
      initialValues || {
        name: "",
        email: "",
        password: "",
        passwordConfirm: "",
        role_id: "",
        image_url: "",
      }
    );
  }, [initialValues]);

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
    setFormTouched(true);
    if (event.target.name === "password") {
      setPasswordModified(true);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const validate = () => {
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormTouched(true);
    if (validate()) {
      try {
        const userData = {
          name: values.name,
          email: values.email,
          role_id: values.role_id,
          image_url: values.image_url,
        };

        if (isRegistering) {
          userData.password = values.password;
          userData.passwordConfirm = values.passwordConfirm;
        } else if (passwordModified) {
          userData.password = values.password;
        }

        let response;
        if (isRegistering) {
          response = await api.post("/auth/register", userData);
        } else {
          response = await api.put(`/users/${initialValues.id}`, userData);
        }

        onSubmit();
        onClose();

        if (user && user.user.id === initialValues.id) {
          const updatedUserResponse = await api.get(`/auth/me`);
          const updatedUser = updatedUserResponse.data;

          const simulatedLoginData = { user: updatedUser, token: user.token };
          updateUserContext(simulatedLoginData);
        }
      } catch (error) {
        console.error("Error al guardar el usuario:", error);
      }
    }
  };

  const handleImageChange = (newImageUrl) => {
    setValues({ ...values, image_url: newImageUrl });
    setFormTouched(true);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2 }}
    >
      <ImageWithUpload
        imageUrl={values.image_url || ""}
        onChange={handleImageChange}
        entityId={initialValues?.id}
        entityRoute="users"
      />
      <TextField
        label="Nombre"
        name="name"
        value={values.name}
        onChange={handleChange}
        error={!!errors.name}
        helperText={errors.name}
        variant="outlined"
        size="small"
        required
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        value={values.email}
        onChange={handleChange}
        error={!!errors.email}
        helperText={errors.email}
        variant="outlined"
        size="small"
        required
      />
      {(showPassword || isRegistering) && (
        <TextField
          label="Contraseña"
          name="password"
          type="password"
          value={values.password || ""}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
          variant="outlined"
          size="small"
          required={isRegistering || isNewUser}
        />
      )}
      {isRegistering && (
        <TextField
          label="Confirmar Contraseña"
          name="passwordConfirm"
          type="password"
          value={values.passwordConfirm || ""}
          onChange={handleChange}
          error={!!errors.passwordConfirm}
          helperText={errors.passwordConfirm}
          variant="outlined"
          size="small"
          required={isRegistering}
        />
      )}
      {!isRegistering && !isNewUser && (
        <Button onClick={handleTogglePassword}>
          {showPassword ? "Ocultar" : "Cambiar"} contraseña
        </Button>
      )}
      <FormControl variant="outlined" size="small" required>
        <InputLabel id="role-label">Rol</InputLabel>
        <Select
          labelId="role-label"
          name="role_id"
          value={values.role_id}
          onChange={handleChange}
          label="Rol"
          error={!!errors.role_id}
        >
          {roles.map((role) => (
            <MenuItem key={role.id} value={role.id}>
              {role.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button type="submit" variant="contained" color="primary">
          Guardar
        </Button>
      </Box>
    </Box>
  );
};

export default UserForm;
