import { useEffect, useCallback, useState, useRef } from "react";
import useFetch from "./useFetch";

const useBotpressChat = () => {
  const { fetchDataBackend } = useFetch();
  const [historialBotpress, setHistorialBotpress] = useState([]);
  const [loadingBotpress, setLoadingBotpress] = useState(false);
  const ultimoMensajeUsuario = useRef(null); // 👈 ref para capturar último mensaje

  useEffect(() => {
    // Esperar a que Botpress cargue
    const intervalo = setInterval(() => {
      if (!window.botpress) return;

      clearInterval(intervalo);
      console.log("✅ Botpress disponible, escuchando eventos");

      // Mensaje del USUARIO (outgoing = lo que escribe el usuario)
      window.botpress.on("message", (event) => {
        const texto = event?.payload?.text;
        if (!texto) return;

        if (event.direction === "outgoing") {
          console.log("📤 Usuario:", texto);
          ultimoMensajeUsuario.current = texto;
          setHistorialBotpress(prev => [...prev, { rol: "usuario", contenido: texto }]);
        }

        // Respuesta del BOT (incoming = lo que responde el bot)
        if (event.direction === "incoming") {
          console.log("📥 Bot:", texto);
          setHistorialBotpress(prev => [...prev, { rol: "asistente", contenido: texto }]);

          // Guardar en BD
          if (ultimoMensajeUsuario.current) {
            guardarEnBD(ultimoMensajeUsuario.current, texto);
            ultimoMensajeUsuario.current = null;
          }
        }
      });

    }, 500); // revisa cada 500ms si ya cargó

    return () => clearInterval(intervalo);
  }, []);

  const guardarEnBD = useCallback(async (mensaje, respuesta) => {
    try {
      setLoadingBotpress(true);
      await fetchDataBackend(
        "estudiantes/perfil/chat/botpress-save",
        { mensaje, respuesta, timestamp: new Date().toISOString() },
        "POST"
      );
      console.log("✅ Guardado en BD");
    } catch (err) {
      console.error("❌ Error al guardar:", err);
    } finally {
      setLoadingBotpress(false);
    }
  }, [fetchDataBackend]);

  return { historialBotpress, loadingBotpress };
};

export default useBotpressChat;