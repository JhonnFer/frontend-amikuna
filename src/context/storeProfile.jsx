// src/context/storeProfile.jsx
import { create } from "zustand";
import fetchDataBackend from "../helpers/fetchDataBackend";
import { socket } from "../helpers/socket";
import tokenManager from "../helpers/tokenManager";

export const isPerfilCompleto = (perfil) => {
  if (!perfil) return false;
  return (
    !!perfil.imagenPerfil &&
    perfil.genero && perfil.genero !== "otro" &&
    !!perfil.biografia?.trim() &&
    Array.isArray(perfil.intereses) && perfil.intereses.length > 0 &&
    !!perfil.ubicacion?.ciudad && !!perfil.ubicacion?.pais
  );
};

const storeProfile = create((set, get) => ({

  profile: null,
  loading: false,
  loaded: false,
  authError: false,

  loadProfile: async () => {
    const { loaded, loading } = get();
    if (loaded) return get().profile;
    if (loading) return null;

    const token = tokenManager.getToken();
    if (!token) return null;

    set({ loading: true, authError: false }); 

        try {
      const data = await fetchDataBackend("estudiantes/perfil", null, "GET", {
        showErrorToast: false,
      });
      set({ profile: data, loading: false, loaded: true });
      return data;
    } catch (error) {
      set({ loading: false, loaded: false, authError: true });
      return null;
    }
  },

    refreshProfile: async () => {
    try {
      const data = await fetchDataBackend("estudiantes/perfil", null, "GET", {
        showErrorToast: false,
      });
      set({ profile: data, loaded: true });
      return data;
    } catch (error) {
      return null;
    }
  },


  updateProfile: async (formData) => {
  const data = await fetchDataBackend(
    "estudiantes/completarPerfil",
    formData,
    "PUT",
    { showSuccessToast: false, showErrorToast: false }
  );

  const perfilActualizado = data.perfilActualizado || data;

  set({ profile: perfilActualizado, loaded: true });

  return perfilActualizado;
},

  clearProfile: () =>
    set({
      profile: null,
      loaded: false,
      authError: false
    }),

  initSocket: () => {
    const handleCambioPerfil = () => {
    get().refreshProfile();
  };

  socket.off("perfil_cambio");
  
  socket.on("perfil_cambio", handleCambioPerfil);
  

    return () => {
      socket.off("perfil_cambio", handleCambioPerfil); // cleanup

    };
  }

}));

export default storeProfile;