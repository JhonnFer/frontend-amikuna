// src/hooks/useChatbot.js
import { useState } from "react";
import useFetch from "./useFetch";

const useChatbot = () => {
  const { fetchDataBackend } = useFetch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [respuesta, setRespuesta] = useState("");

  const enviarMensaje = async (mensaje) => {
    setLoading(true);
    setError(null);
    setRespuesta("");

    try {
      const data =  await fetchDataBackend("estudiantes/perfil/chat", { mensaje }, "POST");
      setRespuesta(data.respuesta);
    } catch (err) {
      setError(err.message || "Error al enviar mensaje");
    } finally {
      setLoading(false);
    }
  };

  return { enviarMensaje, loading, error, respuesta };
};

export default useChatbot;
