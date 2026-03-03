// src/hooks/useAdminUsers.js
import { useState, useEffect, useCallback } from "react";
import useFetch from "../useFetch";

const useAdminUsers = () => {
  const { fetchDataBackend } = useFetch();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar lista de estudiantes
  const cargarUsuarios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDataBackend("listar", {}, "GET", true);
      setUsuarios(data);
    } catch (err) {
      setError("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  }, [fetchDataBackend]);

  // Eliminar estudiante por id
  const eliminarUsuario = useCallback(
    async (id) => {
      if (!window.confirm("¿Seguro que quieres eliminar este estudiante?")) return;

      try {
        await fetchDataBackend(`eliminar/${id}`, {}, "DELETE", true);
        // Quitar el usuario eliminado de la lista
        setUsuarios((prev) => prev.filter((u) => u._id !== id));
      } catch (err) {
        alert("Error al eliminar usuario");
      }
    },
    [fetchDataBackend]
  );

  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]);

  return { usuarios, loading, error, eliminarUsuario, recargar: cargarUsuarios };
};

export default useAdminUsers;
