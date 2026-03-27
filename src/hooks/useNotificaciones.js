//src/hooks/useNotificaciones.js
import { useState, useEffect, useCallback } from "react";
import useFetch from "./useFetch";

const useNotificaciones = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const { fetchDataBackend } = useFetch();

  const obtenerNotificaciones = useCallback(async () => {
    setLoading(true);
    try {
      // Llamada al endpoint
      const response = await fetchDataBackend("estudiantes/notificaciones", null, "GET", false);
      
      // ✅ IMPORTANTE: Tu backend devuelve { notificaciones: [...] }
      // Accedemos a la propiedad y nos aseguramos de que sea un array
      if (response && response.notificaciones) {
        setNotificaciones(response.notificaciones);
      } else {
        setNotificaciones([]);
      }
    } catch (error) {
      console.error("Error en obtenerNotificaciones:", error);
      setNotificaciones([]); // Reset en caso de error
    } finally {
      setLoading(false);
    }
  }, [fetchDataBackend]);

  const marcarLeido = async (id) => {
    try {
      // Enviamos el PUT. El backend responde con { msg: '...' }
      await fetchDataBackend(`estudiantes/notificaciones/${id}/leido`, {}, "PUT");

      // Actualizamos el estado local (Optimistic Update)
      setNotificaciones((prev) =>
        prev.map((n) => (n._id === id ? { ...n, leido: true } : n))
      );
    } catch (error) {
      console.error("Error al marcar como leído:", error);
    }
  };

  useEffect(() => {
    obtenerNotificaciones();
  }, [obtenerNotificaciones]);

  return {
    notificaciones,
    loading,
    marcarLeido,
    obtenerNotificaciones,
  };
};

export default useNotificaciones;