import { socket } from "./socket";
import storeNotificaciones from "../components/Dashboard_User/Notificaciones/store/storeNotificaciones";

/**
 * ORQUESTADOR CENTRALIZADO DE SOCKET
 *
 * Este es el ÚNICO lugar donde se registran listeners para notificaciones.
 * Los componentes consumen el estado via Zustand, no emiten eventos.
 *
 * Beneficios:
 * - Sin listeners duplicados
 * - Estado único de verdad (Zustand)
 * - Fácil de debuggear
 * - Ciclo de vida limpio
 */

let listenersMounted = false;

export const initSocketOrchestrator = () => {
  if (!socket || listenersMounted) return;

  console.log("🔌 Inicializando Socket Orchestrator para notificaciones");
  listenersMounted = true;

  // ✅ NUEVA NOTIFICACIÓN (via socket)
  const handleNotificacion = (data) => {
    console.log("📩 Notificación nueva recibida:", data);

    // 🛡️ VALIDACIÓN: Ignorar si no es un objeto válido
    if (!data || typeof data !== "object") {
      console.warn(
        "⚠️ Notificación recibida sin datos válidos, ignorando...",
        data,
      );
      return;
    }

    // 🛡️ VALIDACIÓN: Debe tener _id y tipo mínimo
    if (!data._id || !data.tipo) {
      console.warn(
        "⚠️ Notificación incompleta (falta _id o tipo), ignorando...",
        data,
      );
      return;
    }

    storeNotificaciones.getState().agregarNotificacion(data);
  };

  // ✅ UPDATE NOTIFICACIÓN (via socket - marca como leído por otro cliente, etc)
  const handleUpdate = (data) => {
    console.log("🔄 Notificación actualizada:", data);

    // 🛡️ VALIDACIÓN: Debe tener _id
    if (!data || typeof data !== "object" || !data._id) {
      console.warn("⚠️ Update de notificación inválido, ignorando...", data);
      return;
    }

    storeNotificaciones.getState().actualizarNotificacion(data);
  };

  // ✅ ELIMINAR NOTIFICACIÓN (via socket)
  const handleEliminar = (data) => {
    console.log("🗑️ Notificación eliminada:", data);

    // 🛡️ VALIDACIÓN: Debe tener _id
    if (!data || !data._id) {
      console.warn("⚠️ Delete de notificación inválido, ignorando...", data);
      return;
    }

    storeNotificaciones.getState().eliminarNotificacion(data._id);
  };

  // Registrar listeners (una sola vez)
  socket.on("notificacion_nueva", handleNotificacion);
  socket.on("notificacion_update", handleUpdate);
  socket.on("notificacion_eliminar", handleEliminar);

  // Cleanup function
  return () => {
    console.log("🔌 Limpiando Socket Orchestrator");
    socket.off("notificacion_nueva", handleNotificacion);
    socket.off("notificacion_update", handleUpdate);
    socket.off("notificacion_eliminar", handleEliminar);
    listenersMounted = false;
  };
};
