import { useEffect } from "react";
import storeNotificaciones from "../store/storeNotificaciones";

const useNotificaciones = (userId) => {
  const {
    notificaciones,
    loading,
    obtenerNotificaciones,
    marcarNotificacionLeida,
    initSocket,
  } = storeNotificaciones();

  useEffect(() => {
    if (!userId) return;

    obtenerNotificaciones();

    const cleanup = initSocket();
    return cleanup;
  }, [userId]);

  return {
    notificaciones,
    loading,
    obtenerNotificaciones,
    marcarNotificacionLeida,
  };
};

export default useNotificaciones;
