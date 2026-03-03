// src/components/Dashboard_User/EventosPublicados.jsx

import React from "react";
import { FaCalendarCheck, FaTimesCircle } from "react-icons/fa";
import { FiChevronDown, FiChevronUp } from "react-icons/fi"; // Nuevos iconos

const EventosPublicados = ({
  eventos,
  loading,
  onConfirmar,
  onRechazar,
  cargandoAsistencia,
  eventosRechazados = {},
  isExpanded, // <-- Nuevo prop
  toggleExpand, // <-- Nuevo prop
}) => {
  if (loading) {
    return <p>Cargando eventos...</p>;
  }

  const eventosMostrados = isExpanded ? eventos : eventos.slice(0, 2);
  const hayMasEventos = eventos.length > 2;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Eventos Proximos</h2>
        {hayMasEventos && (
          <button onClick={toggleExpand} className="text-gray-500 hover:text-blue-600 transition-transform">
            {isExpanded ? <FiChevronUp size={24} /> : <FiChevronDown size={24} />}
          </button>
        )}
      </div>

      <div
        className={`
          transition-all duration-300 ease-in-out
          ${isExpanded ? "max-h-[500px] overflow-y-auto" : "max-h-[150px] overflow-hidden"}
        `}
      >
        {eventosMostrados.length === 0 ? (
          <p>No hay eventos disponibles para mostrar.</p>
        ) : (
          <ul className="space-y-4">
            {eventosMostrados.map((evento) => {
              const isRechazado = !!eventosRechazados[evento._id];
              const liClassName = `border-b pb-4 last:border-b-0 last:pb-0 ${isRechazado ? "opacity-50" : ""}`;
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
  );
};

export default EventosPublicados;
