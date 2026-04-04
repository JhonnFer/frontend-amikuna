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

  // ✅ sin try/catch innecesario — el error burbujea al componente
  const crearEvento = async (formData) => {
    // ── DEBUG ──────────────────────────────────────────
    console.log("🚀 crearEvento — FormData recibido en hook:");
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }
    // ──────────────────────────────────────────────────
    const data = await fetchDataBackend("crear-evento", formData, "POST");
    await obtenerEventos();
    return data;
  };

  // ✅ sin try/catch innecesario
  const actualizarEvento = async (id, formData) => {
    if (!id) throw new Error("ID de evento inválido");
    // ── DEBUG ──────────────────────────────────────────
    console.log(`🚀 actualizarEvento(${id}) — FormData recibido en hook:`);
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }
    // ──────────────────────────────────────────────────
    const data = await fetchDataBackend(`eventos/${id}`, formData, "PUT");
    await obtenerEventos();
    return data;
  };

  // ✅ sin try/catch innecesario
  const eliminarEvento = async (id) => {
    if (!id) throw new Error("ID de evento inválido");
    const data = await fetchDataBackend(`eliminar-evento/${id}`, null, "DELETE");
    await obtenerEventos();
    return data;
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