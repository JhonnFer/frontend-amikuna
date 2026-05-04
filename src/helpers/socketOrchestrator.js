import { socket } from "./socket";
import storeNotificaciones from "../components/Dashboard_User/Notificaciones/store/storeNotificaciones";
import storeSwipe from "../components/Dashboard_User/CardsSwipe/store/storeSwipe";
import storeUnread from "../components/Dashboard_User/ListaChats/store/storeUnread";
import storeStrikes from "../components/Dashboard_Admin/MisStrikes/store/storeStrikes"; // ← nuevo
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

  const handleUnreadUpdate = (data) => {
    console.log("🔴 unread update:", data);
    if (!data?.chatId || !data?.emisorId) return;
    storeUnread.getState().incrementarCount(data.chatId);
  };

  const handleChatCreado = ({ chatId, otherUserId }) => {
    console.log("💬 Chat creado:", chatId, "con usuario:", otherUserId);
    if (!chatId || !otherUserId) return;
    storeUnread.getState().agregarChatMap(otherUserId, chatId);
  };

  const handleNuevoMatch = (data) => {
    console.log("💖 Nuevo match:", data);
    if (!data?._id) return;
    storeSwipe.getState().setMatchUserId(data._id.toString());
  };

  // ── Admin Strikes ──────────────────────────────────────────────────────────
  const handleStrikeNuevo = (data) => {
    console.log("⚠️ Strike nuevo recibido:", data);
    if (!data?._id || !data?.tipo) {
      console.warn("⚠️ Strike inválido, ignorando...", data);
      return;
    }
    storeStrikes.getState().agregarStrike(data);
  };

  const handleStrikeRespondido = ({ strikeId }) => {
    console.log("✅ Strike respondido:", strikeId);
    if (!strikeId) return;
    storeStrikes.getState().marcarRespondido(strikeId);
  };

  const handleMatchEliminado = ({ strikeId }) => {
    console.log("🗑️ Match eliminado, strike resuelto:", strikeId);
    if (strikeId) storeStrikes.getState().resolverStrike(strikeId);
  };

  // Registrar listeners (una sola vez)
  socket.on("notificacion_nueva", handleNotificacion);
  socket.on("notificacion_update", handleUpdate);
  socket.on("notificacion_eliminar", handleEliminar);
  socket.on("chat:created", handleChatCreado);
  socket.on("chat:unread_update", handleUnreadUpdate);
  socket.on("nuevo_match", handleNuevoMatch);
  socket.on("strike_nuevo",       handleStrikeNuevo);
  socket.on("strike_respondido", handleStrikeRespondido); // ← nuevo
  socket.on("match_eliminado", handleMatchEliminado);

  // Cleanup function
  return () => {
    console.log("🔌 Limpiando Socket Orchestrator");
    socket.off("notificacion_nueva", handleNotificacion);
    socket.off("notificacion_update", handleUpdate);
    socket.off("notificacion_eliminar", handleEliminar);
    socket.off("chat:created", handleChatCreado);
    socket.off("chat:unread_update", handleUnreadUpdate);
    socket.off("nuevo_match", handleNuevoMatch);
    socket.off("strike_nuevo",      handleStrikeNuevo);  
    socket.off("strike_respondido", handleStrikeRespondido); // ← nuevo
    socket.off("match_eliminado", handleMatchEliminado);
    listenersMounted = false;
  };
};
