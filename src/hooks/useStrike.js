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
      // fetchDataBackend ya lanza error si no ok, no necesitas chequear res.ok
      setSuccess(res.msg);
    } catch (err) {
      setError(err.message || "Error al enviar strike");
    } finally {
      setLoading(false);
    }
  };

  return { enviarStrike, loading, error, success };
};

export default useStrike;
