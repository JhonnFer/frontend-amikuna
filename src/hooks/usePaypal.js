import { useState } from "react";
import fetchDataBackend from "../helpers/fetchDataBackend";

const usePaypal = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const crearOrden = async (amount) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDataBackend(
        "estudiantes/aportes/crear-orden",
        { amount },
        "POST",
        false
      );
      return data.orderId;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const capturarPago = async (orderId, amount) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDataBackend(
        "estudiantes/aportes/capturar-pago",
        { orderId, amount },
        "POST",
        false
      );
      return data;
    } catch (err) {
      setError(err.message);
      return { ok: false, mensaje: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { crearOrden, capturarPago, loading, error };
};

export default usePaypal;