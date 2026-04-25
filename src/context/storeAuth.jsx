import { create } from "zustand";
import storeProfile from "./storeProfile";
import fetchDataBackend from "../helpers/fetchDataBackend";
import { socket } from "../helpers/socket";
import tokenManager from "../helpers/tokenManager";

const storeAuth = create((set) => ({
  user: tokenManager.getUser() || null,
  token: tokenManager.getToken(),

  setAuth: ({ user, token }) => {
    if (!token) {
      console.error("Token requerido");
      return;
    }

    tokenManager.setToken(token, user);

    // 🔥 CONEXIÓN AQUÍ (CORRECTO)
    socket.auth = { token };
    socket.connect();

    set({ user, token });
  },

  logout: async () => {
    try {
      await fetchDataBackend("logout", null, "POST", {
        showSuccessToast: false,
      });
    } catch {
      // Si falla igual limpiamos local
    } finally {
      tokenManager.clearToken();
      socket.disconnect();
      set({ user: null, token: null });
      storeProfile.getState().clearProfile();
      await new Promise((r) => setTimeout(r, 1000));
      window.location.href = "/login";
    }
  },
}));

export default storeAuth;
