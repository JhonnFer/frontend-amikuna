// src/components/Dashboard_User/EventosPublicados.jsx
import { useState } from "react";
import PropTypes from "prop-types";
import { FaCalendarCheck, FaTimesCircle, FaClock } from "react-icons/fa";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import useEventos from "../../hooks/UseEventos";

// ── Modal: Mis Eventos ─────────────────────────────────────────────────────────
const ModalMisEventos = ({ onClose }) => {
  const { misEventos, loadingMisEventos, errorMisEventos, obtenerMisEventos } = useEventos({
    autoCargar: false, // los eventos públicos no se necesitan aquí
  });

  // Carga al montar el modal
  useState(() => {
    obtenerMisEventos();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center border-b px-5 py-4 shrink-0">
          <div className="flex items-center gap-2">
            <FaClock className="text-rose-500" size={18} />
            <h3 className="text-lg font-bold text-gray-800">Mis Próximos Eventos</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold leading-none"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 py-4">

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

          {!loadingMisEventos && !errorMisEventos && misEventos.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
              <FaClock size={32} className="opacity-30" />
              <p className="text-sm">No tienes eventos confirmados próximamente.</p>
            </div>
          )}

          {!loadingMisEventos && misEventos.length > 0 && (
            <ul className="space-y-3">
              {misEventos.map((evento) => (
                <li
                  key={evento._id}
                  className="border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Título */}
                  <h4 className="font-semibold text-rose-700 text-sm">{evento.titulo}</h4>

                  {/* Descripción */}
                  {evento.descripcion && (
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{evento.descripcion}</p>
                  )}

                  {/* Fecha y lugar */}
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                    {evento.fecha && (
                      <span>
                        📅 {new Date(evento.fecha).toLocaleDateString("es-EC", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          year: "numeric",
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
                      👥 {evento.asistentes.length} asistente{evento.asistentes.length !== 1 ? "s" : ""}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-5 py-3 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

ModalMisEventos.propTypes = {
  onClose: PropTypes.func.isRequired,
};

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

  const eventosMostrados = isExpanded ? eventos : eventos.slice(0, 2);
  const hayMasEventos    = eventos.length > 2;

  return (
    <>
      <div className="p-4 bg-white rounded-lg shadow-md">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Eventos Próximos</h2>

          <div className="flex items-center gap-2">
            {/* Icono recordatorio — abre modal mis eventos */}
            <button
              onClick={() => setModalMisEventos(true)}
              title="Ver mis eventos confirmados"
              className="text-gray-400 hover:text-rose-500 transition-colors"
            >
              <FaClock size={20} />
            </button>

            {/* Expandir / contraer */}
            {hayMasEventos && (
              <button
                onClick={toggleExpand}
                className="text-gray-500 hover:text-blue-600 transition-transform"
              >
                {isExpanded ? <FiChevronUp size={24} /> : <FiChevronDown size={24} />}
              </button>
            )}
          </div>
        </div>

        {/* Lista */}
        <div
          className={`transition-all duration-300 ease-in-out ${
            isExpanded ? "max-h-[500px] overflow-y-auto" : "max-h-[150px] overflow-hidden"
          }`}
        >
          {eventosMostrados.length === 0 ? (
            <p>No hay eventos disponibles para mostrar.</p>
          ) : (
            <ul className="space-y-4">
              {eventosMostrados.map((evento) => {
                const isRechazado  = !!eventosRechazados[evento._id];
                const liClassName  = `border-b pb-4 last:border-b-0 last:pb-0 ${isRechazado ? "opacity-50" : ""}`;
                return (
                  <li key={evento._id} className={liClassName}>
                    <h3 className="font-semibold text-rose-800">{evento.titulo}</h3>
                    <p className="text-sm text-gray-700 mt-1">{evento.descripcion}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">
                        Fecha: {new Date(evento.fecha).toLocaleDateString()}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onConfirmar(evento._id)}
                          disabled={cargandoAsistencia || isRechazado}
                          className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300"
                          title="Confirmar asistencia"
                        >
                          <FaCalendarCheck />
                        </button>
                        <button
                          onClick={() => onRechazar(evento._id)}
                          disabled={cargandoAsistencia || isRechazado}
                          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300"
                          title="Rechazar asistencia"
                        >
                          <FaTimesCircle />
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
      {modalMisEventos && (
        <ModalMisEventos onClose={() => setModalMisEventos(false)} />
      )}
    </>
  );
};

EventosPublicados.propTypes = {
  eventos:            PropTypes.array.isRequired,
  loading:            PropTypes.bool.isRequired,
  onConfirmar:        PropTypes.func.isRequired,
  onRechazar:         PropTypes.func.isRequired,
  cargandoAsistencia: PropTypes.bool.isRequired,
  eventosRechazados:  PropTypes.object,
  isExpanded:         PropTypes.bool.isRequired,
  toggleExpand:       PropTypes.func.isRequired,
};

export default EventosPublicados;