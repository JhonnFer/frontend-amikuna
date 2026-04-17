// src/context/storeProfile.jsx
import { create } from "zustand";
import fetchDataBackend from "../helpers/fetchDataBackend";

const storeProfile = create((set, get) => ({

  profile: null,
  loading: false,
  loaded: false,
  authError: false,

  loadProfile: async () => {
    const { loaded, loading } = get();
    if (loaded) return get().profile;
    if (loading) return null;

    try {
      set({ loading: true });
      const data = await fetchDataBackend("estudiantes/perfil", null, "GET", false);
      set({ profile: data, loading: false, loaded: true });
      return data;
    } catch (error) {
      set({ loading: false, loaded: false, authError: true }); // ← marcar error
      return null;
    }
  },

  refreshProfile: async () => {
    try {
      const data = await fetchDataBackend("estudiantes/perfil", null, "GET", false);
      set({ profile: data, loaded: true });
      return data;
    } catch (error) {
      return null;
    }
  },

 updateProfile: async (formData) => {
  const data = await fetchDataBackend("estudiantes/completarperfil", formData, "PUT", false);
  set({ profile: data.perfilActualizado, loaded: true });
  return data.perfilActualizado;
},

  clearProfile: () =>
    set({
      profile: null,
      loaded: false,
    }),
}));

export default storeProfile;