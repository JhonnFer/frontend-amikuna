import PropTypes from "prop-types";
import EventosPublicados from "./EventosPublicados";
import ChatbotEstudiante from "./ChatbotEstudiante";

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
  setMostrarChatbot
}) => {
  return (
    <aside className="hidden sm:flex md:flex-col w-full sm:w-64 md:w-72 lg:w-80 xl:w-[350px] bg-white p-4 shadow flex-shrink-0 h-screen">

      <div
        className="flex flex-col flex-1 min-h-0 overflow-y-auto scrollbar-hide"
        style={{ scrollBehavior: "smooth" }}
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

        <h2 className="text-gray-500 text-sm uppercase mb-2 mt-4">
          Matches con quien chatear!
        </h2>

        <ul>
          {matchesMutuos.length > 0 ? (
            matchesMutuos.map((match) => (
              <li
                key={match._id}
                onClick={() => handleAbrirChat(match)}
                className="cursor-pointer flex items-center gap-3 mb-3 hover:bg-gray-100 p-2 rounded"
              >
                <img
                  src={match.imagenPerfil || "https://placehold.co/40x40"}
                  alt={match.nombre}
                  className="w-10 h-10 rounded-full object-cover"
                />

                <span>{match.nombre}</span>
              </li>
            ))
          ) : (
            <li>No hay matches mutuos.</li>
          )}
        </ul>

      </div>

      {/* CHATBOT */}
      {mostrarChatbot && (
        <div className="h-1/2 bg-gray-100 shadow-lg rounded-xl p-4 flex flex-col">

          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Chat Bot 😎</h2>

            <button
              onClick={() => setMostrarChatbot(false)}
              className="text-red-500 font-bold text-xl"
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            <ChatbotEstudiante />
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
  setMostrarChatbot: PropTypes.func.isRequired
};

export default SidebarDerecho;

