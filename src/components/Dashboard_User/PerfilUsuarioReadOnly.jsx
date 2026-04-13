import PropTypes from "prop-types";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaImages } from "react-icons/fa";
import VisorFotos from "../UI/VisorFotos";

const PerfilUsuarioReadOnly = ({ perfil, onCerrar }) => {
  const [showGallery, setShowGallery] = useState(false);
  const [fotoSeleccionada, setFotoSeleccionada] = useState(null);
  const [fotoIndex, setFotoIndex] = useState(0);

  if (!perfil) return null;

  const fotosUsuario = [
    perfil.imagenPerfil,
    ...(perfil.imagenesGaleria || []),
  ];

  return (
    <>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10" onClick={onCerrar} />

      {/* Panel */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl z-20 shadow-2xl animate-slide-up flex flex-col max-h-[90%] overflow-hidden">

        {/* FOTO PRINCIPAL — misma técnica SwipeCards */}
        <div
          className="bg-gray-100 relative w-full overflow-hidden shrink-0"
          style={{
            aspectRatio: "16/9",
            backgroundImage: `url(${perfil.imagenPerfil})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        >
          {/* Gradiente inferior */}
          <div className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

          {/* Nombre sobre la foto */}
          <h2 className="absolute bottom-3 left-3 text-white text-xl font-bold drop-shadow">
            {perfil.nombre}
          </h2>

          {/* Botón galería */}
          <button
            onClick={() => setShowGallery(true)}
            className="absolute top-3 right-3 bg-black/80 text-white p-2 rounded-full hover:bg-gradient-to-b from-pink-700 to-orange-500 transition"
          >
            <FaImages className="w-4 h-4" />
          </button>

          {/* Botón cerrar */}
          <button
            onClick={onCerrar}
            className="absolute top-3 left-3 bg-black/80 text-white p-2 rounded-full hover:bg-black/60 transition"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        {/* INFO — igual que SwipeCards */}
        <div className="flex flex-col p-4 gap-1 overflow-y-auto">
          <h3 className="text-2xl font-bold text-gray-800 truncate text-center">
            {perfil.nombre}
          </h3>

          {perfil.ubicacion?.ciudad && (
            <p className="text-xs text-gray-500 text-center truncate">
              {perfil.ubicacion.ciudad}, {perfil.ubicacion.pais}
            </p>
          )}

          {perfil.biografia && (
            <p className="text-xs italic text-gray-600 line-clamp-2 text-center">
              {perfil.biografia}
            </p>
          )}

          {perfil.genero && (
            <p className="text-xs text-gray-700">
              Género: <span className="font-medium">{perfil.genero}</span>
            </p>
          )}

          {perfil.orientacion && (
            <p className="text-xs text-gray-700">
              Orientación:{" "}
              <span className="font-medium">{perfil.orientacion}</span>
            </p>
          )}

          {perfil.intereses?.length > 0 && (
            <p className="text-xs text-gray-700 line-clamp-1">
              Intereses: {perfil.intereses.join(", ")}
            </p>
          )}

          {/* Seguidores / Siguiendo */}
          <div className="flex gap-6 mt-3 items-center justify-center border-t pt-3">
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold bg-gradient-to-r from-pink-600 to-orange-400 bg-clip-text text-transparent">
                {perfil.seguidores?.length ?? 0}
              </span>
              <span className="text-xs text-gray-500 font-medium">
                Seguidores
              </span>
            </div>
            <div className="w-px bg-gray-300 h-8" />
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold bg-gradient-to-r from-pink-600 to-orange-400 bg-clip-text text-transparent">
                {perfil.siguiendo?.length ?? 0}
              </span>
              <span className="text-xs text-gray-500 font-medium">
                Siguiendo
              </span>
            </div>
          </div>

          {/* Botón cerrar */}
          <button
            onClick={onCerrar}
            className="mt-3 w-full py-2 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition"
          >
            Cerrar
          </button>
        </div>
      </div>

      {/* MODAL GALERÍA — igual que SwipeCards */}
      <AnimatePresence>
        {showGallery && (
          <motion.div
            className="absolute inset-0 bg-black/80 flex items-center justify-center z-30 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowGallery(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl w-full flex flex-col"
              style={{ maxHeight: "80%" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header galería */}
              <div className="relative flex items-center justify-center p-4 border-b border-gray-100 shrink-0">
                <h2 className="text-base font-bold">
                  Fotos de {perfil.nombre}
                </h2>
                <button
                  onClick={() => setShowGallery(false)}
                  className="absolute right-4 text-gray-700 text-xl"
                >
                  ✖
                </button>
              </div>

              {/* Grid fotos */}
              <div className="overflow-y-auto flex-1 p-4">
                <div className="grid grid-cols-2 gap-3">
                  {fotosUsuario.map((foto, i) => (
                    <img
                      key={i}
                      src={foto}
                      onClick={() => {
                        setFotoSeleccionada(foto);
                        setFotoIndex(i);
                      }}
                      className="w-full h-36 object-cover rounded-lg cursor-pointer hover:scale-105 transition"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visor de fotos */}
      <VisorFotos
        fotos={fotosUsuario}
        fotoSeleccionada={fotoSeleccionada}
        fotoIndex={fotoIndex}
        setFotoSeleccionada={setFotoSeleccionada}
        setFotoIndex={setFotoIndex}
      />
    </>
  );
};

PerfilUsuarioReadOnly.propTypes = {
  perfil: PropTypes.object.isRequired,
  onCerrar: PropTypes.func.isRequired,
};

export default PerfilUsuarioReadOnly;