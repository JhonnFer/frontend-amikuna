import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api"; // ya termina en /api/

const fetchDataBackend = async (endpoint, token) => {
  // Evitamos barra inicial para no generar doble slash:
  const url = `${API_URL}${endpoint.startsWith("/") ? endpoint.slice(1) : endpoint}`;

  const { data } = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export default fetchDataBackend;
