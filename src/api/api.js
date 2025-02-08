import axios from "axios";

const apiUrl = import.meta.env.VITE_API_BASE_URL; // Usar la URL completa directamente

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de solicitud
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user ? user.token : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuesta
api.interceptors.response.use(
  (response) => {
    // Captura el header x-total-count y lo agrega a la respuesta
    response.totalCount = response.headers["x-total-count"];
    return response;
  },
  (error) => {
    console.error("Error en la petición:", error);

    if (error.response) {
      console.error("Datos del error:", error.response.data);
      console.error("Estado del error:", error.response.status);
      console.error("Cabeceras del error:", error.response.headers);

      alert(
        `Error: ${error.response.status} - ${
          error.response.data.message || "Ocurrió un error"
        }`
      );
    } else if (error.request) {
      console.error("No se recibió respuesta del servidor");
      alert("No se pudo conectar con el servidor.");
    } else {
      console.error("Error al configurar la petición:", error.message);
      alert("Ocurrió un error al realizar la petición.");
    }

    return Promise.reject(error);
  }
);

export const loginUrl = `${apiUrl}/auth/login`;
export const logoutUrl = `${apiUrl}/auth/logout`;

export default api;
