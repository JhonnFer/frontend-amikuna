// src/hooks/useAportes.js

import { useState } from "react";
import useFetch from "./useFetch";

const useAportes = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { fetchDataBackend } = useFetch();

  const realizarAporte = async (aporteData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // El endpoint es el que ya tienes en tu backend
      const data = await fetchDataBackend(
        "estudiantes/aportes",
        aporteData,
        "POST"
      );

      if (data.ok) {
        setSuccess(true);
        return true;
      } else {
        setError(data.mensaje || "Error al procesar el aporte.");
        return false;
      }
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { realizarAporte, loading, error, success };
};

export default useAportes;