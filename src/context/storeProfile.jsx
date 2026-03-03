// context/storeProfile.js
import { create } from "zustand";
import axios from "axios";
import getAuthHeaders from "../helpers/getAuthHeaders";
import { toast } from "react-toastify";


const baseUrl = (import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api").replace(/\/+$/, "");

const storeProfile = create((set) => ({
  user: null,

  loadProfile: async () => {
    try {
      const url = `${baseUrl}/estudiantes/perfil`;
      const res = await axios.get(url, getAuthHeaders());
      set({ user: res.data });
    } catch (error) {
      toast.error("No se pudo cargar el perfil");
    }
  },

  updateProfile: async (formData) => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}estudiantes/completarPerfil`;
      const res = await axios.put(url, formData, {
        ...getAuthHeaders(),
        headers: { ...getAuthHeaders().headers, "Content-Type": "multipart/form-data" }
      });
      set({ user: res.data.perfilActualizado });
      toast.success(res.data.msg);
    } catch (error) {
      toast.error("No se pudo actualizar el perfil");
    }
  },

  chatEstudiante: async (mensaje) => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}chat/estudiante`;
      const res = await axios.post(url, { mensaje }, getAuthHeaders());
      return res.data.respuesta;
    } catch (error) {
      toast.error("Error al consultar el chat IA");
      return null;
    }
  },

  obtenerPerfilCompleto: async () => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}estudiantes/perfil-completo`;
      const res = await axios.get(url, getAuthHeaders());
      return res.data;
    } catch (error) {
      toast.error("Error al obtener perfil completo");
      return null;
    }
  },

  listarPotencialesMatches: async () => {
    try {
      const url = `${baseUrl}/estudiantes/matches`;
      const res = await axios.get(url, getAuthHeaders());
      return res.data;
    } catch (error) {
      toast.error("Error al listar matches");
      return [];
    }
  },

  seguirUsuario: async (idSeguido) => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}estudiantes/seguir/${idSeguido}`;
      const res = await axios.post(url, {}, getAuthHeaders());
      toast.success(res.data.msg);
      return res.data.siguiendo;
    } catch (error) {
      toast.error("Error al seguir/dejar de seguir usuario");
      return null;
    }
  }
}));

export default storeProfile;
