import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "./useFetch";

/**
 * ─────────────────────────────────────────────
 * 🔐 FLUJO RECUPERACIÓN DE PASSWORD
 * ─────────────────────────────────────────────
 *
 * RUTAS BACKEND:
 *
 * 1. Solicitar recuperación
 *    POST → recuperarpassword
 *
 * 2. Verificar token
 *    GET → recuperarpassword/:token
 *
 * 3. Establecer nuevo password
 *    POST → nuevopassword/:token
 *
 * Este hook maneja TODO el flujo completo.
 */

export const useRecuperarPassword = (token = null) => {
  const { fetchDataBackend } = useFetch();
  const navigate = useNavigate();

  // ─────────────────────────────
  // 🔹 STATE GLOBAL
  // ─────────────────────────────
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [serverSuccess, setServerSuccess] = useState(null);

  // ─────────────────────────────
  // 🔹 STEP 1: EMAIL
  // ─────────────────────────────
  const [email, setEmail] = useState("");

  const solicitarRecuperacion = useCallback(async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setServerError("Por favor ingresa un correo válido");
      return;
    }

    setLoading(true);
    setServerError(null);
    setServerSuccess(null);

    try {
      const response = await fetchDataBackend(
        "recuperarpassword",
        { email },
        "POST"
      );

      if (!response?.success) {
        setServerError(response?.msg || "Error al enviar correo");
        return;
      }

      setServerSuccess(response.msg);
      setEmail("");

    } catch (error) {
      setServerError(error?.message || "Error enviando solicitud");
    } finally {
      setLoading(false);
    }
  }, [email, fetchDataBackend]);

  // ─────────────────────────────
  // 🔹 STEP 2: VALIDAR TOKEN
  // ─────────────────────────────
  const [tokenValido, setTokenValido] = useState(false);
  const [tokenVerificando, setTokenVerificando] = useState(true);

  useEffect(() => {
    if (!token) return;

    const verificar = async () => {
      try {
        await fetchDataBackend(`recuperarpassword/${token}`);
        setTokenValido(true);
      } catch (error) {
        setTokenValido(false);
        setServerError("Token inválido o expirado");
      } finally {
        setTokenVerificando(false);
      }
    };

    verificar();
  }, [token, fetchDataBackend]);

  // ─────────────────────────────
  // 🔹 STEP 3: NUEVO PASSWORD
  // ─────────────────────────────
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const enviarNuevoPassword = useCallback(async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setServerError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setServerError("Mínimo 6 caracteres");
      return;
    }

    setLoading(true);
    setServerError(null);
    setServerSuccess(null);

    try {
      const response = await fetchDataBackend(
        `nuevopassword/${token}`,
        {
          password,
          confirmpassword: confirmPassword,
        },
        "POST"
      );

      if (!response?.success) {
        setServerError(response?.msg || "Error al actualizar");
        return;
      }

      setServerSuccess(response.msg);

    } catch (error) {
      setServerError(error?.message || "Error al actualizar");
    } finally {
      setLoading(false);
    }
  }, [password, confirmPassword, token, fetchDataBackend]);

  // ─────────────────────────────
  // 🔹 REDIRECCIÓN GLOBAL
  // ─────────────────────────────
  useEffect(() => {
    if (serverSuccess) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [serverSuccess, navigate]);

  return {
    // global
    loading,
    serverError,
    serverSuccess,

    // step 1
    email,
    setEmail,
    solicitarRecuperacion,

    // step 2
    tokenValido,
    tokenVerificando,

    // step 3
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    enviarNuevoPassword,
  };
};