import { FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 via-orange-50 to-orange-100 px-4">
      
      <div className="bg-white/80 backdrop-blur-md border border-orange-200 shadow-2xl rounded-3xl p-8 max-w-md w-full text-center">
        
        {/* Icono */}
        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-red-400 to-orange-400 text-white shadow-lg">
          <FaLock size={28} />
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Acceso denegado
        </h1>

        {/* Mensaje */}
        <p className="text-gray-500 text-sm mb-6">
          No tienes permiso para acceder a esta página.  
          Revisa si estás logueado o si tu cuenta tiene los permisos necesarios.
        </p>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-600 font-medium hover:bg-gray-100 transition"
          >
            ← Volver
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-400 to-orange-400 text-white font-semibold shadow-md hover:from-red-500 hover:to-orange-500 transition"
          >
            Ir a inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;