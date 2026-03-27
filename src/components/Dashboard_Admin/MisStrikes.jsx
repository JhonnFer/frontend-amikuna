// src/components/Dashboard_Admin/MisStrikes.jsx
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import useAdminStrikes from "../../hooks/Admin/useAdminStrikes";

// --- Modal de Respuesta ---
const ModalResponderStrike = ({ strike, onClose, onResponder }) => {
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (mensaje.trim().length < 5) {
      setError("La respuesta debe tener al menos 5 caracteres.");
      return;
    }
    setEnviando(true);
    setError("");
    await onResponder(strike._id, { respuesta: mensaje });
    setEnviando(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-lg font-bold text-gray-800">Responder Strike</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
        </div>

        {/* Info del strike */}
        <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
          <p><span className="font-semibold text-gray-700">Tipo:</span> {strike.tipo}</p>
          <p><span className="font-semibold text-gray-700">Razón:</span> {strike.razon}</p>
          {strike.de && (
            <p>
              <span className="font-semibold text-gray-700">De:</span>{" "}
              {strike.de.nombre} {strike.de.apellido}
            </p>
          )}
        </div>

        {/* Textarea */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mensaje de respuesta
          </label>
          <textarea
            rows={4}
            value={mensaje}
            onChange={(e) => { setMensaje(e.target.value); setError(""); }}
            placeholder="Escribe tu respuesta (mínimo 5 caracteres)..."
            className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-1">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!mensaje.trim() || enviando}
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {enviando ? "Enviando..." : "Enviar respuesta"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Componente Principal ---
const MisStrikes = () => {
  const { obtenerStrikes, responderStrike } = useAdminStrikes();
  const [strikes, setStrikes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [strikeSeleccionado, setStrikeSeleccionado] = useState(null);

  useEffect(() => {
    const fetchStrikes = async () => {
      setLoading(true);
      try {
        const data = await obtenerStrikes();
        setStrikes(data);
      } catch (error) {
        console.error("Error al obtener strikes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStrikes();
  }, []);

  const handleResponder = async (strikeId, datos) => {
    try {
      await responderStrike(strikeId, datos);

      // Marcar como respondido en la lista sin refetch
      setStrikes((prev) =>
        prev.map((s) =>
          s._id === strikeId
            ? { ...s, respondido: true, respuesta: datos.respuesta }
            : s
        )
      );
    } catch (error) {
      console.error("Error al responder strike:", error);
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Cargando strikes...</p>;
  if (strikes.length === 0) return <p className="p-6 text-gray-400">No hay strikes para mostrar.</p>;

  return (
    <>
      <div className="flex flex-col h-full bg-white rounded-lg shadow-xl p-6 md:p-8">
        {/* Header */}
        <div className="mb-6 border-b pb-4">
          <h2 className="text-3xl font-bold text-gray-800">Mis Strikes</h2>
        </div>

        {/* Lista con scroll */}
        <div className="flex-grow overflow-y-auto max-h-96 -m-2 p-2">
          <ul className="space-y-4">
            {strikes.map((strike, i) => {
              const { _id, tipo, razon, fecha, de, respondido, respuesta } = strike;
              return (
                <li
                  key={_id || i}
                  className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  {/* Tipo + Fecha */}
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      {tipo}
                    </span>
                    <div className="flex items-center gap-2">
                      {/* Badge respondido */}
                      {respondido && (
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-100 text-green-700">
                          ✓ Respondido
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {new Date(fecha).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Razón */}
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    <strong>Razón:</strong> {razon}
                  </p>

                  {/* De */}
                  {de && (
                    <p className="text-sm text-gray-600">
                      <strong>De:</strong> {de.nombre} {de.apellido} ({de.correo})
                    </p>
                  )}

                  {/* Respuesta previa si ya fue respondido */}
                  {respondido && respuesta && (
                    <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
                      <strong>Tu respuesta:</strong> {respuesta}
                    </div>
                  )}

                  {/* Botón responder — solo si no fue respondido */}
                  {!respondido && (
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => setStrikeSeleccionado(strike)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                      >
                        Responder
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Modal */}
      {strikeSeleccionado && (
        <ModalResponderStrike
          strike={strikeSeleccionado}
          onClose={() => setStrikeSeleccionado(null)}
          onResponder={handleResponder}
        />
      )}
    </>
  );
};


ModalResponderStrike.propTypes = {
  strike: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    tipo: PropTypes.string.isRequired,
    razon: PropTypes.string.isRequired,
    fecha: PropTypes.string.isRequired,
    de: PropTypes.shape({
      nombre: PropTypes.string,
      apellido: PropTypes.string,
      correo: PropTypes.string,
    }),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onResponder: PropTypes.func.isRequired,
};

export default MisStrikes;