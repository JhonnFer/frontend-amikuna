// src/components/Dashboard_User/SwipeCards.jsx

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import useFetch from "../../hooks/useFetch";
import useSeguirUsuario from "../../hooks/useSeguirUsuario";
import { toast } from "react-toastify";
import { FaImages } from "react-icons/fa";
import VisorFotos from "../UI/VisorFotos";

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
      <div className="text-center mt-16 text-lg font-semibold bg-gradient-to-r from-[#ED213A] to-[#93291E] bg-clip-text text-transparent">
        Cargando candidatos...
      </div>
    );
  }

  if (!usuarioActual) {
    return (
      <div className="text-center mt-16 text-lg font-semibold bg-gradient-to-r from-[#ED213A] to-[#93291E] bg-clip-text text-transparent">
        No hay más candidatos por ahora.
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-2 w-full h-full">
      {/* CARD */}
      <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl h-full items-center justify-center">
        <AnimatePresence>
          <motion.div
            key={usuarioActual._id}
            variants={variants}
            initial="initial"
            animate={direction || "initial"}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col"
          >
            {/* FOTO PRINCIPAL — técnica Tinder */}
            <div
              className="relative w-full overflow-hidden shrink-0 object-fit-contain "
              style={{
                aspectRatio: "4/3",
                maxHeight: "80%",
                backgroundImage: `url(${usuarioActual.imagenPerfil})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

              {/* nombre sobre la foto */}
              <h2 className="absolute bottom-3 left-3 text-metal-white text-[28px] font-bold">
                {usuarioActual.nombre}
              </h2>

              <button
                onClick={() => setShowGallery(true)}
                className="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full hover:bg-gradient-to-b from-pink-700 to-orange-500"
              >
                <FaImages className="w-4 h-4" />
              </button>
            </div>

            {/* INFO */}
            <div className="flex flex-col flex-[4] justify-between p-3 text-center overflow-hidden">
              <div className="flex flex-col gap-0.5 overflow-hidden">
                <h3 className="text-base font-bold text-gray-800 truncate">
                  {usuarioActual.nombre}
                </h3>

                <p className="text-xs text-gray-500 truncate">
                  {usuarioActual.ubicacion?.ciudad},{" "}
                  {usuarioActual.ubicacion?.pais}
                </p>

                <p className="text-xs italic text-gray-600 line-clamp-2">
                  {usuarioActual.biografia || "Sin biografía"}
                </p>

                <p className="text-xs text-gray-700">
                  Género:{" "}
                  <span className="font-medium">{usuarioActual.genero}</span>
                </p>

                <p className="text-xs text-gray-700">
                  Orientación:{" "}
                  <span className="font-medium">
                    {usuarioActual.orientacion}
                  </span>
                </p>

                <p className="text-xs text-gray-700 line-clamp-1">
                  Intereses:{" "}
                  {usuarioActual.intereses?.join(", ") || "No definidos"}
                </p>
              </div>

              {/* BOTONES */}
              <div className="flex justify-center gap-6 mt-2 shrink-0">
                <button
                  onClick={() => handleSwipe("left")}
                  className="bg-red-500 text-white w-10 h-10 rounded-full shadow-lg hover:bg-red-600 transition"
                >
                  ❌
                </button>
                <button
                  onClick={() => handleSwipe("up")}
                  className="bg-green-500 text-white w-10 h-10 rounded-full shadow-lg hover:bg-green-600 transition"
                >
                  ❤️
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* MODAL GALERIA */}
      <AnimatePresence>
        {showGallery && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 shrink-0"
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
              className="bg-white rounded-xl w-auto flex flex-col"
              style={{
                maxWidth: "min(32rem, 100%)",
                height: "min(600px, 80vh)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* HEADER FIJO */}
              <div className="relative flex items-center justify-center p-4 border-b border-gray-100 shrink-0">
                <h2 className="text-lg font-bold">
                  Fotos de {usuarioActual.nombre}
                </h2>
                <button
                  onClick={() => setShowGallery(false)}
                  className="absolute right-4 text-gray-700 text-xl"
                >
                  ✖
                </button>
              </div>

              {/* GRID CON SCROLL */}
              <div className="overflow-y-auto flex-1 p-4">
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
                      className="w-full h-36 object-cover rounded-lg cursor-pointer hover:scale-105 transition"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <VisorFotos
        fotos={fotosUsuario}
        fotoSeleccionada={fotoSeleccionada}
        fotoIndex={fotoIndex}
        setFotoSeleccionada={setFotoSeleccionada}
        setFotoIndex={setFotoIndex}
      />
    </div>
  );
};

export default SwipeCards;
