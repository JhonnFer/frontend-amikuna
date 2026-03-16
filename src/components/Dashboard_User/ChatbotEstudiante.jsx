import { useState, useEffect } from "react";
import { FiMenu } from "react-icons/fi";
import useChatbot from "../../hooks/useChatbot";
import fetchDataBackend from "../../helpers/fetchDataBackend";
import storeAuth from "../../context/storeAuth";

const ChatbotEstudiante = () => {

  const [mensaje, setMensaje] = useState("");
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [historial, setHistorial] = useState([]);

  const { enviarMensaje, loading, error, respuesta } = useChatbot();
  const token = storeAuth((state) => state.token);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!mensaje.trim()) return;

    enviarMensaje(mensaje);
    setMensaje("");
  };

  // cargar historial
  const cargarHistorial = async () => {
    try {

      const data = await fetchDataBackend(
        "perfil/chat/historial",
        token
      );

      setHistorial(data);

    } catch (err) {
      console.error("Error cargando historial", err);
    }
  };

  const toggleHistorial = () => {

    const nuevoEstado = !mostrarHistorial;

    setMostrarHistorial(nuevoEstado);

    if (nuevoEstado) {
      cargarHistorial();
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-3 relative">

      {/* BOTON HAMBURGUESA */}
      <button
        onClick={toggleHistorial}
        className="absolute top-2 right-2 z-10 text-gray-600 hover:text-black"
      >
        <FiMenu size={20} />
      </button>

      {/* PANEL HISTORIAL */}
      {mostrarHistorial && (
        <div className="bg-white border rounded-lg p-3 max-h-60 overflow-y-auto text-sm shadow">

          <p className="font-semibold mb-2">Historial</p>

          {historial.length === 0 && (
            <p className="text-gray-400">Sin conversaciones</p>
          )}

          {historial.map((item, i) => (
            <div key={i} className="mb-2">

              <p className="text-blue-600">
                <b>Tú:</b> {item.mensaje}
              </p>

              <p className="text-gray-700">
                <b>Bot:</b> {item.respuesta}
              </p>

            </div>
          ))}

        </div>
      )}

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