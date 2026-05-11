import { useState, useEffect, useCallback } from "react";
import useFetch from "./useFetch";
import { socket } from "../helpers/socket";

const useMatches = () => {
  const { fetchDataBackend } = useFetch();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDataBackend("estudiantes/listarmatches");
      setMatches(data);
    } catch (err) {
      setError(err.message || "Error al cargar matches");
    } finally {
      setLoading(false);
    }
  }, [fetchDataBackend]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  useEffect(() => {
    // patrón optimista: actualizar estado local sin refetch

    const handleNuevoMatch = async (nuevoMatch) => {
      if (!nuevoMatch?._id) return;
      await fetchMatches();
    };

    const handleMatchEliminado = (data) => {
      setMatches((prev) => prev.filter((m) => m._id !== data.matchId));
    };

    socket.on("nuevo_match", handleNuevoMatch);
    socket.on("match_eliminado", handleMatchEliminado);

    return () => {
      socket.off("nuevo_match", handleNuevoMatch);
      socket.off("match_eliminado", handleMatchEliminado);
    };
  }, []);

  // extraer unreadCounts de los matches al cargar
  const unreadCountsIniciales = matches.reduce((acc, match) => {
    if (match.chatId && match.unreadCount > 0) {
      acc[match.chatId] = match.unreadCount;
    }
    return acc;
  }, {});

  return {
    matches,
    loading,
    error,
    refetch: fetchMatches,
    unreadCountsIniciales,
  };
};

export default useMatches;
