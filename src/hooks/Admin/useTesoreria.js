import { useState, useCallback, useEffect } from "react";
import fetchDataBackend from "../../helpers/fetchDataBackend";

const useTesoreria = () => {
  const [tesoreria, setTesoreria] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const obtenerTesoreria = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDataBackend("tesoreria", null, "GET", false);
      setTesoreria(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const registrarGasto = useCallback(async (monto, razon) => {
    setGuardando(true);
    try {
      await fetchDataBackend("tesoreria/gasto", { monto, razon }, "POST");
      await obtenerTesoreria();
      return { ok: true };
    } catch (err) {
      return { ok: false, msg: err.message };
    } finally {
      setGuardando(false);
    }
  }, [obtenerTesoreria]);

  const ajustarSaldo = useCallback(async (monto, razon) => {
    setGuardando(true);
    try {
      await fetchDataBackend("tesoreria/ajuste", { monto: Number(monto), razon }, "POST");
      await obtenerTesoreria();
      return { ok: true };
    } catch (err) {
      return { ok: false, msg: err.message };
    } finally {
      setGuardando(false);
    }
  }, [obtenerTesoreria]);

  useEffect(() => {
    obtenerTesoreria();
  }, [obtenerTesoreria]);

  return {
    tesoreria,
    loading,
    error,
    guardando,
    obtenerTesoreria,
    registrarGasto,
    ajustarSaldo,
  };
};

export default useTesoreria;