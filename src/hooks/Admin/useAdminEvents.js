// src/hooks/Admin/useAdminEvents.js
import { useState, useEffect, useCallback } from "react";
import useFetch from "../useFetch";

const useAdminEvents = () => {
  const { fetchDataBackend } = useFetch();

  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const obtenerEventos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDataBackend("ver-evento", null, "GET", false);
      setEventos(data);
    } catch (err) {
      setError(err.message || "Error al obtener eventos");
    } finally {
      setLoading(false);
    }
  }, [fetchDataBackend]);

  const crearEvento = async (formData) => {
    try {
      const data = await fetchDataBackend("crear-evento", formData, "POST");
      await obtenerEventos();
      return data;
    } catch (error) {
      throw error;
    }
  };

  const actualizarEvento = async (id, formData) => {
    if (!id) throw new Error("ID de evento inválido");
    try {
      const data = await fetchDataBackend(`eventos/${id}`, formData, "PUT");
      await obtenerEventos();
      return data;
    } catch (error) {
      throw error;
    }
  };

  const eliminarEvento = async (id) => {
    if (!id) throw new Error("ID de evento inválido");
    try {
      const data = await fetchDataBackend(`eliminar-evento/${id}`, null, "DELETE");
      await obtenerEventos();
      return data;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    obtenerEventos();
  }, [obtenerEventos]);

  return {
    eventos,
    loading,
    error,
    obtenerEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento,
  };
};

export default useAdminEvents;
