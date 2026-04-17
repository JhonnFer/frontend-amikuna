import { useEffect, useState } from "react";
import { socket } from "../helpers/socket"; // ✅ usamos el global

const useSocket = (chatId, onNuevoMensaje) => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    if (!chatId) return;

    // 🔌 conexión (solo escucha estado)
    const handleConnect = () => {
      setIsConnected(true);

      console.log("🟢 Conectado al socket");

      // 🔥 unirse al chat
      socket.emit("join:chat", chatId);
    };

    const handleDisconnect = (reason) => {
      console.log("🔴 Socket desconectado:", reason);
      setIsConnected(false);
    };

    const handleNuevoMensaje = (data) => {
      onNuevoMensaje(data.mensaje);
    };

    // listeners
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("mensaje:nuevo", handleNuevoMensaje);

    // 🔥 SI YA estaba conectado antes
    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("mensaje:nuevo", handleNuevoMensaje);
    };
  }, [chatId, onNuevoMensaje]);

  // emitir mensaje
  const emitMessage = (payload) => {
    if (socket.connected) {
      socket.emit("chat:mensaje", payload);
    } else {
      console.warn("⚠️ Socket no conectado");
    }
  };

  return { isConnected, emitMessage };
};

export default useSocket;