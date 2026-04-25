import { useState, useEffect, useCallback } from "react";
import fetchDataBackend from "../helpers/fetchDataBackend";
import tokenManager from "../helpers/tokenManager";
import { socket } from "../helpers/socket";

export const isPerfilCompleto = (perfil) => {
  if (!perfil) return false;
  return (
    !!perfil.imagenPerfil &&
    perfil.genero && perfil.genero !== "otro" &&
    !!perfil.biografia?.trim() &&
    Array.isArray(perfil.intereses) && perfil.intereses.length > 0 &&
    !!perfil.ubicacion?.ciudad && !!perfil.ubicacion?.pais
  );
};

const usePerfilUsuarioAutenticado = ({ autoCargar = true } = {}) => {
  const [perfil, setPerfil] = useState(null);
  const [loadingPerfil, setLoadingPerfil] = useState(autoCargar);

  //  useCallback para estabilizar la referencia
  const cargarPerfil = useCallback(async () => {
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
  }, []); // sin dependencias = referencia estable

  // ✅ Un solo useEffect para auto-carga
  useEffect(() => {
    if (autoCargar) cargarPerfil();
  }, [autoCargar, cargarPerfil]);

  // ✅ Socket corregido: mismo evento en .on y .off
  useEffect(() => {
    if (!socket) return;

    socket.on("perfil_cambio", cargarPerfil);

    return () => {
      socket.off("perfil_cambio", cargarPerfil); // ✅ nombre correcto
    };
  }, [cargarPerfil]); // socket es estable, no hace falta en deps

  const completarPerfil = async (formData) => {
    try {
      const response = await fetchDataBackend(
        "estudiantes/completarPerfil",
        formData,
        "PUT",
        { showSuccessToast: false, showErrorToast: false }
      );
      setPerfil(response.perfilActualizado || response);
      return response;
    } catch (error) {
      console.error("Error completando perfil:", error);
      throw error;
    }
  };

  const editarPerfil = async (formData) => {
    try {
      const response = await fetchDataBackend(
        "estudiantes/completarPerfil",
        formData,
        "PUT",
        { showSuccessToast: false, showErrorToast: false }
      );
      setPerfil(response.perfilActualizado || response);
      return response;
    } catch (error) {
      console.error("Error editando perfil:", error);
      throw error;
    }
  };

  return { perfil, loadingPerfil, cargarPerfil, completarPerfil, editarPerfil };
};

export default usePerfilUsuarioAutenticado;