import { create } from "zustand";
import storeProfile from "./storeProfile";

const getValidToken = () => {

  const token = localStorage.getItem("token");

  if (!token) return null;

  try {

    const payload = JSON.parse(atob(token.split(".")[1]));

    if (payload.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return null;
    }

    return token;

  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return null;
  }
};

const storeAuth = create((set) => ({

  user: JSON.parse(localStorage.getItem("user")) || null,
  token: getValidToken(),

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

    set({ user: null, token: null });

    storeProfile.getState().clearProfile();
  }

}));

export default storeAuth;