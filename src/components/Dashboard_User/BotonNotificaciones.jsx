// src/components/Dashboard_User/BotonNotificaciones.jsx (Versión corregida)

import React, { useState } from 'react';
import useSeguirUsuario from '../../hooks/useSeguirUsuario'; // Reutiliza el hook
import { FaBell } from 'react-icons/fa'; // Icono de campana
import { toast } from 'react-toastify';

// El componente ahora recibe objetos de usuario completos, no solo IDs.
const BotonNotificaciones = ({ solicitudes, loading, onNotificacionAccion }) => {
    const [mostrarMenu, setMostrarMenu] = useState(false);
    const { seguirUsuario, cargando: cargandoSeguir } = useSeguirUsuario();

    const handleAceptar = async (solicitante) => {
        // Obtenemos la ID del objeto solicitante
        const idSolicitante = solicitante._id;
        try {
            const data = await seguirUsuario(idSolicitante);
            if (data?.huboMatch) {
                toast.success(`¡Match con ${solicitante.nombre}!`);
            } else {
                toast.info(`Has aceptado la solicitud de ${solicitante.nombre}.`);
            }
            // Llamamos a la función del padre para actualizar la lista
            onNotificacionAccion(idSolicitante);
        } catch (error) {
            console.error("Error al aceptar solicitud:", error);
            toast.error("No se pudo aceptar la solicitud.");
        }
    };

    const handleRechazar = (solicitante) => {
        // Llamamos a la función del padre para actualizar la lista
        onNotificacionAccion(solicitante._id);
        toast.info(`Solicitud de ${solicitante.nombre} rechazada.`);
    };

    if (loading) return <div>Cargando notificaciones...</div>;

    return (
        <div className="relative">
            <button onClick={() => setMostrarMenu(!mostrarMenu)} className="relative p-2 rounded-full hover:bg-gray-200">
                <FaBell size={20} />
                {solicitudes.length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {solicitudes.length}
                    </span>
                )}
            </button>
            {mostrarMenu && (
                <div className="absolute left-0 mt-2 w-72 bg-white border rounded-lg shadow-lg z-10">
                    <ul className="p-2">
                        {solicitudes.length === 0 ? (
                            <li className="p-2 text-gray-500">No tienes solicitudes pendientes.</li>
                        ) : (
                            solicitudes.map(solicitante => (
                                <li key={solicitante._id} className="flex justify-between items-center p-2 border-b last:border-b-0">
                                    <span className="text-sm font-medium">{solicitante.nombre}</span>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleAceptar(solicitante)} 
                                            className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full"
                                            disabled={cargandoSeguir}
                                        >
                                            Aceptar
                                        </button>
                                        <button 
                                            onClick={() => handleRechazar(solicitante)} 
                                            className="bg-gray-300 text-black text-xs px-2 py-1 rounded-full"
                                        >
                                            Rechazar
                                        </button>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default BotonNotificaciones;