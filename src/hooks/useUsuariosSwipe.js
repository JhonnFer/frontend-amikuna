import { useEffect, useState } from "react";
import useFetch from "./useFetch";

function useUsuariosSwipe() {
  const { fetchDataBackend } = useFetch();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const obtenerUsuarios = async () => {
    try {
      const data = await fetchDataBackend("estudiantes/matches");
      setUsuarios(data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  return { usuarios, loading };
}

export default useUsuariosSwipe;
