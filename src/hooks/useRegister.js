import { useState, useCallback } from "react";
import fetchDataBackend from "../helpers/fetchDataBackend";

const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [serverSuccess, setServerSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // ── REGISTRO ─────────────────────────────────────────
  const registerUser = useCallback(async (formData, resetForm) => {
    setIsLoading(true);
    setServerError(null);
    setServerSuccess(null);

    try {
      const response = await fetchDataBackend("registro", formData, "POST", {
        showSuccessToast: false,
        showErrorToast: false,
      });

      if (response?.success === false) {
        setServerError(response?.msg || "Error en el registro");
        return;
      }

      if (response?.msg) {
        resetForm?.();
        setServerSuccess(response.msg);
      }
    } catch (error) {
      console.error("[useRegister] registerUser:", error);

      setServerSuccess(null);
      setServerError(error?.message || "Ocurrió un error. Intenta más tarde.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Toggle contraseña ─────────────────────────────────
  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return {
    isLoading,
    serverError,
    serverSuccess,
    showPassword,
    registerUser,
    togglePassword,
  };
};

export default useRegister;
