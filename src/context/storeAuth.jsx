import { create } from "zustand";
import storeProfile from "./storeProfile";

const storeAuth = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,

  setAuth: ({ user, token }) => {
    if (!token) {
      console.error("Token requerido");
      return;
    }

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Limpiar storeAuth
    set({ user: null, token: null });

    // 🔹 Limpiar storeProfile también
    storeProfile.getState().clearProfile();
  }
}));

export default storeAuth;