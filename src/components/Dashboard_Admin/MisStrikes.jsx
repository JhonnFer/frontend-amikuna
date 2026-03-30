// src/components/Dashboard_Admin/MisStrikes.jsx
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import useAdminStrikes from "../../hooks/Admin/useAdminStrikes";
import ModalDetalleDenuncia from "../Modals_Dashboards/Admin/Modaldetalledenuncia";

// ── helpers de estilo ──────────────────────────────────────────────────────────
const tipoBadge = (tipo) => {
  if (tipo === "queja")      return "bg-orange-100 text-orange-700";
  if (tipo === "sugerencia") return "bg-blue-100 text-blue-700";
  if (tipo === "denuncia")   return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-700";
};

const tipoBorder = (tipo) => {
  if (tipo === "queja")      return "border-orange-200";
  if (tipo === "sugerencia") return "border-blue-200";
  if (tipo === "denuncia")   return "border-red-200";
  return "border-gray-200";
};

const statusBadge = (status) => {
  if (status === "resuelto")  return "bg-green-100 text-green-700";
  if (status === "rechazado") return "bg-red-100 text-red-700";
  return "bg-yellow-100 text-yellow-700";
};

// ── Modal de Respuesta ─────────────────────────────────────────────────────────
const ModalResponderStrike = ({ strike, onClose, onResponder }) => {
  const [mensaje, setMensaje]   = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError]       = useState("");

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
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-lg font-bold text-gray-800">Responder Strike</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            ✕
          </button>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
          <p>
            <span className="font-semibold text-gray-700">Tipo:</span>{" "}
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tipoBadge(strike.tipo)}`}>
              {strike.tipo}
            </span>
          </p>
          <p><span className="font-semibold text-gray-700">Razón:</span> {strike.razon}</p>
          {strike.de && (
            <p>
              <span className="font-semibold text-gray-700">De:</span>{" "}
              {strike.de.nombre} {strike.de.apellido} — {strike.de.email}
            </p>
          )}
          {strike.usuarioReportado && (
            <p>
              <span className="font-semibold text-gray-700">Reportado:</span>{" "}
              {strike.usuarioReportado.nombre} {strike.usuarioReportado.apellido} — {strike.usuarioReportado.email}
            </p>
          )}
        </div>

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

ModalResponderStrike.propTypes = {
  strike: PropTypes.shape({
    _id:   PropTypes.string.isRequired,
    tipo:  PropTypes.string.isRequired,
    razon: PropTypes.string.isRequired,
    de: PropTypes.shape({
      nombre:   PropTypes.string,
      apellido: PropTypes.string,
      email:    PropTypes.string,
    }),
    usuarioReportado: PropTypes.shape({
      nombre:   PropTypes.string,
      apellido: PropTypes.string,
      email:    PropTypes.string,
    }),
  }).isRequired,
  onClose:     PropTypes.func.isRequired,
  onResponder: PropTypes.func.isRequired,
};

// ── Componente Principal ───────────────────────────────────────────────────────
const MisStrikes = () => {
  const { obtenerStrikes, responderStrike } = useAdminStrikes();

  const [strikes,              setStrikes]              = useState([]);
  const [loading,              setLoading]              = useState(false);
  const [filtro,               setFiltro]               = useState("todos");
  const [strikeSeleccionado,   setStrikeSeleccionado]   = useState(null); // para ModalResponder
  const [denunciaSeleccionada, setDenunciaSeleccionada] = useState(null); // para ModalDetalle

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

  // Cuando se elimina el match/chat desde ModalDetalleDenuncia,
  // refrescamos el strike en la lista para reflejar que ya no tiene chat
  const handleEliminado = (strikeId) => {
    setStrikes((prev) =>
      prev.map((s) =>
        s._id === strikeId ? { ...s, chat: null } : s
      )
    );
    setDenunciaSeleccionada(null);
  };

  const strikesFiltrados =
    filtro === "todos" ? strikes : strikes.filter((s) => s.tipo === filtro);

  if (loading) return <p className="p-6 text-gray-500">Cargando strikes...</p>;
  if (strikes.length === 0)
    return <p className="p-6 text-gray-400">No hay strikes para mostrar.</p>;

  return (
    <>
      <div className="flex flex-col h-full bg-white rounded-lg shadow-xl p-6 md:p-8">

        {/* Header */}
        <div className="mb-4 border-b pb-4 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-gray-800">Mis Strikes</h2>
          <span className="text-sm text-gray-400">{strikes.length} total</span>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {["todos", "queja", "sugerencia", "denuncia"].map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition ${
                filtro === f
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f !== "todos" && (
                <span className="ml-1 opacity-70">
                  ({strikes.filter((s) => s.tipo === f).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Lista con scroll */}
        <div className="flex-grow overflow-y-auto max-h-[500px] space-y-4 pr-1">
          {strikesFiltrados.map((strike, i) => {
            const {
              _id, tipo, razon, fecha, de,
              usuarioReportado, chat, status,
              respondido, respuesta,
            } = strike;

            return (
              <div
                key={_id || i}
                className={`bg-white border-l-4 ${tipoBorder(tipo)} border border-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200`}
              >
                {/* Fila 1 — tipo + status + fecha */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${tipoBadge(tipo)}`}>
                      {tipo}
                    </span>
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusBadge(status)}`}>
                      {respondido ? "✓ Respondido" : status}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(fecha).toLocaleString()}
                  </span>
                </div>

                {/* Razón */}
                <p className="text-sm text-gray-700 mb-3">
                  <strong className="text-gray-900">Razón:</strong> {razon}
                </p>

                {/* Remitente */}
                {de && (
                  <div className="text-xs text-gray-500 mb-1">
                    <strong className="text-gray-700">De:</strong>{" "}
                    {de.nombre} {de.apellido}
                    <span className="text-gray-400"> — {de.email}</span>
                  </div>
                )}

                {/* Usuario reportado — solo en denuncias */}
                {usuarioReportado && (
                  <div className="text-xs text-red-500 mb-1">
                    <strong className="text-red-700">Reportado:</strong>{" "}
                    {usuarioReportado.nombre} {usuarioReportado.apellido}
                    <span className="text-red-400"> — {usuarioReportado.email}</span>
                  </div>
                )}

                {/* Chat asociado — solo en denuncias */}
                {chat && (
                  <div className="text-xs text-gray-400 mb-1">
                    <strong className="text-gray-600">Chat ID:</strong> {chat._id}
                  </div>
                )}

                {/* Respuesta previa */}
                {respondido && respuesta && (
                  <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
                    <strong>Tu respuesta:</strong> {respuesta}
                  </div>
                )}

                {/* Acciones */}
                <div className="mt-3 flex justify-end gap-2">
                  {/* Ver detalle — solo denuncias */}
                  {tipo === "denuncia" && (
                    <button
                      onClick={() => setDenunciaSeleccionada(_id)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 font-medium hover:bg-red-100 transition"
                    >
                      Ver detalle
                    </button>
                  )}

                  {/* Responder — si no está respondido */}
                  {!respondido && (
                    <button
                      onClick={() => setStrikeSeleccionado(strike)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                    >
                      Responder
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal responder strike */}
      {strikeSeleccionado && (
        <ModalResponderStrike
          strike={strikeSeleccionado}
          onClose={() => setStrikeSeleccionado(null)}
          onResponder={handleResponder}
        />
      )}

      {/* Modal detalle denuncia */}
      {denunciaSeleccionada && (
        <ModalDetalleDenuncia
          strikeId={denunciaSeleccionada}
          onClose={() => setDenunciaSeleccionada(null)}
          onEliminado={handleEliminado}
        />
      )}
    </>
  );
};

export default MisStrikes;