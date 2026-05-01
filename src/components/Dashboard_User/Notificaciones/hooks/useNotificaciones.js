import { useEffect } from "react";
import storeNotificaciones from "../store/storeNotificaciones";
import storeProfile from "../../../../context/storeProfile";

const useNotificaciones = () => {
  const profile = storeProfile((state) => state.profile);

  const notificaciones = storeNotificaciones((state) => state.notificaciones);
  const loading = storeNotificaciones((state) => state.loading);
  const obtenerNotificaciones = storeNotificaciones((state) => state.obtenerNotificaciones);
  const marcarLeido = storeNotificaciones((state) => state.marcarLeido);
  const marcarTodasLeidas = storeNotificaciones((state) => state.marcarTodasLeidas);
  const initSocket = storeNotificaciones((state) => state.initSocket);

  useEffect(() => {
    if (!profile?._id) return;

    obtenerNotificaciones(); // ✅ carga inicial — badge aparece al montar
    const cleanup = initSocket();
    return cleanup;
  }, [profile?._id]); // ← solo cuando cambia el usuario

  return {
    notificaciones,
    loading,
    obtenerNotificaciones,
    marcarLeido,
    marcarTodasLeidas,
  };
};

export default useNotificaciones;