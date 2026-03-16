import axios from "axios";
import storeAuth from "../context/storeAuth";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const fetchDataBackend = async (endpoint, token) => {

  const url = `${API_URL}${endpoint.startsWith("/") ? endpoint.slice(1) : endpoint}`;

  try {

    const { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;

  } catch (error) {

    if (error.response?.status === 401) {

      const logout = storeAuth.getState().logout;
      logout();

      window.location.href = "/login";
    }

    throw error;
  }
};

export default fetchDataBackend;