// src/components/common/GenericForm.jsx
import React, { useState, useEffect } from "react";
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

const GenericForm = ({
  initialValues,
  onSubmit,
  onClose,
  formConfig, // ¡Nueva prop: formConfig!
}) => {
  const [values, setValues] = useState({});
  const [formTouched, setFormTouched] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Inicializar 'values' con 'initialValues' o con valores por defecto de formConfig.fields
    const initialFormValues = {};
    formConfig.fields.forEach(field => {
      initialFormValues[field.name] = initialValues ? initialValues[field.name] : field.defaultValue || "";
    });
    setValues(initialFormValues);
  }, [initialValues, formConfig.fields]);


  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
    setFormTouched(true);
  };

  const validate = () => {
    let newErrors = {};
    formConfig.fields.forEach(field => {
      if (field.required && !values[field.name]) {
        newErrors[field.name] = `${field.label} es obligatorio`;
      }
      // TODO: Añadir más tipos de validación (email, minLength, etc.) basados en formConfig.fields[].validationRules
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormTouched(true);
    if (validate()) {
      try {
        let response;
        if (initialValues) {
          // Editar entidad
          response = await api.put(`${formConfig.apiEndpoint}/${initialValues.id}`, values);
        } else {
          // Crear nueva entidad
          response = await api.post(formConfig.apiEndpoint, values);
        }
        onSubmit(); // Llama a la función onSubmit para recargar la tabla
        onClose();  // Cierra el modal
      } catch (error) {
        console.error(`Error al guardar ${formConfig.entityType}:`, error);
        // TODO: Manejar errores de forma más robusta
      }
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2, width: 400 }}
    >
      {formConfig.fields.map((field) => (
        <React.Fragment key={field.name}>
          {field.type === "select" ? (
            <FormControl variant="outlined" size="small" required={field.required}>
              <InputLabel id={`${field.name}-label`}>{field.label}</InputLabel>
              <Select
                labelId={`${field.name}-label`}
                name={field.name}
                value={values[field.name] || ""}
                onChange={handleChange}
                label={field.label}
                error={!!errors[field.name]}
              >
                {field.options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors[field.name] && <Typography color="error" variant="caption">{errors[field.name]}</Typography>}
            </FormControl>
          ) : (
            <TextField
              label={field.label}
              name={field.name}
              type={field.type || "text"} // Default type "text"
              value={values[field.name] || ""}
              onChange={handleChange}
              error={!!errors[field.name]}
              helperText={errors[field.name]}
              variant="outlined"
              size="small"
              required={field.required}
              multiline={field.multiline} // Para campos multilínea
              rows={field.rows}           // Número de filas para multilínea
            />
          )}
        </React.Fragment>
      ))}

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button type="submit" variant="contained" color="primary">
          Guardar
        </Button>
      </Box>
    </Box>
  );
};

export default GenericForm;