// src/hooks/useUsuarios(Admin).js

import { useEffect, useState } from "react";
import useFetch from "./useFetch";

const useUsuariosAdmin = () => {
  const { fetchDataBackend } = useFetch();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerUsuarios = async () => {
      setLoading(true);
      try {
        const data = await fetchDataBackend("listar", null, "GET");
        setUsuarios(data);
      } catch (error) {
        console.error("Error al obtener usuarios:", error.message);
      } finally {
        setLoading(false);
      }
    };

    obtenerUsuarios();
  }, [fetchDataBackend]);

  return { usuarios, loading };
};

export default useUsuariosAdmin;
