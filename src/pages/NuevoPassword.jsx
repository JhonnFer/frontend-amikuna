import { useParams, Link, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { useState } from "react";
import fondo1 from "../assets/fondo1.webp";
import { useRecuperarPassword } from "../hooks/useRecuperarPassword";

const NuevoPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const {
    tokenValido,
    tokenVerificando,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    enviarNuevoPassword,
    loading,
    serverError,
    serverSuccess,
  } = useRecuperarPassword(token);

  const [showPassword, setShowPassword] = useState(false);

  const getPasswordStrength = () => {
    if (!password) return { text: "", color: "" };
    if (password.length < 6) return { text: "Débil", color: "bg-red-500" };
    if (password.length < 10) return { text: "Media", color: "bg-yellow-500" };
    return { text: "Fuerte", color: "bg-green-500" };
  };

  const strength = getPasswordStrength();

  const handleSafeSubmit = (e) => {
    e.preventDefault();
    if (loading) return;
    enviarNuevoPassword(e);
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen px-4 py-10 text-white"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${fondo1})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Botón volver */}
      <button
        onClick={() => navigate("/login")}
        className="absolute top-6 left-6 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200"
      >
        <FiArrowLeft className="text-3xl md:text-5xl" />
      </button>

      {/* TOKEN inválido */}
      {!token && (
        <div className="text-center bg-black/40 p-6 rounded-lg backdrop-blur-md">
          <p className="text-red-400 mb-2">Token inválido</p>
          <Link to="/olvidepassword" className="underline">
            Solicitar nuevo enlace
          </Link>
        </div>
      )}

      {/* Verificando */}
      {token && tokenVerificando && (
        <p className="text-white text-lg">Verificando enlace...</p>
      )}

      {/* Token inválido o expirado */}
      {token && !tokenVerificando && !tokenValido && (
        <div className="text-center bg-black/40 p-6 rounded-lg backdrop-blur-md">
          <p className="text-red-400 mb-2">Enlace inválido o expirado</p>
          <Link to="/olvidepassword" className="underline">
            Solicitar otro
          </Link>
        </div>
      )}

      {/* FORM */}
      {token && !tokenVerificando && tokenValido && (
        <form
          onSubmit={handleSafeSubmit}
          className="w-full max-w-sm p-6 rounded-xl backdrop-blur-md bg-black/40 shadow-2xl"
        >
          <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-center">
            Crear nueva contraseña
          </h1>

          {/* Password */}
          <div className="space-y-1">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 border rounded-xl text-white bg-transparent ${
                serverError ? "border-red-400" : "border-gray-300"
              }`}
              disabled={loading}
              required
            />

            {/* Barra de fuerza */}
            {password && (
              <div className="w-full">
                <div className="h-2 rounded bg-gray-700 overflow-hidden">
                  <div
                    className={`h-2 ${strength.color} transition-all duration-300`}
                    style={{
                      width:
                        password.length < 6
                          ? "33%"
                          : password.length < 10
                            ? "66%"
                            : "100%",
                    }}
                  />
                </div>
                <p className="text-xs mt-1 text-gray-300">
                  Seguridad: {strength.text}
                </p>
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div className="space-y-1 mt-3">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full p-3 border rounded-xl text-white bg-transparent ${
                password !== confirmPassword && confirmPassword
                  ? "border-red-400"
                  : "border-gray-300"
              }`}
              disabled={loading}
              required
            />

            {confirmPassword && password !== confirmPassword && (
              <p className="text-red-400 text-xs">
                Las contraseñas no coinciden
              </p>
            )}
          </div>

          {/* Toggle mostrar contraseña */}
          <label className="flex items-center text-sm text-gray-300 cursor-pointer mt-3">
            <input
              type="checkbox"
              className="mr-2"
              onChange={() => setShowPassword((prev) => !prev)}
            />
            Mostrar contraseña
          </label>

          {/* Mensajes backend */}
          {serverError && (
            <p className="text-red-400 text-sm text-center mt-2">
              {serverError}
            </p>
          )}

          {serverSuccess && (
            <p className="text-green-400 text-sm text-center mt-2">
              {serverSuccess} — Redirigiendo...
            </p>
          )}

          {/* Botón */}
          <button
            type="submit"
            disabled={
              loading || password.length < 6 || password !== confirmPassword
            }
            className={`w-full mt-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
              loading || password.length < 6 || password !== confirmPassword
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {loading ? "Guardando..." : "Guardar contraseña"}
          </button>
        </form>
      )}
    </div>
  );
};

export default NuevoPassword;