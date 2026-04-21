import { useEffect, useState } from "react";
import { socket } from "../helpers/socket";

const useSocket = (chatId, onNuevoMensaje, onMatchEliminado) => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  // 🔵 Effect GLOBAL → siempre escucha match eliminado
  useEffect(() => {
    const handleMatchEliminado = (data) => {
      onMatchEliminado?.(data);
    };

    socket.on("match_eliminado", handleMatchEliminado);

    return () => {
      socket.off("match_eliminado", handleMatchEliminado);
    };
  }, [onMatchEliminado]);

  // 🟢 Effect del chat → depende de chatId
  useEffect(() => {
    if (!chatId) return;

    const handleConnect = () => {
      setIsConnected(true);
      socket.emit("join:chat", chatId);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleNuevoMensaje = (data) => {
      onNuevoMensaje(data.mensaje);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("mensaje:nuevo", handleNuevoMensaje);

    if (socket.connected) handleConnect();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("mensaje:nuevo", handleNuevoMensaje);
    };
  }, [chatId, onNuevoMensaje]);

  const emitMessage = (payload) => {
    if (socket.connected) socket.emit("chat:mensaje", payload);
  };

  return { isConnected, emitMessage };
};

export default useSocket;