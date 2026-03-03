// src/components/ChatbotEstudiante.jsx
import React, { useState } from "react";
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
  <div className="max-w-md mx-auto p-4 bg-white rounded-xl shadow-md">
  <form
    onSubmit={handleSubmit}
    className="flex items-center gap-2"
  >
    <textarea
      className="flex-1 border border-gray-300 rounded-full px-5 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 text-base leading-tight"
      style={{ minHeight: "50px" }}
      value={mensaje}
      onChange={(e) => setMensaje(e.target.value)}
      placeholder="Escribe un mensaje..."
      disabled={loading}
    />
    <button
      type="submit"
      disabled={loading}
      className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition disabled:opacity-50 text-sm font-medium"
    >
      {loading ? "Enviando..." : "Enviar"}
    </button>
  </form>

  {/* Mensaje de error */}
  {error && (
    <p className="text-red-500 text-sm mt-2 bg-red-50 border border-red-200 rounded-md p-2">
      {error}
    </p>
  )}

  {/* Respuesta del bot */}
  {respuesta && (
    <div className="mt-3 bg-gray-100 text-gray-800 p-3 rounded-2xl rounded-bl-sm shadow-sm whitespace-pre-wrap max-w-xs">
      {respuesta}
    </div>
  )}
</div>
  );
};

export default ChatbotEstudiante;
