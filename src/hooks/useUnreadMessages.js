//src/hooks/useUnreadMessages.js
import { useState, useEffect, useCallback } from "react";
import { socket } from "../helpers/socket";

const useUnreadMessages = (miId) => {
  // { chatId: count } — cuántos mensajes no leídos por chat
  const [unreadCounts, setUnreadCounts] = useState({});

  // Incrementar contador cuando llega mensaje nuevo
  useEffect(() => {
    if (!miId) return;

    const handleNuevoMensaje = (data) => {
      const mensaje = data.mensaje;
      // Solo contar si el mensaje NO es mío
      if (mensaje?.emisor?._id?.toString() === miId?.toString()) return;

      const chatId = mensaje?.chat || data?.chatId;
      if (!chatId) return;

      setUnreadCounts((prev) => ({
        ...prev,
        [chatId]: (prev[chatId] || 0) + 1,
      }));
    };

    socket.on("mensaje:nuevo", handleNuevoMensaje);
    return () => socket.off("mensaje:nuevo", handleNuevoMensaje);
  }, [miId]);

  // Limpiar contador cuando se abre el chat
  const marcarLeido = useCallback((chatId) => {
    if (!chatId) return;
    setUnreadCounts((prev) => {
      const next = { ...prev };
      delete next[chatId];
      return next;
    });
  }, []);

  // Total de mensajes no leídos en todos los chats
  const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0);

  // Badge formateado: ≤9 → número, >9 → "+9"
  const formatBadge = (count) => (count > 9 ? "+9" : count);

  return { unreadCounts, marcarLeido, totalUnread, formatBadge };
};

export default useUnreadMessages;