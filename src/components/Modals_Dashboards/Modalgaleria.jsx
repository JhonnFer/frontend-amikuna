// src/components/Modals_Dashboards/ModalGaleria.jsx
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "./modal";
import { FiTrash2 } from "react-icons/fi";
import { FaImages } from "react-icons/fa";

const ModalGaleria = ({
  isOpen,
  onClose,
  profile,
  loadingFotos,
  setFotosSeleccionadas,
  subirFotos,
  setFotoSeleccionada,
  setFotoIndex,
  setFotosAEliminar,
  resetModoEliminarRef, // ← ref que expone el reset al Dashboard
}) => {
  const [modoEliminar, setModoEliminar] = useState(false);
  const [seleccionadas, setSeleccionadas] = useState([]);

  // Expone la función de reset al Dashboard via ref
  useEffect(() => {
    if (resetModoEliminarRef) {
      resetModoEliminarRef.current = () => {
        setModoEliminar(false);
        setSeleccionadas([]);
      };
    }
  }, [resetModoEliminarRef]);

  const toggleSeleccion = (foto) => {
    setSeleccionadas((prev) =>
      prev.includes(foto) ? prev.filter((f) => f !== foto) : [...prev, foto]
    );
  };

  const handleCancelarModo = () => {
    setModoEliminar(false);
    setSeleccionadas([]);
  };

  const handleConfirmarEliminar = () => {
    if (seleccionadas.length === 0) return;
    setFotosAEliminar(seleccionadas); // manda el array al Dashboard → abre confirmación
  };

  return (
    <Modal isOpen={isOpen} title="Agregar fotos a tu galería" icon={<FaImages size={22} />} showCloseButton={true} onClose={onClose}>

      {loadingFotos && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-lg">
          <div className="w-14 h-14 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin" />
          <p className="mt-4 text-sm text-rose-600 font-semibold animate-pulse tracking-wide">
            Procesando...
          </p>
        </div>
      )}

      <div className="flex flex-col gap-4 overflow-hidden">
        <input
          type="file"
          multiple
          accept="image/*"
          className="border p-2 rounded"
          onChange={(e) => setFotosSeleccionadas(Array.from(e.target.files))}
        />

        <button
          onClick={async () => {
            const res = await subirFotos();
            if (!res.ok) alert(res.msg);
          }}
          disabled={loadingFotos}
          className="bg-gradient-to-r from-pink-600 to-orange-400 text-white py-2 rounded hover:from-pink-700 hover:to-orange-500 transitiondisabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loadingFotos ? "Subiendo..." : "Subir Fotos"}
        </button>

        {profile?.imagenesGaleria?.length > 0 && (
          <>
            {/* Barra de acciones */}
            <div className="flex overflow-hidden items-center justify-between">
              {modoEliminar ? (
                <>
                  <span className="text-sm text-gray-500">
                    {seleccionadas.length} foto{seleccionadas.length !== 1 ? "s" : ""} seleccionada{seleccionadas.length !== 1 ? "s" : ""}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancelarModo}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleConfirmarEliminar}
                      disabled={seleccionadas.length === 0 || loadingFotos}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiTrash2 className="w-4 h-4" />
                      Eliminar {seleccionadas.length > 0 ? `(${seleccionadas.length})` : ""}
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => setModoEliminar(true)}
                  className="flex items-center gap-2 ml-auto px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                >
                  <FiTrash2 className="w-4 h-4" />
                  Seleccionar fotos
                </button>
              )}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 overflow-y-auto  max-h-[40vh] scrollbar-eventos">
              {profile.imagenesGaleria.map((foto, i) => {
                const estaSeleccionada = seleccionadas.includes(foto);
                return (
                  <div
                    key={i}
                    onClick={() => {
                      if (modoEliminar) {
                        toggleSeleccion(foto);
                      } else {
                        setFotoSeleccionada(foto);
                        setFotoIndex(i);
                      }
                    }}
                    className={`relative overflow-hidden rounded cursor-pointer transition duration-200
                      ${estaSeleccionada ? "ring-4 ring-red-500 opacity-70" : ""}
                    `}
                  >
                    <img
                      src={foto}
                      className={`w-full h-35 object-cover rounded transition duration-300
                        ${!modoEliminar ? "hover:scale-105" : ""}
                      `}
                    />

                    {/* Checkbox visual en modo eliminar */}
                    {modoEliminar && (
                      <div className={`absolute top-1.5 left-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition
                        ${estaSeleccionada
                          ? "bg-red-500 border-red-500 text-white"
                          : "bg-white/80 border-gray-400"
                        }`}
                      >
                        {estaSeleccionada && (
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

ModalGaleria.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  profile: PropTypes.object,
  loadingFotos: PropTypes.bool,
  setFotosSeleccionadas: PropTypes.func.isRequired,
  subirFotos: PropTypes.func.isRequired,
  setFotoSeleccionada: PropTypes.func.isRequired,
  setFotoIndex: PropTypes.func.isRequired,
  setFotosAEliminar: PropTypes.func.isRequired,
  resetModoEliminarRef: PropTypes.object,
};

export default ModalGaleria;