// src/components/Modals_Dashboards/ModalConfirmarEliminar.jsx
import PropTypes from "prop-types";
import { FiTrash2 } from "react-icons/fi";

const ModalConfirmarEliminar = ({ fotos, loadingFotos, onCancelar, onConfirmar }) => {
  if (!fotos || fotos.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4 flex flex-col items-center gap-4">

        <div className="bg-red-100 p-4 rounded-full">
          <FiTrash2 className="w-8 h-8 text-red-500" />
        </div>

        <h3 className="text-lg font-bold text-gray-800">
          ¿Eliminar {fotos.length > 1 ? `${fotos.length} fotos` : "esta foto"}?
        </h3>
        <p className="text-sm text-gray-500 text-center">
          Esta acción no se puede deshacer. ¿Estás seguro?
        </p>

        {/* Preview de fotos a eliminar */}
        <div className={`grid gap-1 w-full ${fotos.length === 1 ? "grid-cols-1" : "grid-cols-3"}`}>
          {fotos.slice(0, 6).map((foto, i) => (
            <img key={i} src={foto} className="w-full h-20 object-cover rounded-lg" />
          ))}
          {fotos.length > 6 && (
            <div className="w-full h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm font-medium">
              +{fotos.length - 6} más
            </div>
          )}
        </div>

        <div className="flex gap-3 w-full">
          <button
            onClick={onCancelar}
            className="flex-1 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition text-sm font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            disabled={loadingFotos}
            className="flex-1 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition text-sm font-medium disabled:opacity-50"
          >
            {loadingFotos ? "Eliminando..." : `Sí, eliminar${fotos.length > 1 ? " todas" : ""}`}
          </button>
        </div>

      </div>
    </div>
  );
};

ModalConfirmarEliminar.propTypes = {
  fotos: PropTypes.arrayOf(PropTypes.string),
  loadingFotos: PropTypes.bool,
  onCancelar: PropTypes.func.isRequired,
  onConfirmar: PropTypes.func.isRequired,
};

export default ModalConfirmarEliminar;