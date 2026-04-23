//src/hooks/usePerfilUsuarioAutenticado.js
import { useState, useEffect } from "react";
import fetchDataBackend from "../helpers/fetchDataBackend";
import tokenManager from "../helpers/tokenManager";

// ── Validación de perfil completo ───────────────────────
export const isPerfilCompleto = (perfil) => {
  if (!perfil) return false;

  const tieneFoto = !!perfil.imagenPerfil;
  const tieneGenero = perfil.genero && perfil.genero !== "otro";
  const tieneBiografia = !!perfil.biografia?.trim();
  const tieneIntereses =
    Array.isArray(perfil.intereses) && perfil.intereses.length > 0;
  const tieneUbicacion = !!perfil.ubicacion?.ciudad && !!perfil.ubicacion?.pais;

  return (
    tieneFoto &&
    tieneGenero &&
    tieneBiografia &&
    tieneIntereses &&
    tieneUbicacion
  );
};

function usePerfilUsuarioAutenticado() {
  const [perfil, setPerfil] = useState(null);
  const [loadingPerfil, setLoadingPerfil] = useState(true);

  // ── Cargar perfil ─────────────────────────────────────
  const cargarPerfil = async () => {
    const token = tokenManager.getToken();

    if (!token) {
      setLoadingPerfil(false);
      setPerfil(null);
      return null;
    }

    setLoadingPerfil(true);

    try {
      const data = await fetchDataBackend("estudiantes/perfil", null, "GET", {
        showErrorToast: false,
      });

      setPerfil(data);
      return data;
    } catch (error) {
      console.error("Error cargando perfil:", error);
      setPerfil(null);
      return null;
    } finally {
      setLoadingPerfil(false);
    }
  };

  // ── COMPLETAR PERFIL ─────────────────────────────────
  const completarPerfil = async (formData) => {
    try {
      const response = await fetchDataBackend(
        "estudiantes/completarPerfil",
        formData,
        "PUT",
        {
          showSuccessToast: false,
          showErrorToast: false,
        },
      );

      setPerfil(response.perfilActualizado || response);
      return response;
    } catch (error) {
      console.error("Error completando perfil:", error);
      throw error;
    }
  };

  // ── EDITAR PERFIL ────────────────────────────────────
  const editarPerfil = async (formData) => {
    try {
      const response = await fetchDataBackend(
        "estudiantes/editarPerfil",
        formData,
        "PUT",
        {
          showSuccessToast: false,
          showErrorToast: false,
        },
      );

      setPerfil(response.perfilActualizado || response);
      return response;
    } catch (error) {
      console.error("Error editando perfil:", error);
      throw error;
    }
  };

  // ── INIT ─────────────────────────────────────────────
  useEffect(() => {
    const token = tokenManager.getToken();
    if (!token) {
      setLoadingPerfil(false);
      return;
    }

    cargarPerfil();
  }, []);
  return {
    perfil,
    loadingPerfil,
    cargarPerfil,
    completarPerfil,
    editarPerfil,
  };
}

export default usePerfilUsuarioAutenticado;
