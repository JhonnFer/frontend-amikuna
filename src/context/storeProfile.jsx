import { create } from "zustand";
import axios from "axios";
import getAuthHeaders from "../helpers/getAuthHeaders";

const baseUrl = (import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api").replace(/\/+$/, "");


const storeProfile = create((set, get) => ({
  
  
  profile: null,
  loading: false,
  loaded: false, //  NUEVO CONTROL para evitar fetchs repetidos

  loadProfile: async () => {
  const { loaded, loading } = get();
  
  
  try {
    set({ loading: true });
    const res = await axios.get(`${baseUrl}/estudiantes/perfil`, getAuthHeaders(true))
  
    
    set({ profile: res.data, loading: false, loaded: true })
  } catch (error) {
    console.error("❌ Error:", error.response?.status, error.response?.data)
    set({ loading: false, loaded: false })
    return null
  }


  // evita doble fetch si ya está en curso
  if (loaded) return get().profile;
  if (loading) return null; // 🔥 esto faltaba

  try {
    set({ loading: true });

    const res = await axios.get(
      `${baseUrl}/estudiantes/perfil`,
      getAuthHeaders(true)
    );

    set({
      profile: res.data,
      loading: false,
      loaded: true,
    });

    return res.data;

  } catch (error) {
    console.error("Error loading profile:", error);
    set({ loading: false, loaded: false }); // 🔥 reset loaded también
    return null;
  }
},
  

  refreshProfile: async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/estudiantes/perfil`,
        getAuthHeaders(true)
      );

      set({
        profile: res.data,
        loaded: true,
      });

      return res.data;
    } catch (error) {
      console.error("Error refreshing profile:", error);
      return null;
    }
  },

  updateProfile: async (formData) => {
    const res = await axios.put(
      `${baseUrl}/estudiantes/completarperfil`,
      formData,
      {
        headers: {
          ...getAuthHeaders(true).headers,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    set({
      profile: res.data.perfilActualizado,
      loaded: true,
    });

    return res.data.perfilActualizado;
  },
  

  clearProfile: () =>
    set({
      profile: null,
      loaded: false, // 🔥 importante reset
    }),
}));

export default storeProfile;