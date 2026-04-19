import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaCalendarCheck, FaTimesCircle, FaClock } from "react-icons/fa";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import useEventos from "../../hooks/useEventos";
import Modal from "../Modals_Dashboards/modal";

// ── Modal: Mis Eventos ─────────────────────────────────────────────────────────
const ModalMisEventos = () => {
  const {
    misEventos,
    loadingMisEventos,
    errorMisEventos,
    obtenerMisEventos,
    rechazarAsistencia,
    cargandoAsistencia,
  } = useEventos({
    autoCargar: false,
    onAsistenciaSuccess: () => obtenerMisEventos(),
  });

  useEffect(() => {
    obtenerMisEventos();
  }, []);

  return (
        
        <div className="max-h-[60vh] overflow-y-auto scrollbar-eventos">
          {loadingMisEventos && (
            <p className="text-sm text-gray-400 animate-pulse text-center py-8">
              Cargando tus eventos...
            </p>
          )}

          {!loadingMisEventos && errorMisEventos && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
              {errorMisEventos}
            </div>
          )}

          {!loadingMisEventos &&
            !errorMisEventos &&
            misEventos.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 gap-2 text-gray-400">
                <FaClock size={32} opacity={0.3} />
                <p className="text-sm">
                  No tienes eventos confirmados próximamente.
                </p>
              </div>
            )}

          {!loadingMisEventos && misEventos.length > 0 && (
            <ul className="space-y-4 pb-2 ">
              {misEventos.map((evento) => {
                const fechaCompleta = new Date(
                  `${evento.fecha.split("T")[0]}T${evento.hora}`,
                );
                return (
                  <li
                    key={evento._id}
                    className="border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/*  Imagen del evento en el modal */}
                    {evento.imagen && (
                      <img
                        src={evento.imagen}
                        alt={evento.titulo}
                        className="w-full h-full  max-h-[25%] bg-contain bg-gradient-to-b from-orange-50 via-red-50 to-blue-100 bg-center object-contain bg-no-repeat aspect-video"
                      />
                    )}

                    <div className="p-4">
                      {/* Título */}
                      <h4 className="font-semibold text-rose-700 text-sm">
                        {evento.titulo}
                      </h4>

                      {/* Descripción */}
                      {evento.descripcion && (
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {evento.descripcion}
                        </p>
                      )}

                      {/* Fecha y lugar */}
                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                        {evento.fecha && (
                          <span>
                            📅{" "}
                            {fechaCompleta.toLocaleString("es-EC", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              timeZone: "America/Guayaquil",
                            })}
                          </span>
                        )}
                        {evento.lugar && <span>📍 {evento.lugar}</span>}
                      </div>

                      {/* Creador */}
                      {evento.creador && (
                        <p className="text-xs text-gray-400 mt-1">
                          Organizado por:{" "}
                          <span className="font-medium text-gray-600">
                            {evento.creador.nombre} {evento.creador.apellido}
                          </span>
                        </p>
                      )}

                      {/* Asistentes */}
                      {evento.asistentes?.length > 0 && (
                        <p className="text-xs text-gray-400 mt-1">
                          👥 {evento.asistentes.length} asistente
                          {evento.asistentes.length !== 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                    {/* Botón declinar */}
                    <button
                      onClick={() => rechazarAsistencia(evento._id)}
                      disabled={cargandoAsistencia}
                      className="mt-3 w-full text-xs px-3 py-1.5 rounded-lg border border-red-300 text-red-500 hover:bg-red-50 transition disabled:opacity-50"
                    >
                      {cargandoAsistencia
                        ? "Procesando..."
                        : "Declinar asistencia"}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

        </div>
     
);

};


ModalMisEventos.propTypes = {};

// ── Componente Principal ───────────────────────────────────────────────────────
const EventosPublicados = ({
  eventos,
  loading,
  onConfirmar,
  onRechazar,
  cargandoAsistencia,
  eventosRechazados = {},
  isExpanded,
  toggleExpand,
}) => {
  const [modalMisEventos, setModalMisEventos] = useState(false);

  if (loading) return <p>Cargando eventos...</p>;

  const eventosMostrados = eventos;
  const hayMasEventos = eventos.length > 2;

  return (
    <>
      <div className="p-4 bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Eventos Próximos</h2>

          <div className="flex items-center gap-2">
            {/* Botón mis eventos */}
            <button
              onClick={() => setModalMisEventos(true)}
              title="Ver mis eventos confirmados"
              className="flex  text-xs items-center bg-gradient-to-br from-pink-600 to-orange-400 text-white px-3 py-1 rounded-full  font-semibold hover:from-[#ED213A] hover:to-[#93291E]/90 transition"
            >
              <FaClock size={20} /> Mis Eventos
            </button>

            {/* Expandir / contraer */}
            {hayMasEventos && (
              <button
                onClick={toggleExpand}
                className="text-gray-500 hover:text-blue-600 transition-transform"
              >
                {isExpanded ? (
                  <FiChevronUp size={24} />
                ) : (
                  <FiChevronDown size={24} />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Lista */}
        <div
          className={`transition-all duration-300 ease-in-out scrollbar-eventos ${
            isExpanded
              ? "max-h-[600px] overflow-y-auto"
              : "max-h-[270px] overflow-y-auto"
          }`}
        >
          {eventosMostrados.length === 0 ? (
            <p>No hay eventos disponibles para mostrar.</p>
          ) : (
            <ul className="space-y-4 pb-2">
              {eventosMostrados.map((evento) => {
                const isRechazado = !!eventosRechazados[evento._id];
                const fechaCompleta = new Date(
                  `${evento.fecha.split("T")[0]}T${evento.hora}`,
                );
                return (
                  <li
                    key={evento._id}
                    className={`border-b pb-4 last:border-b-0 last:pb-0 ${
                      isRechazado ? "opacity-50" : ""
                    }`}
                  >
                    {/* ✅ Imagen del evento en la lista principal */}
                    {evento.imagen && (
                      <img
                        src={evento.imagen}
                        alt={evento.titulo}
                        className="relative w-full  bg-gradient-to-b from-red-500 via-orange-300 to-transparent bg-contain bg-no-repeat bg-center overflow-hidden shrink-0 object-contain h-full max-h-[25%] sm:max-h-[to-35%] aspect-video "
                      />
                    )}

                    <h3 className="font-semibold text-rose-800">
                      {evento.titulo}
                    </h3>
                    <p className="text-sm text-gray-700 ">
                      {evento.descripcion}
                    </p>

                    {/* Lugar */}
                    {evento.lugar && (
                      <p className="text-xs text-gray-500 mt-1">
                        📍 {evento.lugar}
                      </p>
                    )}

                    <div className="flex justify-center flex-col mt-2">
                      <span className="text-xs text-gray-500 ">
                        📅{" "}
                        {fechaCompleta.toLocaleString("es-EC", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          timeZone: "America/Guayaquil",
                        })}
                      </span>
                      <div className="flex gap-4 mt-2 justify-center">
                        <button
                          onClick={() => onConfirmar(evento._id)}
                          disabled={cargandoAsistencia || isRechazado}
                          className="relative flex gap-1 p-2 items-center font-semibold bg-gradient-to-br from-green-400 to-blue-500 text-white rounded-full hover:bg-green-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed z-10"
                          title="Confirmar asistencia"
                        >
                          <FaCalendarCheck />
                          <span>Unirme</span>
                        </button>
                        <button
                          onClick={() => onRechazar(evento._id)}
                          disabled={cargandoAsistencia || isRechazado}
                          className="relative flex gap-1 p-2 px-3 font-medium items-center bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-full hover:bg-red-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed z-10"
                          title="Rechazar asistencia"
                        >
                          <FaTimesCircle />
                          <span>Omitir</span>
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Modal mis eventos */}
      <Modal
        isOpen={modalMisEventos}
        onClose={() => setModalMisEventos(false)}
        title="Mis Próximos Eventos" 
        icon={<FaClock size={22} />}

      >
        
        <ModalMisEventos />
      </Modal>
    </>
  );
};

EventosPublicados.propTypes = {
  eventos: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  onConfirmar: PropTypes.func.isRequired,
  onRechazar: PropTypes.func.isRequired,
  cargandoAsistencia: PropTypes.bool.isRequired,
  eventosRechazados: PropTypes.object,
  isExpanded: PropTypes.bool.isRequired,
  toggleExpand: PropTypes.func.isRequired,
};

export default EventosPublicados;
