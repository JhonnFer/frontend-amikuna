import { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";
import usePaypal from "../../hooks/usePaypal";

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

const ModalPayment = ({ onClose, onPaymentSuccess, aporte }) => {
  const [monto, setMonto]       = useState(aporte?.monto || 10);
  const [pagando, setPagando]   = useState(false);
  const { crearOrden, capturarPago } = usePaypal();

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
        toast.success("¡Aporte realizado! Gracias por apoyar Amikuna 🎉");
        onPaymentSuccess?.();
        onClose();
      } else {
        toast.error(resultado.mensaje || "Error al procesar el pago");
      }
    } finally {
      setPagando(false);
    }
  };

  const handleError = (err) => {
    console.error("PayPal error:", err);
    toast.error("Error en el pago. Intenta de nuevo.");
  };

  return (
    <PayPalScriptProvider options={{
      "client-id": PAYPAL_CLIENT_ID,
      currency: "USD",
    }}>
      <div className="space-y-6 p-2">
        {/* Descripción del aporte */}
        <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
          <p className="text-sm font-semibold text-orange-700">
            {aporte?.concepto || "Aporte voluntario"}
          </p>
          <p className="text-xs text-orange-500 mt-1">
            {aporte?.descripcion || "Tu apoyo ayuda a mejorar Amikuna"}
          </p>
        </div>

        {/* Selector de monto */}
        <div>
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            Monto a aportar (USD)
          </label>
          <div className="flex gap-2 mt-2 flex-wrap">
            {[5, 10, 20, 50].map((m) => (
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
        <div className="pt-2">
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
              onCancel={() => toast.info("Pago cancelado")}
              disabled={!monto || monto <= 0}
            />
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 border border-gray-300 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition"
        >
          Cancelar
        </button>
      </div>
    </PayPalScriptProvider>
  );
};

export default ModalPayment;