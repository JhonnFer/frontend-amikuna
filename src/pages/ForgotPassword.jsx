import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import logoAmikuna from "../assets/forgot.jpg";
import { useRecuperarPassword } from "../hooks/useRecuperarPassword";

const ForgotPassword = () => {
  const { email, setEmail, solicitarRecuperacion, loading } = useRecuperarPassword();

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

      <form
        onSubmit={solicitarRecuperacion}
        className="w-full max-w-sm p-6 rounded-lg backdrop-blur-md bg-black/40 shadow-xl"
      >
        <h1 className="text-3xl sm:text-4xl font-semibold mb-8 text-center">
          ¿Olvidaste tu contraseña?
        </h1>

        <label
          htmlFor="email"
          className="block mb-2 font-medium text-center text-lg sm:text-xl"
        >
          Correo electrónico
        </label>

        <input
          type="email"
          id="email"
          placeholder="Tu correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-red-400"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 disabled:opacity-50 transition"
        >
          {loading ? "Enviando..." : "Enviar enlace de recuperación"}
        </button>
      </form>

      <Link
        to="/login"
        className="text-white hover:underline text-sm text-center mt-4"
      >
        Volver al login
      </Link>
    </div>
  );
};

export default ForgotPassword;