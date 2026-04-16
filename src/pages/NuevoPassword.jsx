import { useParams, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import fondo1 from "../assets/fondo1.webp";
import { useNuevoPassword } from "../hooks/useRecuperarPassword";

const NuevoPassword = () => {
  const { token } = useParams();

  // 🔥 Protección inmediata
  if (!token) {
    return (
      <div className="text-center mt-20">
        <p className="text-red-500">Token inválido</p>
        <Link to="/olvidepassword">Solicitar nuevo enlace</Link>
      </div>
    );
  }

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
        <p className="text-white">Verificando enlace...</p>
      )}

      {!tokenVerificando && !tokenValido && (
        <div className="text-center">
          <p className="text-red-400">Enlace inválido o expirado</p>
          <Link to="/olvidepassword">Solicitar otro</Link>
        </div>
      )}

      {!tokenVerificando && tokenValido && (
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm bg-white p-6 rounded"
        >
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-3 p-2 border"
            required
          />

          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full mb-3 p-2 border"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white p-2"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </form>
      )}
    </div>
  );
};

export default NuevoPassword;