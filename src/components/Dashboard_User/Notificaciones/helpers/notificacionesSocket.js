import { socket } from "../../../../helpers/socket";

export const listenNotificaciones = (callback) => {
  socket.on("notificacion_nueva", callback);

  return () => {
    socket.off("notificacion_nueva", callback);
  };
};