import { useState, useEffect } from "react";
import fetchDataBackend from "../helpers/fetchDataBackend"; 

const useNotificaciones = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(false);

  const obtenerNotificaciones = async () => {
    setLoading(true);
    try {
      const response = await fetchDataBackend("estudiantes/notificaciones", null, "GET", false);
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
      await fetchDataBackend(`estudiantes/notificaciones/${id}/leido`, {}, "PUT");
      setNotificaciones((prev) =>
        prev.map((n) => (n._id === id ? { ...n, leido: true } : n))
      );
    } catch (error) {
      console.error("Error al marcar como leído:", error);
    }
  };

  useEffect(() => {
    obtenerNotificaciones();
  }, []); 

  return { notificaciones, loading, marcarLeido, obtenerNotificaciones };
};

export default useNotificaciones;