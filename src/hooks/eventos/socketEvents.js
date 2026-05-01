import { socket } from "./socket";

export const initSocketEvents = ({
  onEventosChange,
  onNotificaciones,
}) => {
  socket.on("evento_creado", onEventosChange);
  socket.on("evento_actualizado", onEventosChange);
  socket.on("evento_eliminado", onEventosChange);

  socket.on("asistencia_actualizada", onEventosChange);

  socket.on("notificacion_update", onNotificaciones);
};