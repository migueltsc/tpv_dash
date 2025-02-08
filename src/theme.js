import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#f0f0f0", // Gris suave para el AppBar
      contrastText: "#000000", // Texto en negro para contrastar con el gris
    },
    link: {
      // Define un nuevo color para los enlaces
      main: "#a2a2a2", // Gris suave para los enlaces
    },
  },
  components: {
    MuiLink: {
      // Estilos globales para los componentes Link de Material UI
      styleOverrides: {
        root: {
          color: "#a2a2a2", // Aplica el color gris a todos los enlaces
          textDecoration: "none", // Elimina el subrayado por defecto
          "&:hover": {
            // Estilo al pasar el mouse por encima
            textDecoration: "underline", // Agrega el subrayado al pasar el mouse
          },
        },
      },
    },
  },
});

export default theme;
