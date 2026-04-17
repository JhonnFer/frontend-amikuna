//src/helpers/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

// 🚫 NO auto conectar
export const socket = io(SOCKET_URL, {
  autoConnect: false,
});

// DEBUG
socket.on("connect", () => {
  console.log("🟢 Socket conectado:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("🔴 Socket desconectado:", reason);
});

socket.on("connect_error", (err) => {
  console.error("❌ Error socket:", err.message);

});

socket.on("reconnect_attempt", () => {
  console.log("🔄 Reintentando conexión...");
});

socket.on("nuevo_chat", () => {
  console.log("💬 CHAT RECIBIDO EN FRONT");
});