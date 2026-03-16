import { useState, useCallback } from "react";
import useFetch from "./useFetch"; // Tu hook centralizado

const useChatbot = () => {
  const { fetchDataBackend } = useFetch();

  const [historial, setHistorial] = useState([]);
  const [respuesta, setRespuesta] = useState(""); // respuesta en tiempo real
  const [loadingHistorial, setLoadingHistorial] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1️⃣ Cargar historial desde el backend (solo una vez)
  const cargarHistorial = useCallback(async () => {
    if (historial.length > 0) return; // evita recargas innecesarias

    setLoadingHistorial(true);
    try {
      const response = await fetchDataBackend(
        "estudiantes/perfil/chat/historial",
        null,
        "GET",
        false // silencioso
      );

      const mensajes = Array.isArray(response?.mensajes) ? response.mensajes : [];
      setHistorial(mensajes);
    } catch (err) {
      console.error("Error al cargar historial:", err);
      setError("No se pudo cargar el historial del chat.");
    } finally {
      setLoadingHistorial(false);
    }
  }, [fetchDataBackend, historial.length]);

  // 2️⃣ Enviar mensaje al bot y actualizar respuesta en tiempo real
  const enviarMensaje = useCallback(async (mensajeUsuario) => {
    if (!mensajeUsuario?.trim()) return;

    setLoading(true);
    setError(null);
    setRespuesta(""); // limpiar respuesta previa

    try {
      const response = await fetchDataBackend(
        "estudiantes/perfil/chat",
        { mensaje: mensajeUsuario },
        "POST"
      );

      const textoIA = response?.respuesta || "Lo siento, no pude procesar tu mensaje.";

      // Actualizamos el historial local
      setHistorial((prev) => [
        ...prev,
        { rol: "usuario", contenido: mensajeUsuario },
        { rol: "asistente", contenido: textoIA },
      ]);

      // Actualizamos la respuesta en tiempo real
      setRespuesta(textoIA);

      return textoIA;
    } catch (err) {
      setError(err.message || "Error al enviar el mensaje");
    } finally {
      setLoading(false);
    }
  }, [fetchDataBackend]);

  return {
    historial,
    respuesta,          
    cargarHistorial,
    enviarMensaje,
    loading,
    loadingHistorial,
    error,
  };
};

export default useChatbot;