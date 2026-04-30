// src/components/Dashboard_User/SidebarDerecho.jsx
import PropTypes from "prop-types";
import EventosPublicados from "./EventosPublicados";
import { useEffect } from "react";
import useBotpressChat from "../../hooks/useBotpressChat";
import ChatbotWidget from "./ChatbotWidget";

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
  useBotpressChat();

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && setMostrarChatbot(false);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setMostrarChatbot]);

  return (
    <>
      <aside
        className="
        hidden sm:flex flex-col
        w-full sm:w-60 md:w-72 lg:w-80 xl:w-[350px]
        bg-gradient-to-t from-red-200 via-orange-100 to-orange-200
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

        {/* MATCHES */}
        <div
          className="
          flex flex-col flex-1 min-h-0
          text-xs sm:text-sm md:text-base
          overflow-y-auto scrollbar-sidebar
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
                  className="cursor-pointer flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 hover:bg-gray-100 p-2 rounded"
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={match.imagenPerfil || "https://placehold.co/40x40"}
                      alt={match.nombre}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                    />
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
      </aside>

      {/* MODAL CHATBOT */}
      <div
        style={{ display: mostrarChatbot ? "flex" : "none" }}
        className="fixed inset-0 z-50 items-end justify-end p-4 pointer-events-none"
      >
        <div className="pointer-events-auto w-[380px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          <div className="flex justify-between items-center px-4 py-3 border-b bg-gradient-to-r from-red-400 to-orange-400 flex-shrink-0">
            <h2 className="font-bold text-white text-sm tracking-wide">
              🤖 Asistente Amikuna
            </h2>
            <button
              onClick={() => setMostrarChatbot(false)}
              className="text-white hover:text-red-200 text-lg transition"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <ChatbotWidget isOpen={mostrarChatbot} />
          </div>
        </div>
      </div>
    </>  
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