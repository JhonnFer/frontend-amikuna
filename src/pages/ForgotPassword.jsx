import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import logoAmikuna from "../assets/forgot.jpg";
import { useSolicitarRecuperacion } from "../hooks/useRecuperarPassword";

const ForgotPassword = () => {
  const { email, setEmail, handleSubmit, loading } =
    useSolicitarRecuperacion();

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
        onSubmit={handleSubmit}
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
          className="w-full p-2 mb-4 border rounded text-white"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-500 py-2 rounded hover:bg-red-600"
        >
          {loading ? "Enviando..." : "Enviar enlace"}
        </button>
      </form>

      <Link to="/login" className="mt-4 hover:underline">
        Volver al login
      </Link>
    </div>
  );
};

export default ForgotPassword;