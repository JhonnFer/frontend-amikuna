// socket ORQUESTADOR 
import { socket } from "./socket";

export const initSocketOrchestrator = ({
  onEventos,
  onNotificaciones,
  onPerfil,
  onChat,
}) => {
  if (!socket) return;

  // =====================
  // EVENTOSa
  // =====================
  const handleEventos = () => {
    onEventos?.(); // refetch eventos
  };

  // =====================
  // NOTIFICACIONES
  // =====================
  const handleNotificaciones = () => {
    onNotificaciones?.(); // refetch notificaciones
  };

  // =====================
  // PERFIL (si lo usas en futuro)
  // =====================
  const handlePerfil = () => {
    onPerfil?.();
  };

  // =====================
  // SOCKET EVENTS BACKEND
  // =====================

  socket.on("evento_creado", handleEventos);
  socket.on("evento_actualizado", handleEventos);
  socket.on("evento_eliminado", handleEventos);
  socket.on("asistencia_actualizada", handleEventos);

  socket.on("notificacion_nueva", handleNotificaciones);
  socket.on("notificacion_update", handleNotificaciones);

  socket.on("usuario_seguido", handleNotificaciones);
  socket.on("nuevo_match", handleNotificaciones);

  socket.on("perfil_actualizado", handlePerfil);

  // CLEANUP
  return () => {
    socket.off("evento_creado", handleEventos);
    socket.off("evento_actualizado", handleEventos);
    socket.off("evento_eliminado", handleEventos);
    socket.off("asistencia_actualizada", handleEventos);

    socket.off("notificacion_nueva", handleNotificaciones);
    socket.off("notificacion_update", handleNotificaciones);

    socket.off("usuario_seguido", handleNotificaciones);
    socket.off("nuevo_match", handleNotificaciones);

    socket.off("perfil_actualizado", handlePerfil);
  };
};