// src/components/Dashboard_User/SidebarDerecho.jsx
import PropTypes from "prop-types";
import EventosPublicados from "./EventosPublicados";
import ChatbotEstudiante from "./ChatbotEstudiante";
import { useState } from "react";
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
  handleAbrirChat,
  mostrarChatbot,
  setMostrarChatbot,
}) => {

  const { historial = [], cargarHistorial, enviarMensaje, loading, respuesta } = useChatbot();
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  const toggleHistorial = async () => {
    setMostrarHistorial(!mostrarHistorial);

    if (!historial?.length) {
      await cargarHistorial();
    }
  };

  return (
    <aside
      className="
      hidden sm:flex flex-col
      w-full sm:w-60 md:w-72 lg:w-80 xl:w-[350px]
      bg-white
      p-2 sm:p-3 md:p-4
      shadow
      flex-shrink-0
      h-screen
      "
    >
      {/* CONTENIDO SUPERIOR */}
      <div
        className="
        flex flex-col
        flex-1
        min-h-0
        overflow-y-auto
        scrollbar-hide
        text-xs sm:text-sm md:text-base
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

        <h2 className="text-gray-500 uppercase mt-4 mb-2 text-xs sm:text-sm">
          Matches con quien chatear!
        </h2>

        <ul>
          {matchesMutuos?.length > 0 ? (
            matchesMutuos.map((match) => (
              <li
                key={match._id}
                onClick={() => handleAbrirChat(match)}
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
                <img
                  src={match.imagenPerfil || "https://placehold.co/40x40"}
                  alt={match.nombre}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                />

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
  <div className="h-1/2 bg-gray-100 shadow-lg rounded-xl p-2 sm:p-3 md:p-4 flex flex-col">

    {/* HEADER */}
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center gap-2">
        <button
          onClick={toggleHistorial}
          className="text-gray-600 hover:text-black"
        >
          <FiMenu size={18} />
        </button>
        <h2 className="font-semibold text-sm sm:text-base">Chat Bot 😎</h2>
      </div>
      <button
        onClick={() => setMostrarChatbot(false)}
        className="text-red-500 font-bold text-lg"
      >
        ×
      </button>
    </div>

    {/* HISTORIAL — se abre con la hamburguesa */}
    {mostrarHistorial && (
      <div className="bg-white border rounded-lg p-2 sm:p-3 mb-2 max-h-32 sm:max-h-40 overflow-y-auto text-xs sm:text-sm shadow">
        {historial?.length === 0 ? (
          <p className="text-gray-400">Sin conversaciones</p>
        ) : (
          historial.map((item, i) => (
            <div key={i} className="mb-2">
              <p className="text-blue-600 break-words">
                <b>{item.rol === "usuario" ? "Tú" : "Bot"}:</b>{" "}
                {item.contenido}
              </p>
            </div>
          ))
        )}
      </div>
    )}

    {/* CHAT — solo última respuesta + input */}
    <div className="flex-1 overflow-hidden">
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
  handleAbrirChat: PropTypes.func.isRequired,
  mostrarChatbot: PropTypes.bool.isRequired,
  setMostrarChatbot: PropTypes.func.isRequired,
};

export default SidebarDerecho;