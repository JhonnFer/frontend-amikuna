import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // IMPORTANTE: Agregado para la redirección
import useFetch from "./useFetch";

// Lógica para verificar si un perfil está completo
const isPerfilCompleto = (perfil) => {
  if (!perfil) return false;

  // Ajusta esta lógica si los campos obligatorios son diferentes
  const tieneFoto = !!perfil.imagenPerfil;
  const tieneGenero = perfil.genero && perfil.genero !== "otro";
  const tieneBiografia = !!perfil.biografia?.trim();
  const tieneIntereses = Array.isArray(perfil.intereses) && perfil.intereses.length > 0;
  const tieneUbicacion = !!perfil.ubicacion?.ciudad && !!perfil.ubicacion?.pais;

  return tieneFoto && tieneGenero && tieneBiografia && tieneIntereses && tieneUbicacion;
};

function usePerfilUsuarioAutenticado() {
  const { fetchDataBackend } = useFetch();
  const navigate = useNavigate(); // Hook para la navegación
  const [perfil, setPerfil] = useState(null);
  const [loadingPerfil, setLoadingPerfil] = useState(true);

  const cargarPerfil = async () => {
    setLoadingPerfil(true);
    try {
      const data = await fetchDataBackend("estudiantes/perfil", null, "GET", {}, false);
      setPerfil(data);

      // AÑADIDO: Verificación y redirección si el perfil está incompleto
      if (data && !isPerfilCompleto(data)) {
        console.log("Perfil incompleto, redirigiendo...");
        navigate("/user/completar-perfil", { replace: true });
      }

    } catch (error) {
      setPerfil(null);
      console.error("Error cargando perfil:", error);
      // Redirigir al login si hay un error de carga (p. ej., no autenticado)
      navigate("/login", { replace: true }); 
    }
    setLoadingPerfil(false);
  };

  const actualizarPerfil = async (formData) => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await fetchDataBackend("estudiantes/completarPerfil", formData, "PUT", headers, true);
      
      // Asegurarse de que el estado local se actualiza con los nuevos datos
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
