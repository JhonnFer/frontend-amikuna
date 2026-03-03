import React, { useState, useEffect, useCallback, useRef } from "react";
import useChat from "../../hooks/useChat";
import useSocket from "../../hooks/useSocket";
import { FaTimes } from "react-icons/fa";

const ChatConversacion = ({ chatInfo, miId, onCloseChat }) => {
  const { chatId } = chatInfo;
  const { obtenerMensajes } = useChat();
  const [mensajes, setMensajes] = useState([]);
  const [textoMensaje, setTextoMensaje] = useState("");
  const messagesEndRef = useRef(null);

  const handleNuevoMensaje = useCallback((payload) => {
    setMensajes((prevMensajes) => {
      const existe = prevMensajes.some(
        (m) =>
          m.createdAt === payload.createdAt && m.contenido === payload.contenido
      );
      if (existe) return prevMensajes;
      return [...prevMensajes, payload];
    });
  }, []);

  const { isConnected, emitMessage } = useSocket(chatId, handleNuevoMensaje);

  useEffect(() => {
    const fetchMensajes = async () => {
      if (chatId) {
        const mensajesObtenidos = await obtenerMensajes(chatId);
        console.log("Mensajes obtenidos:", mensajesObtenidos);
        if (mensajesObtenidos) {
          setMensajes(mensajesObtenidos);
        }
      }
    };
    fetchMensajes();
  }, [chatId, obtenerMensajes]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  const handleEnviarMensaje = (e) => {
    e.preventDefault();
    const contenido = textoMensaje.trim();
    if (!contenido || !isConnected) return;

    emitMessage({ chatId, contenido });

    setTextoMensaje("");
  };

  return (
    <div className="fixed bottom-4 right-[390px] w-96 h-[600px] bg-white/95 backdrop-blur-md shadow-2xl z-50 rounded-xl flex flex-col border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-3xl">
  {/* Header */}
  <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-red-900 text-white">
    <div className="flex items-center gap-3">
      <img
        src={chatInfo.imagenPerfil || "https://placehold.co/40x40"}
        alt={chatInfo.nombre}
        className="w-10 h-10 rounded-full border border-white shadow-sm"
      />
      <span className="font-semibold">{chatInfo.nombre}</span>
    </div>
    <button
      onClick={onCloseChat}
      className="text-white hover:text-gray-200 transition-colors"
    >
      <FaTimes size={20} />
    </button>
  </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mensajes.length > 0 ? (
          mensajes.map((mensaje, index) => {
            const emisorId =
              mensaje.emisor?._id?.toString() || mensaje.emisor?.toString();
            const esMensajeMio = emisorId === miId.toString();

            return (
              <div
                key={index}
                className={`flex ${esMensajeMio ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-xl ${
                    esMensajeMio ? "bg-red-900 text-white" : "bg-gray-200 text-black"
                  }`}
                >
                  <p>{mensaje.contenido}</p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500">
            {isConnected ? "Inicia una conversación..." : "Conectando al chat..."}
          </p>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={handleEnviarMensaje}
        className="p-4 border-t flex gap-2"
      >
        <input
          type="text"
          value={textoMensaje}
          onChange={(e) => setTextoMensaje(e.target.value)}
          placeholder="Escribe un mensaje..."
          disabled={!isConnected}
          className="flex-1 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
        <button
          type="submit"
          disabled={!isConnected || !textoMensaje.trim()}
          className="bg-gray-400 text-white px-4 rounded-full disabled:bg-red-900"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default ChatConversacion;
