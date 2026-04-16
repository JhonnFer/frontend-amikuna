
//src/hooks/useRecuperarPassword.js
import { useState, useEffect,  } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import useFetch from "./useFetch";

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
      const data = await fetchDataBackend("recuperarpassword", {
        method: "POST",
        body: { email },
      });

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

export const useNuevoPassword = (token) => {
  const { fetchDataBackend } = useFetch();
  const navigate = useNavigate();

  const [tokenValido, setTokenValido] = useState(false);
  const [tokenVerificando, setTokenVerificando] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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

    if (token) verificar();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      const data = await fetchDataBackend(`nuevopassword/${token}`, {
        method: "POST",
        body: {
          password,
          confirmpassword: confirmPassword,
        },
      });

      toast.success(data?.msg || "Contraseña actualizada");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error(error.message || "Error al actualizar");
    } finally {
      setLoading(false);
    }
  };

  return {
    tokenValido,
    tokenVerificando,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    loading,
    handleSubmit,
  };
};