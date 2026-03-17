import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import { useRef, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import {  useEffect } from "react";

const VisorFotos = ({
  fotos,
  fotoSeleccionada,
  fotoIndex,
  setFotoSeleccionada,
  setFotoIndex,
  onReemplazar, // ← nuevo prop opcional
}) => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [archivoNuevo, setArchivoNuevo] = useState(null);

  const handleSeleccionarArchivo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setArchivoNuevo(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleConfirmar = async () => {
    if (!archivoNuevo) return;
    await onReemplazar(fotoIndex, archivoNuevo);
    setPreview(null);
    setArchivoNuevo(null);
    setFotoSeleccionada(null);
  };

  const handleCancelarPreview = () => {
    setPreview(null);
    setArchivoNuevo(null);
  };
  useEffect(() => {
  if (!fotoSeleccionada) return;

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft" || e.key === "a") {
      if (fotoIndex > 0) {
        setFotoIndex((prev) => prev - 1);
        setFotoSeleccionada(fotos[fotoIndex - 1]);
      }
    }
    if (e.key === "ArrowRight" || e.key === "d") {
      if (fotoIndex < fotos.length - 1) {
        setFotoIndex((prev) => prev + 1);
        setFotoSeleccionada(fotos[fotoIndex + 1]);
      }
    }
    if (e.key === "Escape") {
      setFotoSeleccionada(null);
      setPreview(null);
      setArchivoNuevo(null);
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [fotoSeleccionada, fotoIndex, fotos]);

  return (
    <AnimatePresence>
      {fotoSeleccionada && (
        <motion.div
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-[60]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            setFotoSeleccionada(null);
            setPreview(null);
            setArchivoNuevo(null);
          }}
        >
          {/* BOTON IZQUIERDA */}
          {fotoIndex > 0 && !preview && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFotoIndex((prev) => prev - 1);
                setFotoSeleccionada(fotos[fotoIndex - 1]);
              }}
              className="absolute left-6 text-white text-4xl"
            >
              ←
            </button>
          )}

          <div
            className="flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* IMAGEN — preview o foto actual */}
            <motion.img
              src={preview || fotoSeleccionada}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="w-[55vw] h-[55vh] object-contain rounded-lg"
            />

            {/* BOTONES */}
            {!preview ? (
              <>
                {onReemplazar && (
                  <button
                    onClick={() => inputRef.current.click()}
                    className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition text-sm"
                    title="Reemplazar foto"
                  >
                    <FiRefreshCw className="w-5 h-5" />
                  </button>
                )}
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleSeleccionarArchivo}
                />
              </>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleConfirmar}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm"
                >
                  ✅ Confirmar
                </button>
                <button
                  onClick={handleCancelarPreview}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition text-sm"
                >
                  ❌ Cancelar
                </button>
              </div>
            )}
          </div>

          {/* BOTON DERECHA */}
          {fotoIndex < fotos.length - 1 && !preview && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFotoIndex((prev) => prev + 1);
                setFotoSeleccionada(fotos[fotoIndex + 1]);
              }}
              className="absolute right-6 text-white text-4xl"
            >
              →
            </button>
          )}

          {/* BOTON CERRAR */}
          {!preview && (
            <button
              onClick={() => setFotoSeleccionada(null)}
              className="absolute top-6 right-6 text-white text-2xl"
            >
              ✕
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

VisorFotos.propTypes = {
  fotos: PropTypes.arrayOf(PropTypes.string).isRequired,
  fotoSeleccionada: PropTypes.string,
  fotoIndex: PropTypes.number.isRequired,
  setFotoSeleccionada: PropTypes.func.isRequired,
  setFotoIndex: PropTypes.func.isRequired,
  onReemplazar: PropTypes.func, // opcional — solo aparece si se pasa
};

export default VisorFotos;