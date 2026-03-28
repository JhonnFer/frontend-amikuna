// src/components/Dashboard_User/ChatConversacion.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import useChat from "../../hooks/useChat";
import useSocket from "../../hooks/useSocket";
import useStrike from "../../hooks/useStrike";
import { FaTimes, FaFlag } from "react-icons/fa";

// --- Panel de Denuncia ---
const PanelDenuncia = ({ onCerrar, onEnviar, enviando }) => {
  const [razon, setRazon] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (razon.trim().length < 5) return;
    await onEnviar({ razon });

    PanelDenuncia.propTypes = {
      onCerrar: PropTypes.func.isRequired,
      onEnviar: PropTypes.func.isRequired,
      enviando: PropTypes.bool.isRequired,
    };
  };

  return (
    <>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10" onClick={onCerrar} />

      {/* Panel deslizable desde abajo */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl z-20 p-5 space-y-4 shadow-2xl animate-slide-up">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold text-gray-800">
            Reportar conversación
          </h3>
          <button
            onClick={onCerrar}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <FaTimes size={16} />
          </button>
        </div>

        <p className="text-xs text-gray-500">
          Tu reporte será revisado por el equipo de soporte. La otra persona no
          sabrá que la reportaste.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            rows={4}
            value={razon}
            onChange={(e) => setRazon(e.target.value)}
            placeholder="Describe el motivo del reporte (mínimo 5 caracteres)..."
            className="w-full p-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-300 bg-gray-50"
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCerrar}
              className="flex-1 py-2 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={razon.trim().length < 5 || enviando}
              className="flex-1 py-2 rounded-xl bg-red-900 text-white text-sm font-semibold hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {enviando ? "Enviando..." : "Enviar reporte"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

// --- Componente Principal ---
const ChatConversacion = ({ chatInfo, miId, onCloseChat }) => {
  const { chatId } = chatInfo;
  const { obtenerMensajes, enviarMensaje } = useChat();
  const { reportarUsuarioChat } = useStrike();
  const [mensajes, setMensajes] = useState([]);
  const [textoMensaje, setTextoMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mostrarDenuncia, setMostrarDenuncia] = useState(false);
  const [enviandoDenuncia, setEnviandoDenuncia] = useState(false);
  const [exitoDenuncia, setExitoDenuncia] = useState(false);
  const messagesEndRef = useRef(null);

  const handleNuevoMensaje = useCallback((mensaje) => {
    if (!mensaje) return;
    setMensajes((prevMensajes) => {
      const existe = prevMensajes.some(
        (m) =>
          m.createdAt === mensaje.createdAt &&
          m.contenido === mensaje.contenido,
      );
      if (existe) return prevMensajes;
      return [...prevMensajes, mensaje];
    });
  }, []);

  const { isConnected } = useSocket(chatId, handleNuevoMensaje);

  useEffect(() => {
    const fetchMensajes = async () => {
      if (chatId) {
        const mensajesObtenidos = await obtenerMensajes(chatId);
        if (mensajesObtenidos) setMensajes(mensajesObtenidos);
      }
    };
    fetchMensajes();
  }, [chatId, obtenerMensajes]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  const handleEnviarMensaje = async (e) => {
    e.preventDefault();
    const contenido = textoMensaje.trim();
    if (!contenido || !isConnected || enviando) return;
    setEnviando(true);
    setTextoMensaje("");
    await enviarMensaje(chatId, contenido);
    setEnviando(false);
  };

  const handleEnviarDenuncia = async (datos) => {
    setEnviandoDenuncia(true);
    try {
      await reportarUsuarioChat(chatId, datos);
      setMostrarDenuncia(false);

      // ✅ Muestra mensaje de éxito 1.5s antes de cerrar
      setExitoDenuncia(true);
      setTimeout(() => {
        setExitoDenuncia(false);
        onCloseChat();
      }, 3500);
    } catch (error) {
      console.error("Error al enviar denuncia:", error);
    } finally {
      setEnviandoDenuncia(false);
    }
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

        <div className="flex items-center gap-3">
          {/* ✅ Botón reportar */}
          <button
            onClick={() => setMostrarDenuncia(true)}
            title="Reportar usuario"
            className="text-white/70 hover:text-white transition"
          >
            <FaFlag size={16} />
          </button>
          <button
            onClick={onCloseChat}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
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
                  className={`max-w-[70%] p-3 rounded-xl ${esMensajeMio ? "bg-red-900 text-white" : "bg-gray-200 text-black"}`}
                >
                  <p>{mensaje.contenido}</p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500">
            {isConnected
              ? "Inicia una conversación..."
              : "Conectando al chat..."}
          </p>
        )}

        <div ref={messagesEndRef} />

        
      </div>

      {/* Input */}
      <form onSubmit={handleEnviarMensaje} className="p-4 border-t flex gap-2">
        <input
          type="text"
          value={textoMensaje}
          onChange={(e) => setTextoMensaje(e.target.value)}
          placeholder="Escribe un mensaje..."
          disabled={!isConnected || enviando}
          className="flex-1 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
        <button
          type="submit"
          disabled={!isConnected || !textoMensaje.trim() || enviando}
          className="bg-gray-400 text-white px-4 rounded-full disabled:bg-red-900"
        >
          {enviando ? "..." : "Enviar"}
        </button>
      </form>


      {/* ✅ Mensaje de éxito denuncia */}
        {exitoDenuncia && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center px-4">
            <p className="bg-gradient-to-r from-pink-500 to-orange-400 text-white text-xs px-4 py-2 rounded-full shadow-sm font-serif">
              Reporte enviado. Gracias por ayudarnos a mejorar la comunidad.
            </p>
          </div>
        )}
        
        {/* ✅ Panel denuncia */}
        {mostrarDenuncia && (
          <PanelDenuncia
            onCerrar={() => setMostrarDenuncia(false)}
            onEnviar={handleEnviarDenuncia}
            enviando={enviandoDenuncia}
          />
        )}
    </div>

    
  );
};

ChatConversacion.propTypes = {
  chatInfo: PropTypes.shape({
    chatId: PropTypes.string.isRequired,
    nombre: PropTypes.string.isRequired,
    imagenPerfil: PropTypes.string,
  }).isRequired,
  miId: PropTypes.string.isRequired,
  onCloseChat: PropTypes.func.isRequired,
};

export default ChatConversacion;
