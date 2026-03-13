import { useState, useEffect } from "react";
import useFetch from "./useFetch";

// Función para verificar si el perfil está completo
export const isPerfilCompleto = (perfil) => {
  if (!perfil) return false;

  const tieneFoto = !!perfil.imagenPerfil;
  const tieneGenero = perfil.genero && perfil.genero !== "otro";
  const tieneBiografia = !!perfil.biografia?.trim();
  const tieneIntereses = Array.isArray(perfil.intereses) && perfil.intereses.length > 0;
  const tieneUbicacion = !!perfil.ubicacion?.ciudad && !!perfil.ubicacion?.pais;

  return tieneFoto && tieneGenero && tieneBiografia && tieneIntereses && tieneUbicacion;
};

function usePerfilUsuarioAutenticado() {
  const { fetchDataBackend } = useFetch();
  const [perfil, setPerfil] = useState(null);
  const [loadingPerfil, setLoadingPerfil] = useState(true);

  const cargarPerfil = async () => {
    setLoadingPerfil(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;

      const headers = { Authorization: `Bearer ${token}` };
      const data = await fetchDataBackend("estudiantes/perfil", null, "GET", headers, false);

      setPerfil(data);
      return data; // 🔹 Retorna para login
    } catch (error) {
      console.error("Error cargando perfil:", error);
      setPerfil(null);
      return null;
    } finally {
      setLoadingPerfil(false);
    }
  };

  const actualizarPerfil = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetchDataBackend(
        "estudiantes/completarPerfil",
        formData,
        "PUT",
        headers,
        true
      );

      setPerfil(response.perfilActualizado || response);
      return response;
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      throw error;
    }
  };

  useEffect(() => {
    cargarPerfil();
  }, []);

  return { perfil, loadingPerfil, cargarPerfil, actualizarPerfil };
}

export default usePerfilUsuarioAutenticado;