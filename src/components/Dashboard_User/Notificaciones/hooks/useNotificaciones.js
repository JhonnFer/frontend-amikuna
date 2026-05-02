import storeNotificaciones from "../store/storeNotificaciones";

// Hook PURO: solo consume el store
// Los listeners de socket están en socketOrchestrator.js
const useNotificaciones = () => {
  const notificaciones = storeNotificaciones((state) => state.notificaciones);
  const loading = storeNotificaciones((state) => state.loading);
  const obtenerNotificaciones = storeNotificaciones(
    (state) => state.obtenerNotificaciones,
  );
  const marcarLeido = storeNotificaciones((state) => state.marcarLeido);
  const marcarTodasLeidas = storeNotificaciones(
    (state) => state.marcarTodasLeidas,
  );
  const contarNoLeidas = storeNotificaciones((state) => state.contarNoLeidas);
  const filtrarPorTipo = storeNotificaciones((state) => state.filtrarPorTipo);
  const buscar = storeNotificaciones((state) => state.buscar);

  return {
    // Estado
    notificaciones,
    loading,
    // Acciones
    obtenerNotificaciones,
    marcarLeido,
    marcarTodasLeidas,
    // Helpers (sin refetch)
    contarNoLeidas,
    filtrarPorTipo,
    buscar,
  };
};

export default useNotificaciones;
