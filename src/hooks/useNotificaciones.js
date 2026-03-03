// src/hooks/useNotificaciones.js

import { useState, useEffect } from 'react';
import usePerfilUsuarioAutenticado from "./usePerfilUsuarioAutenticado";
import useFetch from "./useFetch";

const useNotificaciones = () => {
    const { perfil, loadingPerfil } = usePerfilUsuarioAutenticado();
    const { fetchDataBackend } = useFetch();
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSolicitudes = async () => {
            if (loadingPerfil || !perfil) {
                setLoading(loadingPerfil);
                return;
            }

            try {
                // Paso 1: Obtener todos los perfiles de usuarios disponibles y matches.
                // Usamos los endpoints de tu archivo de rutas.
                const potencialesMatches = await fetchDataBackend("estudiantes/matches");
                const matches = await fetchDataBackend("estudiantes/listarmatches");
                
                // Paso 2: Unificar todos los usuarios conocidos en un mapa para búsqueda rápida.
                const todosLosUsuarios = [...potencialesMatches, ...matches];
                const usuariosMap = new Map();
                todosLosUsuarios.forEach(user => {
                    usuariosMap.set(user._id, user);
                });

                // Paso 3: Identificar las IDs de las solicitudes pendientes (tu lógica).
                const misSeguidores = new Set(perfil.seguidores || []);
                const aQuienSigo = new Set(perfil.siguiendo || []);
                
                const idsSolicitudesPendientes = Array.from(misSeguidores).filter(
                    (seguidorId) => !aQuienSigo.has(seguidorId)
                );

                // Paso 4: Mapear las IDs a objetos de usuario completos usando el mapa.
                // El .filter(Boolean) elimina cualquier posible undefined si un ID no se encuentra.
                const perfilesSolicitantes = idsSolicitudesPendientes
                    .map(id => usuariosMap.get(id))
                    .filter(Boolean);

                setSolicitudes(perfilesSolicitantes);

            } catch (error) {
                console.error("Error al obtener datos para notificaciones:", error);
                setSolicitudes([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSolicitudes();
    }, [perfil, loadingPerfil, fetchDataBackend]);

    return { solicitudes, loading };
};

export default useNotificaciones;