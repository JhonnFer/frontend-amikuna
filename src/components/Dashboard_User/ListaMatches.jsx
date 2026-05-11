import { useState, useCallback } from "react";
import useMatches from "../hooks/useMatches";
import useChat from "../hooks/useChat";
import ChatConversacion from "./ChatConversacion";
import ChatIconWithBadge from "../UI/ChatIconWithBadge";
import storeUnread from "./ListaChats/store/storeUnread";
import { useShallow } from "zustand/react/shallow";

const ListaMatches = ({ miId }) => {
  const { matches, loading } = useMatches();
  const { abrirChat, obtenerMensajes, enviarMensaje } = useChat();

  // se consume el store global
  const { unreadCounts, userChatMap, marcarLeido, agregarChatMap } =
    storeUnread(
      useShallow((state) => ({
        unreadCounts: state.unreadCounts,
        userChatMap: state.userChatMap,
        marcarLeido: state.marcarLeido,
        agregarChatMap: state.agregarChatMap,
      })),
    );

  const [chatInfo, setChatInfo] = useState(null);
  const [mensajes, setMensajes] = useState([]);

  const handleAbrirChat = async (match) => {
     console.log("MATCH COMPLETO:", match); 
    const chat = await abrirChat(match._id);
    if (!chat?._id) return;
    agregarChatMap(match._id, chat._id);
    setChatInfo({
      chatId: chat._id,
      nombre: match.nombre,
      imagenPerfil: match.imagenPerfil,
      biografia: match.biografia,
      genero: match.genero,
      orientacion: match.orientacion,
      intereses: match.intereses,
      ubicacion: match.ubicacion,
      seguidores: match.seguidores,
      siguiendo: match.siguiendo,
      imagenesGaleria: match.imagenesGaleria,
    });

    const msgs = await obtenerMensajes(chat._id);
    setMensajes(msgs);

    marcarLeido(chat._id);
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

      await enviarMensaje(chatInfo.chatId, contenido);
    },
    [chatInfo, enviarMensaje, miId],
  );

  if (loading) return <p>Cargando matches...</p>;
  if (matches.length === 0) return <p>No hay matches disponibles</p>;

  return (
    <>
      <ul>
        {matches.map((match) => {
          //  Buscar chatId real desde el map o desde los datos del match
          const chatId = userChatMap[match._id] || match.chatId;
          const count = chatId ? unreadCounts[chatId] || 0 : 0;
          console.log(
            "match:",
            match.nombre,
            "chatId:",
            chatId,
            "count:",
            count,
          );

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
                  count={count}
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
