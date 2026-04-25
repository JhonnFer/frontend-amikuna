import { useState, useEffect, useCallback } from "react";
import useFetch from "../useFetch";

const useAdminEvents = () => {
  const { fetchDataBackend } = useFetch();

  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 NUEVO manejo tipo register
  const [serverError, setserverError] = useState(null);
  const [serverSuccess, setServerSuccess] = useState(null);

  const obtenerEventos = useCallback(async () => {
    setLoading(true);
    setserverError(null);

    try {
      const data = await fetchDataBackend("ver-evento", null, "GET", {
        showErrorToast: false,
      });

     
     setEventos(data ?? []);
    } catch (err) {
      setserverError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchDataBackend]);

  const crearEvento = async (formData) => {
    setserverError(null);
    setServerSuccess(null);

    try {
      const data = await fetchDataBackend(
        "crear-evento",
        formData,
        "POST",
        { showErrorToast: false }
      );

      setServerSuccess("Evento creado correctamente");
      await obtenerEventos();
      return data;

    } catch (err) {
      setserverError(err.message);
      throw err;
    }
  };

  const actualizarEvento = async (id, formData) => {
    setserverError(null);
    setServerSuccess(null);

    try {
      const data = await fetchDataBackend(
        `eventos/${id}`,
        formData,
        "PUT",
        { showErrorToast: false }
      );

      setServerSuccess("Evento actualizado correctamente");
      await obtenerEventos();
      return data;

    } catch (err) {
      setserverError(err.message);
      throw err;
    }
  };

  const eliminarEvento = async (id) => {
    if (!id) throw new Error("ID de evento inválido");

    setserverError(null);
    setServerSuccess(null);

    try {
      const data = await fetchDataBackend(
        `eliminar-evento/${id}`,
        null,
        "DELETE",
        { showErrorToast: false }
      );

      setServerSuccess("Evento eliminado correctamente");
      await obtenerEventos();
      return data;

    } catch (err) {
      setserverError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    obtenerEventos();
  }, [obtenerEventos]);

  return {
    eventos,
    loading,
   serverError,
    serverSuccess,
    obtenerEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento,
  };
};

export default useAdminEvents;