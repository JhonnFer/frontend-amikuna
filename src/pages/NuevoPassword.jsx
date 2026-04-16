import { useParams, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import fondo1 from "../assets/fondo1.webp";
import { useNuevoPassword } from "../hooks/useRecuperarPassword";

const NuevoPassword = () => {
  const { token } = useParams();

  const {
    tokenValido,
    tokenVerificando,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    handleSubmit,
    loading,
  } = useNuevoPassword(token);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-6"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${fondo1})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <ToastContainer />

      {tokenVerificando && (
        <p className="text-white text-lg">Verificando enlace...</p>
      )}

      {!tokenVerificando && !tokenValido && (
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">
            El enlace es inválido o ha expirado.
          </p>

          <Link
            to="/olvidepassword"
            className="text-blue-300 hover:underline"
          >
            Solicitar nuevo enlace
          </Link>
        </div>
      )}

      {!tokenVerificando && tokenValido && (
        <>
          <h1 className="text-3xl sm:text-4xl font-semibold mb-6 text-white text-center">
            Crear nueva contraseña
          </h1>

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-sm bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg"
          >
            <label className="block mb-2 font-medium">
              Nueva contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
              required
            />

            <label className="block mb-2 font-medium">
              Confirmar contraseña
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:opacity-50 transition"
            >
              {loading ? "Actualizando..." : "Actualizar contraseña"}
            </button>

            <Link
              to="/login"
              className="block text-center mt-4 text-red-600 hover:underline"
            >
              Volver al login
            </Link>
          </form>
        </>
      )}
    </div>
  );
};

export default NuevoPassword;