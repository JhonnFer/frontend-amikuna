import { useCallback,useEffect,useState } from "react";
import useFetch from "./useFetch";
import { socket } from "../helpers/socket";

const useChat = () => {
  const { fetchDataBackend } = useFetch();
  const [chats, setChats] = useState([]);

  const abrirChat = useCallback(
  async (idOtro) => {
    try {
      const chat = await fetchDataBackend(
        `estudiantes/chat-con-match/${idOtro}`,
        {},
        "POST"
      );

      // 🔥 agregar al estado
      setChats(prev => {
        const existe = prev.some(c => c._id === chat._id);
        if (existe) return prev;

        return [chat, ...prev];
      });

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
  useEffect(() => {
  const handleNuevoChat = (chat) => {
    //console.log("💬 Nuevo chat en tiempo real:", chat);

    setChats(prev => {
      const existe = prev.some(c => c._id === chat._id);
      if (existe) return prev;

      return [chat, ...prev];
    });
  };

  socket.on("nuevo_chat", handleNuevoChat);

  return () => {
    socket.off("nuevo_chat", handleNuevoChat);
  };
}, []);

  return { abrirChat,chats, obtenerMensajes, enviarMensaje }; // ✅
};

export default useChat;