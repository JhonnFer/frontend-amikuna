import { useState, useEffect, useCallback } from "react";
import useFetch from "./useFetch";
import { socket } from "../helpers/socket"; // ✅ SOLO este

const useMatches = () => {
  
  const { fetchDataBackend } = useFetch();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log("🔥 matches hook:", matches);

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

  // carga inicial
  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  // 🎧 listener socket
  useEffect(() => {
  const handleNuevoMatch = () => {
    console.log("🔥 nuevo_match o nuevo_chat recibido");
    fetchMatches();
  };

  socket.on("nuevo_match", handleNuevoMatch);

  return () => {
    socket.off("nuevo_match", handleNuevoMatch);
    socket.off("nuevo_chat", handleNuevoMatch);
  };
}, [fetchMatches]);


  return { matches, loading, error, refetch: fetchMatches };
  
};


export default useMatches;