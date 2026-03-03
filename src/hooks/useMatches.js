import { useState, useEffect } from "react";
import useFetch from "./useFetch";

const useMatches = () => {
  const { fetchDataBackend } = useFetch();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMatches = async () => {
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
  };

  useEffect(() => {
    fetchMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { matches, loading, error, refetch: fetchMatches };
};

export default useMatches;
