//src/hooks/useStrike.js
import { useState } from "react";
import useFetch from "./useFetch";

const useStrike = () => {
  const { fetchDataBackend } = useFetch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const enviarStrike = async ({ tipo, razon }) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetchDataBackend("estudiantes/strike", { tipo, razon }, "POST");
      setSuccess(res.msg);
    } catch (err) {
      setError(err.message || "Error al enviar strike");
    } finally {
      setLoading(false);
    }
  };

  // Ver los strikes del usuario autenticado
  const obtenerStrikes = async () => {
    return await fetchDataBackend("estudiantes/mis-strikes", null, "GET");
  };

  const marcarNotificacionLeidaPorStrike = async (strikeId) => {
  return await fetchDataBackend(`estudiantes/notificaciones/strike/${strikeId}/leido`, {}, "PUT");
};

  return { enviarStrike, obtenerStrikes, marcarNotificacionLeidaPorStrike, loading, error, success };
};

export default useStrike;