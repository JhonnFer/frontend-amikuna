import { useState, useEffect, useCallback } from "react";
import fetchDataBackend from "../helpers/fetchDataBackend"; // Asegúrate que esta función exista

const useEventosEstudiante = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // La función para obtener eventos está dentro de un useCallback
  // para que el componente que la use pueda llamarla para recargar la lista.
  const obtenerEventos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      // Asegúrate de que esta URL sea la correcta para el backend de estudiantes
      const data = await fetchDataBackend("estudiantes/ver-eventos", token);
      setEventos(data);
    } catch (err) {
      setError(err.message || "Error al obtener eventos para el estudiante");
    } finally {
      setLoading(false);
    }
  }, []);

  // Llama a obtenerEventos la primera vez que el componente se monta
  useEffect(() => {
    obtenerEventos();
  }, [obtenerEventos]);

  return {
    eventos,
    loading,
    error,
    obtenerEventos, // Se retorna la función para que se pueda usar desde el dashboard
  };
};

export default useEventosEstudiante;
