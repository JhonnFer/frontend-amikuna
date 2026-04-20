import { useState } from "react";
import useTesoreria from "../../hooks/Admin/useTesoreria";

const Tesoreria = () => {
  const { tesoreria, loading, error, guardando, registrarGasto, ajustarSaldo } = useTesoreria();

  const [modalGasto, setModalGasto]   = useState(false);
  const [modalAjuste, setModalAjuste] = useState(false);
  const [monto, setMonto]             = useState("");
  const [razon, setRazon]             = useState("");
  const [msgError, setMsgError]       = useState("");

  const resetForm = () => { setMonto(""); setRazon(""); setMsgError(""); };

  const handleGasto = async () => {
    if (!monto || !razon) return setMsgError("Completa todos los campos");
    const res = await registrarGasto(Number(monto), razon);
    if (res.ok) { setModalGasto(false); resetForm(); }
    else setMsgError(res.msg);
  };

  const handleAjuste = async () => {
    if (!monto || !razon) return setMsgError("Completa todos los campos");
    const res = await ajustarSaldo(Number(monto), razon);
    if (res.ok) { setModalAjuste(false); resetForm(); }
    else setMsgError(res.msg);
  };

  if (loading) return <p className="text-gray-500">Cargando tesorería...</p>;
  if (error)   return <p className="text-red-500">{error}</p>;
  if (!tesoreria) return null;

  return (
    <div className="space-y-6">

      {/* SALDO */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <p className="text-sm text-gray-500 uppercase tracking-wide">Saldo disponible</p>
          <p className="text-4xl font-extrabold text-green-600">${tesoreria.saldoDisponible?.toFixed(2)}</p>
          <p className="text-xs text-gray-400 mt-1">Total recaudado: ${tesoreria.totalRecaudado?.toFixed(2)}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { resetForm(); setModalGasto(true); }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition"
          >
            Registrar gasto
          </button>
          <button
            onClick={() => { resetForm(); setModalAjuste(true); }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition"
          >
            Ajuste / Ingreso
          </button>
        </div>
      </div>

      {/* APORTES */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Aportes recibidos</h3>
        {tesoreria.aportes?.length === 0 ? (
          <p className="text-gray-400 text-sm">No hay aportes registrados aún.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2">Usuario</th>
                  <th className="pb-2">Monto</th>
                  <th className="pb-2">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {tesoreria.aportes?.map((a) => (
                  <tr key={a._id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-2">{a.userId?.nombre} {a.userId?.apellido}</td>
                    <td className="py-2 text-green-600 font-semibold">${a.amount?.toFixed(2)}</td>
                    <td className="py-2 text-gray-400">{new Date(a.createdAt).toLocaleDateString("es-EC")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MOVIMIENTOS */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Movimientos</h3>
        {tesoreria.movimientos?.length === 0 ? (
          <p className="text-gray-400 text-sm">Sin movimientos registrados.</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {[...tesoreria.movimientos].reverse().map((m, i) => (
              <div key={i} className="flex justify-between items-center border-b pb-2 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-700">{m.razon}</p>
                  <p className="text-xs text-gray-400">{new Date(m.createdAt || Date.now()).toLocaleDateString("es-EC")}</p>
                </div>
                <span className={`font-bold text-sm ${m.tipo === "gasto" ? "text-red-500" : "text-green-500"}`}>
                  {m.tipo === "gasto" ? "-" : "+"}${m.monto?.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL GASTO */}
      {modalGasto && (
        <ModalTesoreria
          titulo="Registrar gasto"
          descripcion="Resta del saldo disponible."
          monto={monto}
          razon={razon}
          setMonto={setMonto}
          setRazon={setRazon}
          msgError={msgError}
          guardando={guardando}
          onConfirmar={handleGasto}
          onCancelar={() => { setModalGasto(false); resetForm(); }}
          montoNegativo={false}
        />
      )}

      {/* MODAL AJUSTE */}
      {modalAjuste && (
        <ModalTesoreria
          titulo="Ajuste / Ingreso en efectivo"
          descripcion="Positivo (+) suma al saldo. Negativo (-) corrige un error."
          monto={monto}
          razon={razon}
          setMonto={setMonto}
          setRazon={setRazon}
          msgError={msgError}
          guardando={guardando}
          onConfirmar={handleAjuste}
          onCancelar={() => { setModalAjuste(false); resetForm(); }}
          montoNegativo={true}
        />
      )}
    </div>
  );
};

const ModalTesoreria = ({
  titulo, descripcion, monto, razon,
  setMonto, setRazon, msgError,
  guardando, onConfirmar, onCancelar, montoNegativo
}) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 space-y-4">
      <h3 className="text-lg font-bold text-gray-800">{titulo}</h3>
      <p className="text-xs text-gray-500">{descripcion}</p>

      <div>
        <label className="text-xs font-semibold text-gray-600 uppercase">
          Monto {montoNegativo ? "(usa - para corrección)" : "($)"}
        </label>
        <input
          type="number"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          placeholder={montoNegativo ? "ej: 50 o -10" : "ej: 40"}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-600 uppercase">Razón</label>
        <input
          type="text"
          value={razon}
          onChange={(e) => setRazon(e.target.value)}
          placeholder="ej: Corrección gasto hosting"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {msgError && <p className="text-red-500 text-xs">{msgError}</p>}

      <div className="flex gap-3 pt-2">
        <button
          onClick={onCancelar}
          className="flex-1 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirmar}
          disabled={guardando}
          className="flex-1 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition disabled:opacity-60"
        >
          {guardando ? "Guardando..." : "Confirmar"}
        </button>
      </div>
    </div>
  </div>
);

export default Tesoreria;