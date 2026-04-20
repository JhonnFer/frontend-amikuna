// src/components/Dashboard_User/SidebarDerecho.jsx
import PropTypes from "prop-types";
import EventosPublicados from "./EventosPublicados";
import ChatbotEstudiante from "./ChatbotEstudiante";
import { useState, useEffect } from "react";
import { FiMenu } from "react-icons/fi";
import useChatbot from "../../hooks/useChatbot";

const SidebarDerecho = ({
  eventosDisponibles,
  loadingEventos,
  confirmarAsistencia,
  rechazarAsistencia,
  cargandoAsistencia,
  eventosExpandidos,
  setEventosExpandidos,
  matchesMutuos,
  mostrarChatbot,
  setMostrarChatbot,
  unreadCounts,
  formatBadge,
  handleAbrirChatConLeido,
}) => {
  const {
    historial = [],
    cargarHistorial,
    enviarMensaje,
    loading,
    respuesta,
  } = useChatbot();

  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  const toggleHistorial = async () => {
    setMostrarHistorial(!mostrarHistorial);

    if (!historial?.length) {
      await cargarHistorial();
    }
  };

  useEffect(() => {}, [matchesMutuos]);

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && setMostrarChatbot(false);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <aside
      className="
      hidden sm:flex flex-col
      w-full sm:w-60 md:w-72 lg:w-80 xl:w-[350px]
      bg-gradient-to-t from-red-200 via-orange-100  to-orange-200
      p-2 sm:p-3 md:p-4
      flex-shrink-0
      h-screen
      border border-gray-400 rounded-2xl 
      "
    >
      <EventosPublicados
        eventos={eventosDisponibles}
        loading={loadingEventos}
        onConfirmar={confirmarAsistencia}
        onRechazar={rechazarAsistencia}
        cargandoAsistencia={cargandoAsistencia}
        isExpanded={eventosExpandidos}
        toggleExpand={() => setEventosExpandidos(!eventosExpandidos)}
      />
      {/* CONTENIDO SUPERIOR */}
      <div
        className="
        flex flex-col
        flex-1
        min-h-0
        text-xs sm:text-sm md:text-base
        overflow-y-auto
        scrollbar-sidebar
        "
      >
        <h2 className="text-gray-500 uppercase mt-4 mb-2 text-xs sm:text-sm">
          Matches con quien chatear!
        </h2>

        <ul>
          {matchesMutuos?.length > 0 ? (
            matchesMutuos.map((match) => (
              <li
                key={match._id}
                onClick={() => handleAbrirChatConLeido(match)}
                className="
                cursor-pointer
                flex items-center
                gap-2 sm:gap-3
                mb-2 sm:mb-3
                hover:bg-gray-100
                p-2
                rounded
                
                "
              >
                <div className="relative flex-shrink-0">
                <img
                  src={match.imagenPerfil || "https://placehold.co/40x40"}
                  alt={match.nombre}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                />
                {/* Badge de no leídos */}
                {unreadCounts[match.chatId] > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {formatBadge(unreadCounts[match.chatId])}
                  </span>
                )}
                </div>
                

                <span className="truncate">{match.nombre}</span>
              </li>
            ))
          ) : (
            <li className="text-gray-400 text-xs sm:text-sm">
              No hay matches mutuos.
            </li>
          )}
        </ul>
      </div>

      {/* CHATBOT */}
      {mostrarChatbot && (
        <div className="h-1/2 bg-gradient-to-br from-red-100 via-orange-50 to-orange-100 border border-gray-200 shadow-2xl rounded-2xl flex flex-col overflow-hidden">
          {/* HEADER */}
          <div className="flex justify-between items-center px-3 py-2 border-b bg-white/40 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleHistorial}
                className="text-gray-600 hover:text-black transition"
              >
                <FiMenu size={18} />
              </button>

              <h2 className="font-bold text-sm sm:text-base text-[#B5651D] tracking-wide">
                Chat Bot 😎
              </h2>
            </div>

            <button
              onClick={() => setMostrarChatbot(false)}
              className="text-gray-400 hover:text-red-500 text-lg transition"
            >
              ✕
            </button>
          </div>

          {/* HISTORIAL */}
          {mostrarHistorial && (
            <div className="bg-white/70 border-b px-3 py-2 max-h-32 sm:max-h-40 overflow-y-auto text-xs sm:text-sm shadow-inner scrollbar-eventos">
              {historial?.length === 0 ? (
                <p className="text-gray-400 text-center">Sin conversaciones</p>
              ) : (
                historial.map((item, i) => (
                  <div key={i} className="mb-2">
                    <p className="break-words">
                      <span className="font-semibold text-blue-600">
                        {item.rol === "usuario" ? "Tú" : "Bot"}:
                      </span>{" "}
                      <span className="text-gray-700">{item.contenido}</span>
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* CHATBot */}
          <div className="flex-1 overflow-hidden px-2 pb-2">
            <ChatbotEstudiante
              enviarMensaje={enviarMensaje}
              loading={loading}
              respuesta={respuesta}
            />
          </div>
        </div>
      )}
    </aside>
  );
};

SidebarDerecho.propTypes = {
  eventosDisponibles: PropTypes.array.isRequired,
  loadingEventos: PropTypes.bool.isRequired,
  confirmarAsistencia: PropTypes.func.isRequired,
  rechazarAsistencia: PropTypes.func.isRequired,
  cargandoAsistencia: PropTypes.bool.isRequired,
  eventosExpandidos: PropTypes.bool.isRequired,
  setEventosExpandidos: PropTypes.func.isRequired,
  matchesMutuos: PropTypes.array.isRequired,
  mostrarChatbot: PropTypes.bool.isRequired,
  setMostrarChatbot: PropTypes.func.isRequired,
  unreadCounts: PropTypes.object.isRequired,
  formatBadge: PropTypes.func.isRequired,
  handleAbrirChatConLeido: PropTypes.func.isRequired,
};

export default SidebarDerecho;
