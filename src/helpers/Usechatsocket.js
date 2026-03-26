import { useState, useCallback } from "react";
import useChat from "../hooks/useChat";
import useSocket from "../hooks/useSocket";

const useChatSocket = (profile) => {
  const [chatInfo, setChatInfo] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [chatIdsCache, setChatIdsCache] = useState({});

  const { abrirChat, obtenerMensajes, enviarMensaje: enviarMensajeApi } = useChat();

  // Reutiliza tu useSocket existente con token y eventos correctos
  const { isConnected } = useSocket(chatInfo?.chatId, (mensajeNuevo) => {
    setMensajes((prev) => [...prev, mensajeNuevo]);
  });

  const handleAbrirChat = useCallback(
    async (match) => {
      if (!profile?._id) return;

      const sortedIds = [profile._id, match._id].sort().join("-");
      let chatIdToUse = chatIdsCache[sortedIds];

      if (!chatIdToUse) {
        const respuesta = await abrirChat(match._id);
        if (!respuesta?.chatId) return;
        chatIdToUse = respuesta.chatId;
        setChatIdsCache((prev) => ({ ...prev, [sortedIds]: chatIdToUse }));
      }

      // Cargar mensajes del chat seleccionado
      const mensajesCargados = await obtenerMensajes(chatIdToUse);
      setMensajes(mensajesCargados);

      setChatInfo((prev) =>
        prev?.chatId === chatIdToUse
          ? prev
          : { chatId: chatIdToUse, nombre: match.nombre, imagenPerfil: match.imagenPerfil }
      );
    },
    [abrirChat, obtenerMensajes, chatIdsCache, profile]
  );

  const handleCerrarChat = useCallback(() => {
    setChatInfo(null);
    setMensajes([]);
  }, []);

  const handleEnviarMensaje = useCallback(
    async (contenido) => {
      if (!chatInfo?.chatId || !contenido) return;

      // Mensaje optimista mientras llega la respuesta
      const mensajeTemp = {
        emisor: {
          _id: profile._id,
          nombre: profile.nombre,
          imagenPerfil: profile.imagenPerfil,
        },
        contenido,
        createdAt: new Date(),
        _id: Date.now().toString(),
      };

      setMensajes((prev) => [...prev, mensajeTemp]);
      await enviarMensajeApi(chatInfo.chatId, contenido);
    },
    [enviarMensajeApi, chatInfo, profile]
  );

  return {
    chatInfo,
    mensajes,
    isConnected, // por si quieres mostrar indicador de conexión
    handleAbrirChat,
    handleCerrarChat,
    handleEnviarMensaje,
  };
};

export default useChatSocket;