import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { useState, useEffect } from "react";
import logoAmikuna from "../assets/forgot.jpg";
import { useRecuperarPassword } from "../hooks/useRecuperarPassword";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const {
  email,
  setEmail,
  solicitarRecuperacion,
  loading,
  serverError,
  serverSuccess,
} = useRecuperarPassword();

  // 🔥 Rate limit simple
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const isBlocked = timeLeft > 0;

  // 🔒 Submit seguro
  const handleSafeSubmit = (e) => {
    e.preventDefault();

    if (loading || isBlocked) return;

    if (!email.trim()) {
      toast.error("Ingresa un correo válido");
      return;
    }

    solicitarRecuperacion(e);

    // ⏱️ activar cooldown (10s)
    setTimeLeft(10);
  };

  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 py-10 text-white"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${logoAmikuna})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <ToastContainer />

      {/* Botón volver */}
      <button
        onClick={() => navigate("/login")}
        className="absolute top-6 left-6 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200"
      >
        <FiArrowLeft className="text-3xl md:text-5xl" />
      </button>

      <form
        onSubmit={handleSafeSubmit}
        className="w-full max-w-sm p-6 rounded-lg backdrop-blur-md bg-black/40 shadow-xl"
      >
        <h1 className="text-3xl sm:text-4xl font-semibold mb-8 text-center">
          ¿Olvidaste tu contraseña?
        </h1>

        <label className="block mb-2 text-center text-lg">
          Correo electrónico
        </label>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`w-full p-2 mb-2 border rounded text-white ${
            serverError ? "border-red-400" : "border-gray-300"
          }`}
          placeholder="ejemplo@correo.com"
          disabled={loading}
          required
        />

        {/* Mensajes UX */}
        {serverError && (
          <p className="text-red-400 text-sm text-center mb-2">
            {serverError}
          </p>
        )}

        {serverSuccess && (
          <p className="text-green-400 text-sm text-center mb-2">
            {serverSuccess}
          </p>
        )}

        {/* Mensaje rate limit */}
        {isBlocked && (
          <p className="text-yellow-400 text-sm text-center mb-2">
            Intenta nuevamente en {timeLeft}s
          </p>
        )}

        <button
          type="submit"
          disabled={loading || isBlocked || !email.trim()}
          className={`w-full py-2 rounded transition-all duration-200 ${
            loading || isBlocked || !email.trim()
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {loading
            ? "Enviando..."
            : isBlocked
            ? `Espera ${timeLeft}s`
            : "Enviar enlace"}
        </button>
      </form>

      <Link to="/login" className="mt-4 hover:underline">
        Volver al login
      </Link>
    </div>
  );
};

export default ForgotPassword;