//import  { useState } from "react";
// import {
//   Elements,
//   CardElement,
//   useStripe,
//   useElements,
// } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";

import PropTypes from "prop-types";

// Asegúrate de que esta clave sea tu clave pública de Stripe en el archivo .env
// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// src/components/treatments/ModalPayment.jsx
const ModalPayment = ({ onClose }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full border border-gray-200 text-center">
      <p className="text-gray-800 font-bold text-2xl mb-4">Realizar Aporte</p>
      <p className="text-gray-600 mb-6">
        Sistema de pagos en mantenimiento. Pronto podrás realizar aportes vía PayPal.
      </p>
      <button
        onClick={onClose}
        className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-800 text-white transition"
      >
        Cerrar
      </button>
    </div>
  );

};
ModalPayment.propTypes = {
  onClose: PropTypes.func.isRequired,
};
export default ModalPayment;