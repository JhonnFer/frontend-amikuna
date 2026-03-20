import { useCallback } from "react";
import useFetch from "./useFetch";

const useChat = () => {
  const { fetchDataBackend } = useFetch();

  const abrirChat = useCallback(
    async (idOtro) => {
      try {
        const chat = await fetchDataBackend(
          `estudiantes/chat-con-match/${idOtro}`,
          {},
          "POST"
        );
        return chat;
      } catch (err) {
        console.error("Error al abrir chat:", err);
        return null;
      }
    },
    [fetchDataBackend]
  );

  const obtenerMensajes = useCallback(
    async (chatId) => {
      if (!chatId) return [];
      try {
        const respuesta = await fetchDataBackend(
          `estudiantes/chats/${chatId}/ver-mensajes`,
          {},
          "GET"
        );
        return respuesta || [];
      } catch (err) {
        console.error("Error al obtener mensajes:", err);
        return [];
      }
    },
    [fetchDataBackend]
  );

  // ✅ Nuevo
  const enviarMensaje = useCallback(
  async (chatId, contenido) => {
    try {
      const res = await fetchDataBackend(
        `estudiantes/chats/${chatId}/mensajes`, // ✅ correcto
        { contenido },
        "POST"
      );
      return res;
    } catch (err) {
      console.error("Error al enviar mensaje:", err);
      return null;
    }
  },
  [fetchDataBackend]
);

  return { abrirChat, obtenerMensajes, enviarMensaje }; // ✅
};

export default useChat;