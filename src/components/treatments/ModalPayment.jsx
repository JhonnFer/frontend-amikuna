import  { useState } from "react";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import useAportes from "../../hooks/useAportes";
import perfil1 from "../../assets/perfil3.jpg";

// Asegúrate de que esta clave sea tu clave pública de Stripe en el archivo .env
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const PaymentForm = ({ onClose, onPaymentSuccess }) => {
  // --- CAMBIO: Estado local para el monto del aporte ---
  const [monto, setMonto] = useState(10);
  
  const stripe = useStripe();
  const elements = useElements();
  const { realizarAporte, loading } = useAportes();
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      setError(error.message);
      return;
    }

    try {
      const aporteData = {
        amount: monto, // <-- Usamos el estado local 'monto'
        paymentMethodId: paymentMethod.id,
      };

      const pagoExitoso = await realizarAporte(aporteData);

      if (pagoExitoso) {
        onPaymentSuccess();
      } else {
        setError("Error al procesar el aporte.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6 rounded-lg shadow-md">
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-50">Detalle del Aporte</label>
        <ul className="text-black bg-white p-2 rounded-md text-left">
          <li>Concepto: Aporte Voluntario</li>
          <li>Descripción: Contribución a la comunidad</li>
        </ul>
      </div>
      <div>
        <label className="mb-2 block text-sm  font-semibold text-gray-50">Monto</label>
        {/* --- CAMBIO: Input para que el usuario cambie el monto --- */}
        <input 
          type="number"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          min="1"
          className="w-full text-green-400 bg-white p-2 rounded-md font-bold text-left"
        />
      </div>

      <label className="mb-2 block text-sm font-semibold text-gray-50">Tarjeta de crédito</label>
      <div className="p-3 border border-gray-600 rounded-lg bg-white">
        <CardElement options={{ style: { base: { color: "#ffffff" } } }} />
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <div className="flex justify-center gap-4 mt-6">
        <button
          type="submit"
          className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-800 text-white transition duration-300 disabled:opacity-50"
          disabled={loading || !stripe || !elements}
        >
          {loading ? "Procesando..." : "Realizar Aporte"}
        </button>
        <button
          type="button"
          className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-800 text-white transition duration-300"
          onClick={onClose}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

function ModalPayment({ onClose, onPaymentSuccess }) {
  if (!stripePromise) {
    return null;
  }
  return (
    <div
  className="bg-[#9B2C2C] rounded-lg shadow-lg p-6 w-full border border-white"
  style={{ backgroundImage: `url(${perfil1})`, backgroundSize: "cover" }}
>
        <p className="text-white font-bold text-5xl mb-4 text-center">Realizar Aporte</p>
<p className="text-white italic text-2xl text-center mb-6">Tu ayuda hoy puede cambiar una vida mañana. Estas donaciones serán utilizadas para mejorar nuestro sistema y así más jóvenes podrán beneficiarse de este nuevo sistema de comunicacion social universitario.🥰</p>
        <Elements stripe={stripePromise}>
          <PaymentForm onClose={onClose} onPaymentSuccess={onPaymentSuccess} />
        </Elements>
      </div>
    
    
  );
}

export default ModalPayment;