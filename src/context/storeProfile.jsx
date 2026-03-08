import { create } from "zustand";
import axios from "axios";
import getAuthHeaders from "../helpers/getAuthHeaders";
import { toast } from "react-toastify";

const baseUrl = (import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api").replace(/\/+$/, "");

const storeProfile = create((set) => ({
  profile: null,

  loadProfile: async () => {
    try {
      const res = await axios.get(`${baseUrl}/estudiantes/perfil`, getAuthHeaders());

      set({
        profile: res.data
      });

      return res.data;

    } catch (error) {
      toast.error("No se pudo cargar el perfil");
      return null;
    }
  },

  updateProfile: async (formData) => {
    try {

      const res = await axios.put(
        `${baseUrl}/estudiantes/completarPerfil`,
        formData,
        {
          ...getAuthHeaders(),
          headers: {
            ...getAuthHeaders().headers,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      set({
        profile: res.data.perfilActualizado
      });

      toast.success(res.data.msg);

      return res.data.perfilActualizado;

    } catch (error) {
      toast.error("No se pudo actualizar el perfil");
      return null;
    }
  },

  listarPotencialesMatches: async () => {
    try {
      const res = await axios.get(`${baseUrl}/estudiantes/matches`, getAuthHeaders());
      return res.data;
    } catch (error) {
      toast.error("Error al listar matches");
      return [];
    }
  }
}));

export default storeProfile;