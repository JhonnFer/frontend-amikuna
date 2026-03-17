import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

const VisorFotos = ({ fotos, fotoSeleccionada, fotoIndex, setFotoSeleccionada, setFotoIndex }) => {
  return (
    <AnimatePresence>
      {fotoSeleccionada && (
        <motion.div
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-[60]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setFotoSeleccionada(null)}
        >
          {fotoIndex > 0 && (
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

          <motion.img
            src={fotoSeleccionada}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="max-h-full max-w-[90vw] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          {fotoIndex < fotos.length - 1 && (
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

          <button
            onClick={() => setFotoSeleccionada(null)}
            className="absolute top-6 right-6 text-white text-2xl"
          >
            ✕
          </button>
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
};

export default VisorFotos;