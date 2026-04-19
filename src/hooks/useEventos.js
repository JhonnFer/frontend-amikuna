import { useState, useEffect, useCallback } from "react";
import fetchDataBackend from "../helpers/fetchDataBackend"; // ✅ import directo
import { socket } from "../helpers/socket";


const useEventos = ({ autoCargar = true, onAsistenciaSuccess } = {}) => {

  // ── Estado: eventos públicos ───────────────────────────────────────────────
  const [eventos,            setEventos]            = useState([]);
  const [loadingEventos,     setLoadingEventos]     = useState(autoCargar);
  const [errorEventos,       setErrorEventos]       = useState(null);

  // ── Estado: mis eventos ────────────────────────────────────────────────────
  const [misEventos,         setMisEventos]         = useState([]);
  const [loadingMisEventos,  setLoadingMisEventos]  = useState(false);
  const [errorMisEventos,    setErrorMisEventos]    = useState(null);

  // ── Estado: asistencia ─────────────────────────────────────────────────────
  const [cargandoAsistencia, setCargandoAsistencia] = useState(false);
  const [errorAsistencia,    setErrorAsistencia]    = useState(null);

  // ── GET ver-eventos ────────────────────────────────────────────────────────
const obtenerEventos = useCallback(async () => {
  setLoadingEventos(true);
  setErrorEventos(null);
  try {
    const data = await fetchDataBackend("estudiantes/ver-eventos", null, "GET");
    // Backend ya filtra — solo guardamos lo que llega
    setEventos(data ?? []);
  } catch (err) {
    setErrorEventos(err.message || "Error al obtener eventos");
  } finally {
    setLoadingEventos(false);
  }
}, []);



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
  }, []); // ✅

  // ── POST asistir ───────────────────────────────────────────────────────────
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
  }, [onAsistenciaSuccess]); // ✅ solo onAsistenciaSuccess que sí puede cambiar

  // ── POST no-asistir ────────────────────────────────────────────────────────
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
  }, [onAsistenciaSuccess]); // ✅

  // ── Auto-carga ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (autoCargar) obtenerEventos();
  }, []); 

  
  // Intervalo — limpia eventos que ya iniciaron sin recargar
useEffect(() => {
  const limpiarEventosPasados = () => {
  const ahora = new Date();
  setEventos((prev) => prev.filter((e) => {
    if (!e.hora) return true; // ← si no tiene hora, no filtrar
    const [horas, minutos] = e.hora.split(":").map(Number);
    const fechaEvento = new Date(e.fecha);
    fechaEvento.setUTCHours(horas + 5, minutos, 0, 0);
    return fechaEvento >= ahora;
  }));
};

  limpiarEventosPasados();
  const intervalo = setInterval(limpiarEventosPasados, 60000);
  return () => clearInterval(intervalo);
}, []);
  // ── SOCKET: sincronización en tiempo real ─────────────────────────────────
useEffect(() => {
  if (!socket) return;
  
  

  const handleCambioEventos = () => {
    obtenerEventos();
    obtenerMisEventos();
  };

  const handleAsistencia = () => {
    console.log("📡 Cambio en asistencia detectado");
    obtenerMisEventos();
  };

  socket.on("evento_creado", handleCambioEventos);
  socket.on("evento_actualizado", handleCambioEventos);
  socket.on("evento_eliminado", handleCambioEventos);

  socket.on("asistencia_actualizada", handleAsistencia);

  return () => {
    socket.off("evento_creado", handleCambioEventos);
    socket.off("evento_actualizado", handleCambioEventos);
    socket.off("evento_eliminado", handleCambioEventos);
    socket.off("asistencia_actualizada", handleAsistencia);
  };
}, [socket, obtenerEventos, obtenerMisEventos]);

  return {
    eventos, loadingEventos, errorEventos, obtenerEventos,
    misEventos, loadingMisEventos, errorMisEventos, obtenerMisEventos,
    confirmarAsistencia, rechazarAsistencia, cargandoAsistencia, errorAsistencia,
  };
};

export default useEventos;