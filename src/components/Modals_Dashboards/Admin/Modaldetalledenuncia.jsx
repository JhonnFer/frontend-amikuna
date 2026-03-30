// src/components/Dashboard_Admin/ModalDetalleDenuncia.jsx
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import useAdminStrikes from "../../../hooks/Admin/useAdminStrikes";

// ── helpers de estilo ──────────────────────────────────────────────────────────
const tipoBadge = (tipo) => {
  if (tipo === "queja")      return "bg-orange-100 text-orange-700";
  if (tipo === "sugerencia") return "bg-blue-100 text-blue-700";
  if (tipo === "denuncia")   return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-700";
};

// ── Dato: fila label + valor ───────────────────────────────────────────────────
const Dato = ({ label, value, className = "text-gray-700" }) =>
  value ? (
    <p className="text-sm">
      <span className="font-semibold text-gray-600">{label}:</span>{" "}
      <span className={className}>{value}</span>
    </p>
  ) : null;

Dato.propTypes = {
  label:     PropTypes.string.isRequired,
  value:     PropTypes.string,
  className: PropTypes.string,
};

// ── TarjetaUsuario ─────────────────────────────────────────────────────────────
const TarjetaUsuario = ({ titulo, usuario, colorClass = "text-gray-700" }) => {
  if (!usuario) return null;
  const nombreCompleto = `${usuario.nombre ?? ""} ${usuario.apellido ?? ""}`.trim();
  return (
    <div className="bg-gray-50 rounded-lg p-3 space-y-1">
      <p className={`text-xs font-bold uppercase tracking-wide ${colorClass}`}>{titulo}</p>
      <Dato label="Nombre" value={nombreCompleto || undefined} />
      <Dato label="Email"  value={usuario.email} />
      {usuario._id && (
        <Dato label="ID" value={usuario._id} className="text-gray-400 font-mono text-xs" />
      )}
    </div>
  );
};

TarjetaUsuario.propTypes = {
  titulo:     PropTypes.string.isRequired,
  usuario:    PropTypes.shape({
    _id:      PropTypes.string,
    nombre:   PropTypes.string,
    apellido: PropTypes.string,
    email:    PropTypes.string,
  }),
  colorClass: PropTypes.string,
};

// ── ListaMensajes ──────────────────────────────────────────────────────────────
// El backend popula mensajes.emisor con nombre, apellido y email.
const ListaMensajes = ({ mensajes }) => {
  if (!mensajes?.length)
    return <p className="text-xs text-gray-400 italic">Sin mensajes registrados.</p>;

  return (
    <ul className="space-y-2 max-h-56 overflow-y-auto pr-1">
      {mensajes.map((msg, i) => {
        const emisor  = msg.emisor;
        const nombre  = emisor?.nombre
          ? `${emisor.nombre} ${emisor.apellido ?? ""}`.trim()
          : "Usuario";
        const email   = emisor?.email ?? null;
        const fecha   = msg.createdAt ?? msg.fecha ?? null;

        return (
          <li
            key={msg._id ?? i}
            className="text-xs bg-white border border-gray-100 rounded-md p-2.5 shadow-sm"
          >
            <div className="flex justify-between items-start mb-1 gap-2">
              <div>
                <span className="font-semibold text-gray-700">{nombre}</span>
                {email && <span className="block text-gray-400">{email}</span>}
              </div>
              {fecha && (
                <span className="text-gray-400 shrink-0 mt-0.5">
                  {new Date(fecha).toLocaleString()}
                </span>
              )}
            </div>
            <p className="text-gray-700 break-words leading-relaxed mt-1">{msg.contenido}</p>
          </li>
        );
      })}
    </ul>
  );
};

ListaMensajes.propTypes = {
  mensajes: PropTypes.arrayOf(
    PropTypes.shape({
      _id:       PropTypes.string,
      contenido: PropTypes.string,
      createdAt: PropTypes.string,
      emisor:    PropTypes.shape({
        nombre:   PropTypes.string,
        apellido: PropTypes.string,
        email:    PropTypes.string,
      }),
    })
  ),
};

// ── PanelConfirmarEliminacion ──────────────────────────────────────────────────
const PanelConfirmarEliminacion = ({ onConfirmar, onCancelar, eliminando }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
    <p className="text-sm text-red-700 font-medium">
      ⚠️ ¿Estás seguro de que deseas eliminar el match y el chat de esta denuncia?
    </p>
    <p className="text-xs text-red-500">
      Esta acción es irreversible. Se eliminarán el match y todos los mensajes del chat.
    </p>
    <div className="flex justify-end gap-2">
      <button
        onClick={onCancelar}
        disabled={eliminando}
        className="px-3 py-1.5 text-xs rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition disabled:opacity-50"
      >
        Cancelar
      </button>
      <button
        onClick={onConfirmar}
        disabled={eliminando}
        className="px-3 py-1.5 text-xs rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {eliminando ? "Eliminando..." : "Sí, eliminar"}
      </button>
    </div>
  </div>
);

PanelConfirmarEliminacion.propTypes = {
  onConfirmar: PropTypes.func.isRequired,
  onCancelar:  PropTypes.func.isRequired,
  eliminando:  PropTypes.bool.isRequired,
};

// ── ModalDetalleDenuncia ───────────────────────────────────────────────────────
/**
 * Props:
 *   strikeId    {string}    ID del strike de tipo "denuncia"
 *   onClose     {function}  Cierra el modal
 *   onEliminado {function}  Callback opcional tras eliminar match/chat (recibe strikeId)
 */
const ModalDetalleDenuncia = ({ strikeId, onClose, onEliminado }) => {
  const { obtenerDenunciaDetalle, eliminarMatchYChat } = useAdminStrikes();

  const [detalle,    setDetalle]    = useState(null);
  const [cargando,   setCargando]   = useState(true);
  const [error,      setError]      = useState("");
  const [confirmar,  setConfirmar]  = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [eliminado,  setEliminado]  = useState(false);

  // ── GET /denuncias/:strikeId ─────────────────────────────────────────────────
  useEffect(() => {
    if (!strikeId) return;

    const fetchDetalle = async () => {
      setCargando(true);
      setError("");
      try {
        const data = await obtenerDenunciaDetalle(strikeId);
        // El backend devuelve { strike } — extraemos el objeto
        const strike = data?.strike ?? data;
        setDetalle(strike);
      } catch (err) {
        console.error("Error al obtener detalle de denuncia:", err);
        setError("No se pudo cargar el detalle de la denuncia.");
      } finally {
        setCargando(false);
      }
    };

    fetchDetalle();
  }, [strikeId]);

  // ── POST /denuncias/:strikeId/eliminar-match-chat ────────────────────────────
  const handleEliminar = async () => {
    setEliminando(true);
    setError("");
    try {
      const data = await eliminarMatchYChat(strikeId);
      // Actualizamos el detalle local con el strike devuelto (status: 'resuelto', chat: null)
      const strikeActualizado = data?.strike ?? null;
      if (strikeActualizado) {
        setDetalle((prev) => ({ ...prev, ...strikeActualizado, chat: null }));
      } else {
        setDetalle((prev) => ({ ...prev, chat: null, status: "resuelto" }));
      }
      setEliminado(true);
      setConfirmar(false);
      onEliminado?.(strikeId);
    } catch (err) {
      console.error("Error al eliminar match/chat:", err);
      setError("No se pudo eliminar el match y el chat. Intenta nuevamente.");
      setConfirmar(false);
    } finally {
      setEliminando(false);
    }
  };

  // ── render ───────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4 shrink-0">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <span>🚨</span> Detalle de Denuncia
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold leading-none"
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        {/* Body con scroll */}
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4">

          {/* Estado: cargando */}
          {cargando && (
            <div className="flex items-center justify-center py-10">
              <span className="text-gray-400 text-sm animate-pulse">Cargando detalle...</span>
            </div>
          )}

          {/* Estado: error */}
          {!cargando && error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Contenido */}
          {!cargando && detalle && (
            <>
              {/* Info general */}
              <section className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${tipoBadge(detalle.tipo)}`}>
                    {detalle.tipo}
                  </span>
                  {detalle.fecha && (
                    <span className="text-xs text-gray-400">
                      {new Date(detalle.fecha).toLocaleString()}
                    </span>
                  )}
                </div>
                <Dato label="Razón" value={detalle.razon} />
              </section>

              {/* Usuarios */}
              <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <TarjetaUsuario titulo="Denunciante"       usuario={detalle.de} />
                <TarjetaUsuario titulo="Usuario reportado" usuario={detalle.usuarioReportado} colorClass="text-red-600" />
              </section>

              {/* Chat asociado */}
              <section className="space-y-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-700">💬 Chat asociado</p>
                  {detalle.chat?._id && (
                    <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                      {detalle.chat._id}
                    </span>
                  )}
                </div>

                {detalle.chat ? (
                  <>
                    <div className="flex gap-4 text-xs text-gray-500">
                      {detalle.chat.mensajes?.length >= 0 && (
                        <span>
                          🗨️ <strong>{detalle.chat.mensajes.length}</strong>{" "}
                          mensaje{detalle.chat.mensajes.length !== 1 ? "s" : ""}
                        </span>
                      )}
                      {detalle.chat.creadoEn && (
                        <span>📅 {new Date(detalle.chat.creadoEn).toLocaleDateString()}</span>
                      )}
                    </div>

                    <ListaMensajes mensajes={detalle.chat.mensajes} />
                  </>
                ) : (
                  <p className="text-xs text-gray-400 italic">Sin chat asociado a esta denuncia.</p>
                )}
              </section>

              {/* Respuesta previa del admin */}
              {detalle.respondido && detalle.respuesta && (
                <section className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
                  <strong>Respuesta enviada:</strong> {detalle.respuesta}
                </section>
              )}

              {/* Feedback eliminación exitosa */}
              {eliminado && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700 font-medium">
                  ✅ Match y chat eliminados correctamente.
                </div>
              )}

              {/* Panel confirmación */}
              {confirmar && !eliminado && (
                <PanelConfirmarEliminacion
                  onConfirmar={handleEliminar}
                  onCancelar={() => setConfirmar(false)}
                  eliminando={eliminando}
                />
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!cargando && detalle && (
          <div className="border-t px-6 py-3 flex justify-end gap-3 shrink-0">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
            >
              Cerrar
            </button>

            {/* Botón visible solo si hay chat, no se eliminó aún y no estamos en confirmación */}
            {detalle.chat && !eliminado && !confirmar && (
              <button
                onClick={() => setConfirmar(true)}
                className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
              >
                Eliminar match y chat
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

ModalDetalleDenuncia.propTypes = {
  strikeId:    PropTypes.string.isRequired,
  onClose:     PropTypes.func.isRequired,
  onEliminado: PropTypes.func,
};

export default ModalDetalleDenuncia;