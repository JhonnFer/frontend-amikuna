// 
// src/hooks/useEventos.js
// Hook unificado que reemplaza useEventosEstudiante.js y useAsistenciaEvento.js
import { useState, useEffect, useCallback } from "react";
import useFetch from "./useFetch";

const useEventos = ({ autoCargar = true, onAsistenciaSuccess } = {}) => {
  const { fetchDataBackend } = useFetch();

  // ── Estado: eventos públicos (ver-eventos) ─────────────────────────────────
  const [eventos,         setEventos]         = useState([]);
  const [loadingEventos,  setLoadingEventos]  = useState(autoCargar);
  const [errorEventos,    setErrorEventos]    = useState(null);

  // ── Estado: mis eventos confirmados (mis-eventos) ──────────────────────────
  const [misEventos,        setMisEventos]        = useState([]);
  const [loadingMisEventos, setLoadingMisEventos] = useState(false);
  const [errorMisEventos,   setErrorMisEventos]   = useState(null);

  // ── Estado: asistencia ─────────────────────────────────────────────────────
  const [cargandoAsistencia, setCargandoAsistencia] = useState(false);
  const [errorAsistencia,    setErrorAsistencia]    = useState(null);

  // ── GET estudiantes/ver-eventos ────────────────────────────────────────────
  const obtenerEventos = useCallback(async () => {
    setLoadingEventos(true);
    setErrorEventos(null);
    try {
      const data = await fetchDataBackend("estudiantes/ver-eventos", null, "GET");
      setEventos(data ?? []);
    } catch (err) {
      setErrorEventos(err.message || "Error al obtener eventos");
    } finally {
      setLoadingEventos(false);
    }
  }, [fetchDataBackend]);

  // ── GET mis-eventos ────────────────────────────────────────────────────────
  const obtenerMisEventos = useCallback(async () => {
    setLoadingMisEventos(true);
    setErrorMisEventos(null);
    try {
      const data = await fetchDataBackend("estudiantes/mis-eventos", null, "GET");
      setMisEventos(data ?? []);
    } catch (err) {
      setErrorMisEventos(err.message || "Error al obtener mis eventos");
    } finally {
      setLoadingMisEventos(false);
    }
  }, [fetchDataBackend]);

  // ── POST estudiantes/asistir/:id ───────────────────────────────────────────
  const confirmarAsistencia = useCallback(async (idEvento) => {
    if (!idEvento) { setErrorAsistencia("ID de evento inválido"); return; }
    setCargandoAsistencia(true);
    setErrorAsistencia(null);
    try {
      const response = await fetchDataBackend(`estudiantes/asistir/${idEvento}`, null, "POST");
      onAsistenciaSuccess?.();
      return response;
    } catch (err) {
      setErrorAsistencia(err.message || "Error al confirmar asistencia");
      throw err;
    } finally {
      setCargandoAsistencia(false);
    }
  }, [fetchDataBackend, onAsistenciaSuccess]);

  // ── POST estudiantes/no-asistir/:id ───────────────────────────────────────
  const rechazarAsistencia = useCallback(async (idEvento) => {
    if (!idEvento) { setErrorAsistencia("ID de evento inválido"); return; }
    setCargandoAsistencia(true);
    setErrorAsistencia(null);
    try {
      const response = await fetchDataBackend(`estudiantes/no-asistir/${idEvento}`, null, "POST");
      onAsistenciaSuccess?.();
      return response;
    } catch (err) {
      setErrorAsistencia(err.message || "Error al rechazar asistencia");
      throw err;
    } finally {
      setCargandoAsistencia(false);
    }
  }, [fetchDataBackend, onAsistenciaSuccess]);

  // ── Auto-carga inicial ─────────────────────────────────────────────────────
  useEffect(() => {
    if (autoCargar) obtenerEventos();
  }, [autoCargar, obtenerEventos]);

  return {
    // Eventos públicos
    eventos,
    loadingEventos,
    errorEventos,
    obtenerEventos,

    // Mis eventos confirmados
    misEventos,
    loadingMisEventos,
    errorMisEventos,
    obtenerMisEventos,

    // Asistencia
    confirmarAsistencia,
    rechazarAsistencia,
    cargandoAsistencia,
    errorAsistencia,
  };
};

export default useEventos;