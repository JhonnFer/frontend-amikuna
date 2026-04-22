import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import fetchDataBackend from "../helpers/fetchDataBackend";
import usePerfilUsuarioAutenticado, { isPerfilCompleto } from "./usePerfilUsuarioAutenticado";
import storeAuth from "../context/storeAuth";

const useLogin = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [serverSuccess, setServerSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const { cargarPerfil } = usePerfilUsuarioAutenticado();
  const setAuth = storeAuth((state) => state.setAuth);

  // ── LOGIN ─────────────────────────────────────────
  const loginUser = useCallback(
    async (formData) => {
      setIsLoading(true);
      setServerError(null);
      setServerSuccess(null);

      try {
        const response = await fetchDataBackend(
          "login",
          formData,
          "POST",
          false // 👈 sin toast
        );

        // ❌ error primero
        if (!response?.token) {
          setServerError("Credenciales inválidas. Intenta de nuevo.");
          return;
        }

        // ✅ éxito
        const { user, token } = response;
        setAuth({ user, token });
        setServerSuccess("Inicio de sesión exitoso");

        const userRole = user?.rol?.toLowerCase()?.trim();

        if (userRole === "admin") {
          navigate("/admin/dashboard");
          return;
        }

        if (userRole === "estudiante") {
          const perfil = await cargarPerfil();
          const perfilOk = isPerfilCompleto(perfil);

          navigate(
            perfilOk ? "/user/dashboard" : "/user/completar-perfil"
          );
        }
      } catch (error) {
        console.error("[useLogin] loginUser:", error);

        setServerSuccess(null);
        setServerError(
          error?.message || "Ocurrió un error. Intenta más tarde."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [cargarPerfil, navigate, setAuth]
  );

  // ── Toggle contraseña ─────────────────────────────────
  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return {
    isLoading,
    serverError,
    serverSuccess,
    showPassword,
    loginUser,
    togglePassword,
  };
};

export default useLogin;