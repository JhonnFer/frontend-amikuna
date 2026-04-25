import { useState, useEffect } from "react";
import fetchDataBackend from "../helpers/fetchDataBackend";
import { socket } from "../helpers/socket";

const useNotificaciones = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(false);

  const obtenerNotificaciones = async () => {
    setLoading(true);
    try {
      const response = await fetchDataBackend(
        "estudiantes/notificaciones",
        null,
        "GET",
        false,
      );
      setNotificaciones(response?.notificaciones ?? []);
    } catch (error) {
      console.error("Error en obtenerNotificaciones:", error);
      setNotificaciones([]);
    } finally {
      setLoading(false);
    }
  };

  const marcarLeido = async (id) => {
    try {
      await fetchDataBackend(
        `estudiantes/notificaciones/${id}/leido`,
        {},
        "PUT",
      );
      setNotificaciones((prev) =>
        prev.map((n) => (n._id === id ? { ...n, leido: true } : n)),
      );
    } catch (error) {
      console.error("Error al marcar como leído:", error);
    }
  };

  useEffect(() => {
    obtenerNotificaciones();
  }, []);

  // ─── ESCUCHAR EVENTO ELIMINADO PARA REFRESCAR NOTIFICACIONES ─────────────────
  useEffect(() => {
    const handleEventoEliminado = (data) => {
      console.log("📡 Evento eliminado recibido:", data);
      // Refrescar las notificaciones cuando se elimine un evento
      obtenerNotificaciones();
    };

    socket.on("evento_eliminado", handleEventoEliminado);

    return () => {
      socket.off("evento_eliminado", handleEventoEliminado);
    };
  }, []);

  return { notificaciones, loading, marcarLeido, obtenerNotificaciones };
};

export default useNotificaciones;
