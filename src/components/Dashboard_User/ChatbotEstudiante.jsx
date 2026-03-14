// src/components/ChatbotEstudiante.jsx
import { useState } from "react";
import useChatbot from "../../hooks/useChatbot";

const ChatbotEstudiante = () => {
  const [mensaje, setMensaje] = useState("");
  const { enviarMensaje, loading, error, respuesta } = useChatbot();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!mensaje.trim()) return;
    enviarMensaje(mensaje);
    setMensaje("");
  };

  return (
    <div className="w-full flex flex-col gap-3">

      {/* RESPUESTA DEL BOT */}
      {respuesta && (
        <div className="bg-gray-100 text-gray-800 p-3 rounded-xl text-sm break-words">
          {respuesta}
        </div>
      )}

      {/* ERROR */}
      {error && (
        <p className="text-red-500 text-xs bg-red-50 border border-red-200 rounded-md p-2">
          {error}
        </p>
      )}

      {/* INPUT */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 w-full"
      >
        <textarea
          className="
            flex-1
            border border-gray-300
            bg-gray-100
            rounded-lg
            px-3 py-2
            resize-none
            focus:outline-none
            focus:ring-2 focus:ring-blue-400
            text-sm
          "
          rows={1}
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Escribe un mensaje..."
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          className="
            px-3 py-2
            bg-blue-500
            text-white
            rounded-lg
            hover:bg-blue-600
            transition
            disabled:opacity-50
            text-sm
            whitespace-nowrap
          "
        >
          {loading ? "..." : "Enviar"}
        </button>
      </form>

    </div>
  );
};

export default ChatbotEstudiante;