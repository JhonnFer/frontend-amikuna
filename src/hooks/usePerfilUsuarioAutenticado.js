import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "./useFetch";

const isPerfilCompleto = (perfil) => {
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
  const navigate = useNavigate();

  const [perfil, setPerfil] = useState(null);
  const [loadingPerfil, setLoadingPerfil] = useState(true);

  const cargarPerfil = async () => {
    setLoadingPerfil(true);

    try {
      // 🔹 OBTENER TOKEN
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login", { replace: true });
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const data = await fetchDataBackend(
        "estudiantes/perfil",
        null,
        "GET",
        headers,
        false
      );

      setPerfil(data);

      if (data && !isPerfilCompleto(data)) {
        console.log("Perfil incompleto, redirigiendo...");
        navigate("/user/completar-perfil", { replace: true });
      }
    } catch (error) {
      console.error("Error cargando perfil:", error);
      setPerfil(null);
      navigate("/login", { replace: true });
    }

    setLoadingPerfil(false);
  };

  const actualizarPerfil = async (formData) => {
    try {
      const token = localStorage.getItem("token");

      const headers = token
        ? { Authorization: `Bearer ${token}` }
        : {};

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