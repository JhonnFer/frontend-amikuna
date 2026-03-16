// src/components/Dashboard_User/ChatbotEstudiante.jsx
import { useState } from "react";
import PropTypes from "prop-types";

const ChatbotEstudiante = ({ enviarMensaje, loading, respuesta }) => {  // ← quitado historial
  const [mensaje, setMensaje] = useState("");

  const handleEnviar = async () => {
    if (!mensaje.trim() || loading) return;
    const texto = mensaje;
    setMensaje("");
    await enviarMensaje(texto);
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 px-2 py-2 sm:px-3 sm:py-3 overflow-y-auto ">
        {loading ? (
          <p className="text-gray-400 text-xs sm:text-sm animate-pulse">
            Bot está escribiendo...
          </p>
        ) : respuesta ? (
          <div className="text-xs sm:text-sm md:text-base break-words leading-relaxed">
            <span className="font-semibold text-blue-600">Bot: </span>
            <span className="text-gray-700">{respuesta}</span>
          </div>
        ) : (
          <p className="text-gray-400 text-xs sm:text-sm text-center w-full mt-4">
            Hazme una pregunta 👋
          </p>
        )}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); handleEnviar(); }}
        className="flex items-center gap-2 border-t pt-2 w-full overflow-hidden"
      >
        <input
          type="text"
          placeholder="Escribe..."
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          disabled={loading}
          className="flex-1 min-w-0 border rounded px-2 py-1 text-xs sm:text-sm md:text-base sm:px-3 sm:py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading}
          className="shrink-0 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded px-2 py-1 text-xs sm:text-sm sm:px-4 sm:py-2 transition"
        >
          {loading ? "..." : "Enviar"}
        </button>
      </form>
    </div>
  );
};

ChatbotEstudiante.propTypes = {
  enviarMensaje: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  respuesta: PropTypes.string,
};

export default ChatbotEstudiante;