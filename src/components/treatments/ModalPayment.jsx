import { useState, useEffect} from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import usePaypal from "../../hooks/usePaypal";

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

const ModalPayment = ({ onClose, onPaymentSuccess, aporte }) => {
  const [monto, setMonto]       = useState(aporte?.monto || 10);
  const [pagando, setPagando]   = useState(false);
  const [serverError, setServerError]   = useState("");
  const [serverSuccess, setServerSuccess] = useState("");
  const { crearOrden, capturarPago } = usePaypal();

     // ── Auto-limpiar mensajes (igual que EventList) ───────────────────────────
  useEffect(() => {
    if (serverSuccess) {
      const timer = setTimeout(() => {
        setServerSuccess("");
        onPaymentSuccess?.();
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [serverSuccess]);

  useEffect(() => {
    if (serverError) {
      const timer = setTimeout(() => setServerError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [serverError]);

  const handleCreateOrder = async () => {
    const orderId = await crearOrden(monto);
    if (!orderId) throw new Error("No se pudo crear la orden");
    return orderId;
  };

  const handleApprove = async (data) => {
    setPagando(true);
    try {
      const resultado = await capturarPago(data.orderID, monto);
      if (resultado.ok) {
        setServerSuccess("¡Aporte realizado! Gracias por apoyar Amikuna 🎉");
        onClose();
      } else {
        setServerError(resultado.mensaje || "Error al procesar el pago");
      }
    } finally {
      setPagando(false);
    }
  };

  const handleError = (err) => {
    console.error("PayPal error:", err);
    setServerError("Error en el pago. Intenta de nuevo.");
  };

  return (
    <PayPalScriptProvider options={{
      "client-id": PAYPAL_CLIENT_ID,
      currency: "USD",
    }}>
      <div className="space-y-7 px-2  overflow-y-auto  max-h-[80vh] scrollbar-eventos">
        {/* Descripción del aporte */}
        <div className="bg-orange-50 rounded-xl p-4 border border-orange-100 ">
          <p className="text-sm font-semibold text-orange-700">
            {aporte?.concepto || "Aporte voluntario"}
          </p>
          <p className="text-xs text-orange-500 mt-1">
            {aporte?.descripcion || "Tu apoyo ayuda a mejorar Amikuna"}
          </p>
        </div>

        {/* ── Mensajes inline ── */}
        {serverError && (
          <p className="text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded p-2">
            {serverError}
          </p>
        )}
        {serverSuccess && (
          <p className="text-green-600 text-sm text-center bg-green-50 border border-green-200 rounded p-2">
            {serverSuccess}
          </p>
        )}

        {/* Selector de monto */}
        <div>
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            Monto a aportar (USD)
          </label>
          <div className="flex gap-2 mt-2 flex-wrap">
            {[1, 5, 10, 20, 50].map((m) => (
              <button
                key={m}
                onClick={() => setMonto(m)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border transition ${
                  monto === m
                    ? "bg-orange-500 text-white border-orange-500"
                    : "border-gray-300 text-gray-600 hover:border-orange-400"
                }`}
              >
                ${m}
              </button>
            ))}
            <input
              type="number"
              min={1}
              value={monto}
              onChange={(e) => setMonto(Number(e.target.value))}
              className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
              placeholder="Otro"
            />
          </div>
        </div>

        {/* Botón PayPal */}
        <div className="pt-2 max-h-40 ">
          {pagando ? (
            <div className="text-center text-sm text-gray-500 py-4 animate-pulse">
              Procesando pago...
            </div>
          ) : (
            <PayPalButtons
              style={{ layout: "vertical", shape: "pill", label: "pay" }}
              createOrder={handleCreateOrder}
              onApprove={handleApprove}
              onError={handleError}
              onCancel={() => setServerError("Pago cancelado")}
              disabled={!monto || monto <= 0}
            />
          )}

          <button
          onClick={onClose}
          className="w-full py-2 my-3 border border-gray-300 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition"
        >
          Cancelar
        </button>
        </div>
      </div>
    </PayPalScriptProvider>
  );
};

export default ModalPayment;