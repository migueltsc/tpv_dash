// src/hooks/useUserValidation.jsx
import { useState, useEffect } from "react";

const useUserValidation = (values, isRegistering, touched) => {
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!touched) {
      return; // No ejecutar la validación si el formulario no ha sido tocado
    }

    let newErrors = {};
    if (!values.name) newErrors.name = "El nombre es obligatorio";
    if (!values.email) {
      newErrors.email = "El email es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      newErrors.email = "El email no es válido";
    }
    if (isRegistering) {
      if (!values.password) {
        newErrors.password = "La contraseña es obligatoria";
      } else if (values.password.length < 6) {
        newErrors.password = "La contraseña debe tener al menos 6 caracteres";
      }
      if (values.password !== values.passwordConfirm) {
        newErrors.passwordConfirm = "Las contraseñas no coinciden";
      }
    } else {
      if (values.password && values.password.length < 6) {
        newErrors.password = "La contraseña debe tener al menos 6 caracteres";
      }
    }

    setErrors(newErrors);
  }, [values, isRegistering, touched]);

  return errors;
};

export default useUserValidation;
