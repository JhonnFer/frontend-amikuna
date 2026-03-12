// src/components/Dashboard_User/SwipeCards.jsx

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import useFetch from "../../hooks/useFetch";
import useSeguirUsuario from "../../hooks/useSeguirUsuario";
import { toast } from "react-toastify";
import { FaImages } from "react-icons/fa";

const SwipeCards = () => {
  const { fetchDataBackend } = useFetch();
  const { seguirUsuario } = useSeguirUsuario();

  const [usuarios, setUsuarios] = useState([]);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(null);
  const [cargando, setCargando] = useState(true);

  const [showGallery, setShowGallery] = useState(false);
  const [fotoSeleccionada, setFotoSeleccionada] = useState(null);
  const [fotoIndex, setFotoIndex] = useState(0);

  const cargarUsuarios = async () => {
    try {
      const data = await fetchDataBackend("estudiantes/matches");
      setUsuarios(data);
    } catch (error) {
      console.error(error);
      toast.error("No se pudieron cargar los candidatos.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleSwipe = async (dir) => {
    if (!usuarios[index]) return;

    if (dir === "up") {
      const idUsuarioAseguir = usuarios[index]._id;

      const data = await seguirUsuario(idUsuarioAseguir);

      if (data && data.huboMatch) {
        toast.success(`💖 ¡Match con ${usuarios[index].nombre}!`);
      }
    }

    setDirection(dir);

    setTimeout(() => {
      setIndex((prev) => prev + 1);
      setDirection(null);
    }, 400);
  };

  const variants = {
    left: { x: "-120%", opacity: 0, rotate: -25 },
    up: { y: "-120%", opacity: 0, scale: 0.8 },
    initial: { x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 },
  };

  const usuarioActual = usuarios[index];
  const fotosUsuario = [
    usuarioActual?.imagenPerfil,
    ...(usuarioActual?.imagenesGaleria || []),
  ];

  if (cargando) {
    return (
      <div className="text-center mt-16 text-lg font-semibold">
        Cargando candidatos...
      </div>
    );
  }

  if (!usuarioActual) {
    return (
      <div className="text-center mt-16 text-lg font-semibold">
        No hay más candidatos por ahora.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 py-6 w-full">
      {/* CARD */}
      <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl h-[70vh] flex items-center justify-center">
        <AnimatePresence>
          <motion.div
            key={usuarioActual._id}
            variants={variants}
            initial="initial"
            animate={direction || "initial"}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute w-full h-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col"
          >
            {/* FOTO PRINCIPAL */}
            <div className="relative w-full h-[55%]">
              <img
                src={usuarioActual.imagenPerfil}
                alt="perfil"
                className="w-full h-full object-cover"
              />

              {/* BOTON GALERIA */}
              <button
                onClick={() => setShowGallery(true)}
                className="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full hover:bg-black"
              >
                <FaImages size={20} />
              </button>
            </div>

            {/* INFO */}
            <div className="flex flex-col justify-between flex-1 p-4 text-center">
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {usuarioActual.nombre}
                </h3>

                <p className="text-sm text-gray-500 mb-2">
                  {usuarioActual.ubicacion?.ciudad},{" "}
                  {usuarioActual.ubicacion?.pais}
                </p>

                <p className="text-sm italic text-gray-600 mb-2">
                  {usuarioActual.biografia || "Sin biografía"}
                </p>

                <p className="text-sm text-gray-700">
                  Género:{" "}
                  <span className="font-medium">{usuarioActual.genero}</span>
                </p>

                <p className="text-sm text-gray-700">
                  Orientación:{" "}
                  <span className="font-medium">
                    {usuarioActual.orientacion}
                  </span>
                </p>

                <p className="text-sm text-gray-700">
                  Intereses:{" "}
                  {usuarioActual.intereses?.join(", ") || "No definidos"}
                </p>
              </div>

              {/* BOTONES */}
              <div className="flex justify-center gap-8 mt-4">
                <button
                  onClick={() => handleSwipe("left")}
                  className="bg-red-500 text-white w-14 h-14 rounded-full text-xl shadow-lg hover:bg-red-600 transition"
                >
                  ❌
                </button>

                <button
                  onClick={() => handleSwipe("up")}
                  className="bg-green-500 text-white w-14 h-14 rounded-full text-xl shadow-lg hover:bg-green-600 transition"
                >
                  ❤️
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* MODAL GALERIA */}
      {/* MODAL GALERIA */}
      <AnimatePresence>
        {showGallery && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
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
              className="bg-white p-6 rounded-xl max-w-lg w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowGallery(false)}
                className="absolute top-3 right-3 text-gray-700 text-xl"
              >
                ✖
              </button>

              <h2 className="text-lg font-bold mb-4 text-center">
                Fotos de {usuarioActual.nombre}
              </h2>

              <div className="grid grid-cols-2 gap-3">
                {[
                  usuarioActual.imagenPerfil,
                  ...(usuarioActual.imagenesGaleria || []),
                ].map((foto, i) => (
                  <img
  key={i}
  src={foto}
  onClick={() => {
    setFotoSeleccionada(foto);
    setFotoIndex(i);
  }}
  className="w-full h-40 object-cover rounded-lg cursor-pointer hover:scale-105 transition"
/>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* VISOR FOTO GRANDE */}
<AnimatePresence>
  {fotoSeleccionada && (
    <motion.div
      className="fixed inset-0 bg-black/95 flex items-center justify-center z-[60]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setFotoSeleccionada(null)}
    >

      {/* BOTON IZQUIERDA */}
      {fotoIndex > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setFotoIndex((prev) => prev - 1);
            setFotoSeleccionada(fotosUsuario[fotoIndex - 1]);
          }}
          className="absolute left-6 text-white text-4xl"
        >
          ←
        </button>
      )}

      {/* IMAGEN GRANDE */}
      <motion.img
        src={fotoSeleccionada}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        transition={{ duration: 0.3 }}
        className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
      />

      {/* BOTON DERECHA */}
      {fotoIndex < fotosUsuario.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setFotoIndex((prev) => prev + 1);
            setFotoSeleccionada(fotosUsuario[fotoIndex + 1]);
          }}
          className="absolute right-6 text-white text-4xl"
        >
          →
        </button>
      )}

      {/* BOTON CERRAR */}
      <button
        onClick={() => setFotoSeleccionada(null)}
        className="absolute top-6 right-6 text-white text-2xl"
      >
        ✕
      </button>

    </motion.div>
  )}
</AnimatePresence>
    </div>
  );
};

export default SwipeCards;
