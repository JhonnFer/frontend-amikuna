import { ToastContainer } from "react-toastify";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import useConfirmarCuenta from "../hooks/useConfirmarCuenta";

const ConfirmarCuenta = () => {
  const { status, message } = useConfirmarCuenta();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 px-4">
      <ToastContainer />

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-center text-white animate-fade-in">
        
        {/* ICONO */}
        <div className="flex justify-center mb-6">
          {status === "loading" && (
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin" />
          )}

          {status === "success" && (
            <FiCheckCircle className="text-6xl text-green-300 animate-bounce" />
          )}

          {status === "error" && (
            <FiXCircle className="text-6xl text-red-300 animate-pulse" />
          )}
        </div>

        {/* TITULO */}
        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          {status === "loading" && "Confirmando tu cuenta..."}
          {status === "success" && "¡Cuenta confirmada!"}
          {status === "error" && "Error en la confirmación"}
        </h1>

        {/* MENSAJE */}
        <p className="text-sm md:text-base text-white/90 mb-6">
          {message || "Por favor espera mientras procesamos tu solicitud..."}
        </p>

        {/* TEXTO TIPO TINDER */}
        {status === "success" && (
          <p className="text-xs text-white/70 animate-pulse">
            Redirigiéndote al login...
          </p>
        )}
      </div>
    </div>
  );
};

export default ConfirmarCuenta;