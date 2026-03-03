import React, { useState, useEffect, useCallback } from "react";
import useMatches from "../hooks/useMatches";
import useChat from "../hooks/useChat";
import ChatConversacion from "./ChatConversacion";
import ChatIconWithBadge from "../UI/ChatIconWithBadge";

const ListaMatches = ({ miId }) => {
  const { matches, loading } = useMatches();
  const {
    abrirChat,
    obtenerMensajes,
    enviarMensaje,
    subscribeToNewMessages,
    chatIdActivo,
  } = useChat();

  const [chatInfo, setChatInfo] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});

  const handleAbrirChat = async (match) => {
    const chat = await abrirChat(match._id);
    if (chat && chat._id) {
      setChatInfo({
        chatId: chat._id,
        nombre: match.nombre,
        imagenPerfil: match.imagenPerfil,
      });

      const msgs = await obtenerMensajes(chat._id);
      setMensajes(msgs);

      setUnreadCounts((prev) => ({ ...prev, [chat._id]: 0 }));
    }
  };

  const handleEnviarMensaje = useCallback(
    async (contenido) => {
      if (!chatInfo?.chatId || !contenido) return;

      const nuevoMensajeTemp = {
        emisor: { _id: miId },
        contenido,
        createdAt: new Date(),
        _id: Date.now().toString(),
      };

      setMensajes((prev) => [...prev, nuevoMensajeTemp]);

      const mensajeGuardado = await enviarMensaje(chatInfo.chatId, contenido);

      if (mensajeGuardado) {
        setMensajes((prev) =>
          prev.map((m) => (m._id === nuevoMensajeTemp._id ? mensajeGuardado : m))
        );
      }
    },
    [chatInfo, enviarMensaje, miId]
  );

  useEffect(() => {
    // Suscribirse a mensajes nuevos y actualizar unreadCounts y mensajes
    const unsubscribe = subscribeToNewMessages(({ chatId, ...mensaje }) => {
      if (chatIdActivo === chatId) {
        setMensajes((prev) => [...prev, mensaje]);
      } else {
        setUnreadCounts((prev) => ({
          ...prev,
          [chatId]: (prev[chatId] || 0) + 1,
        }));
      }
    });

    return () => unsubscribe();
  }, [subscribeToNewMessages, chatIdActivo]);

  if (loading) return <p>Cargando matches...</p>;
  if (matches.length === 0) return <p>No hay matches disponibles</p>;

  return (
    <>
      <ul>
        {matches.map((match) => {
          // Suponiendo que tienes un map para relacionar user <-> chatId
          const chatId = chatIdActivo === match._id ? chatIdActivo : null;

          return (
            <li
              key={match._id}
              onClick={() => handleAbrirChat(match)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
              }}
            >
              <img src={match.imagenPerfil} alt={match.nombre} width={50} />
              <span>{match.nombre}</span>

              {chatId && (
                <ChatIconWithBadge
                  count={unreadCounts[chatId] || 0}
                  onClick={() => handleAbrirChat(match)}
                />
              )}
            </li>
          );
        })}
      </ul>

      {chatInfo && (
        <ChatConversacion
          chatInfo={chatInfo}
          miId={miId}
          mensajes={mensajes}
          onCloseChat={() => setChatInfo(null)}
          onEnviarMensaje={handleEnviarMensaje}
        />
      )}
    </>
  );
};

export default ListaMatches;
