import { create } from "zustand";
import storeProfile from "./storeProfile";
import fetchDataBackend from "../helpers/fetchDataBackend";
import { socket } from "../helpers/socket";

const getValidToken = () => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    if (payload.exp * 1000 < Date.now()) {
      localStorage.clear();
      return null;
    }

    // 🔥 SOLO conectar si NO está conectado
    if (!socket.connected) {
      socket.auth = { token };
      socket.connect();
      
    }

    return token;

  } catch {
    localStorage.clear();
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

  // 🔥 CONEXIÓN AQUÍ (CORRECTO)
  socket.auth = { token };
  socket.connect();

  set({ user, token });
},

  logout: async () => {
  try {
    await fetchDataBackend("api/logout", null, "POST", false);
  } catch {
    // Si falla igual limpiamos local
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    socket.disconnect();
    set({ user: null, token: null });
    storeProfile.getState().clearProfile();
  }
}

}));

export default storeAuth;