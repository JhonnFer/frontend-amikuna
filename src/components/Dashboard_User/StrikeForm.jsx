// src/components/Dashboard_User/StrikeForm.jsx
import { useState, useEffect } from "react";
import useStrike from "../../hooks/useStrike";

const StrikeForm = () => {
  const [tipo, setTipo] = useState("queja");
  const [razon, setRazon] = useState("");
  const [misStrikes, setMisStrikes] = useState([]);
  const [vistaActiva, setVistaActiva] = useState("formulario");
  const { enviarStrike, obtenerStrikes, loading, error, success } = useStrike();

  useEffect(() => {
    const cargarStrikes = async () => {
      try {
        const data = await obtenerStrikes();
        setMisStrikes(data?.strikes || []);
      } catch (err) {
        console.error("Error al obtener strikes:", err);
      }
    };
    cargarStrikes();
  }, [success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await enviarStrike({ tipo, razon });
    setRazon("");
  };

  const badgeColor = (tipo) => {
    if (tipo === "queja") return "bg-red-100 text-red-600";
    if (tipo === "sugerencia") return "bg-blue-100 text-blue-600";
    return "bg-purple-100 text-purple-600";
  };

  const statusColor = (status) => {
    if (status === "resuelto") return "bg-green-100 text-green-600";
    if (status === "rechazado") return "bg-red-100 text-red-600";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="w-full">

      {/* Tabs minimalistas */}
      <div className="flex gap-2 mb-6">
        {["formulario", "historial"].map((vista) => (
          <button
            key={vista}
            onClick={() => setVistaActiva(vista)}
            className={`text-sm font-semibold px-5 py-1.5 rounded-full transition ${
              vistaActiva === vista
                ? "bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {vista === "formulario" ? "Enviar" : `Mis envíos${misStrikes.length > 0 ? ` (${misStrikes.length})` : ""}`}
          </button>
        ))}
      </div>

      {/* Formulario */}
      {vistaActiva === "formulario" && (
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Selector tipo */}
          <div className="flex gap-2">
            {["queja", "sugerencia"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTipo(t)}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition ${
                  tipo === t
                    ? "bg-gradient-to-r from-pink-500 to-orange-400 text-white border-transparent shadow-sm"
                    : "bg-white text-gray-400 border-gray-200 hover:border-gray-400 hover:text-gray-600"
                }`}
              >
                {t === "queja" ? " Queja" : " Sugerencia"}
              </button>
            ))}
          </div>

          {/* Textarea */}
          <textarea
            value={razon}
            onChange={(e) => setRazon(e.target.value)}
            placeholder="Escribe tu mensaje aquí..."
            rows={4}
            className="w-full p-3 border border-gray-100 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition bg-gray-50"
          />

          {/* Feedback messages */}
          {error && (
            <p className="text-red-500 text-xs bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}
          {success && (
            <p className="text-green-600 text-xs bg-green-50 px-3 py-2 rounded-lg">✓ {success}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !razon.trim()}
            className="w-full py-2.5 rounded-xl font-bold text-gray-100 bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 disabled:opacity-80 disabled:cursor-not-allowed transition shadow-sm text-sm"
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </form>
      )}

      {/* Historial */}
      {vistaActiva === "historial" && (
        <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
          {misStrikes.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm">
              <p className="text-3xl mb-2">📭</p>
              <p>No has enviado ningún feedback aún</p>
            </div>
          ) : (
            misStrikes.map((s, i) => (
              <div
                key={s._id || i}
                className="border border-gray-100 rounded-xl p-4 space-y-2 hover:shadow-sm transition bg-gray-50/50"
              >
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${badgeColor(s.tipo)}`}>
                    {s.tipo}
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusColor(s.status)}`}>
                    {s.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600">{s.razon}</p>

                {s.respondido && s.respuesta && (
                  <div className="bg-pink-50 border border-pink-100 rounded-lg p-3">
                    <p className="text-xs font-semibold text-pink-500 mb-1">💬 Respuesta del equipo</p>
                    <p className="text-xs text-gray-500">{s.respuesta}</p>
                  </div>
                )}

                <p className="text-[10px] text-gray-500">
                  {new Date(s.fecha).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default StrikeForm;