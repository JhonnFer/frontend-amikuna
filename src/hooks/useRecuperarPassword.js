import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useFetch from "./useFetch";

// ─────────────────────────────────────────────
// 🔹 1. Solicitar recuperación
// ─────────────────────────────────────────────
export const useSolicitarRecuperacion = () => {
  const { fetchDataBackend } = useFetch();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Por favor ingresa un correo válido");
      return;
    }

    setLoading(true);
    try {
      const data = await fetchDataBackend(
        "recuperarpassword",
        { email },
        "POST"
      );

      toast.success(data?.msg || "Revisa tu correo");
      setEmail("");
    } catch (error) {
      toast.error(error.message || "Error enviando solicitud");
    } finally {
      setLoading(false);
    }
  };

  return { email, setEmail, loading, handleSubmit };
};

// ─────────────────────────────────────────────
// 🔹 2. Nuevo password
// ─────────────────────────────────────────────
export const useNuevoPassword = (token) => {
  const { fetchDataBackend } = useFetch();
  const navigate = useNavigate();

  const [tokenValido, setTokenValido] = useState(false);
  const [tokenVerificando, setTokenVerificando] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  if (!token) return; // 🔥 ESTA LÍNEA TE FALTABA

  const verificar = async () => {
    try {
      await fetchDataBackend(`recuperarpassword/${token}`);
      setTokenValido(true);
    } catch (error) {
        console.error("Error verificando token:", error);
      toast.error("Token inválido o expirado");
      setTokenValido(false);
    } finally {
      setTokenVerificando(false);
    }
  };

  verificar();
}, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      toast.error("Mínimo 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      const data = await fetchDataBackend(
        `nuevopassword/${token}`,
        {
          password,
          confirmpassword: confirmPassword,
        },
        "POST"
      );

      toast.success(data?.msg || "Contraseña actualizada");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast.error(error.message || "Error al actualizar");
    } finally {
      setLoading(false);
    }
  };

  return {
    tokenValido,
    tokenVerificando,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    handleSubmit,
  };
};