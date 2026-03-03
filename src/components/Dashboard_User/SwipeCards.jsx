// src/components/SwipeCards.jsx

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useFetch from "../../hooks/useFetch"; // Usamos el hook useFetch
import { toast } from "react-toastify";
import  useSeguirUsuario  from "../../hooks/useSeguirUsuario"; // Usamos el hook de seguir usuario

const SwipeCards = () => {
  const { fetchDataBackend } = useFetch();
  const { seguirUsuario } = useSeguirUsuario();
  
  const [usuarios, setUsuarios] = useState([]);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(null);
  const [cargando, setCargando] = useState(true);

  const cargarUsuarios = async () => {
    try {
      // Endpoint corregido para los candidatos potenciales
      const data = await fetchDataBackend("estudiantes/matches");
      setUsuarios(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error.message);
      toast.error("No se pudieron cargar los candidatos.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // Función para manejar el swipe (like/dislike)
  const handleSwipe = async (dir) => {
    if (!usuarios[index]) return;

    // Solo hacemos la llamada a la API si el usuario hace "like"
    if (dir === 'up') {
        const idUsuarioAseguir = usuarios[index]._id;
        const data = await seguirUsuario(idUsuarioAseguir);
        
        if (data && data.huboMatch) {
            toast.info(`¡Es un match con ${usuarios[index].nombre}!`);
        }
    }

    setDirection(dir);
    setTimeout(() => {
      setIndex((prev) => prev + 1);
      setDirection(null);
    }, 400);
  };

  const variants = {
    left: { x: "-100%", opacity: 0, rotate: -20 },
    up: { y: "-100%", opacity: 0, scale: 0.8 },
    initial: { x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 },
  };

  const usuarioActual = usuarios[index];

  if (cargando) {
    return <div className="text-center mt-12">Cargando candidatos...</div>;
  }
  
  if (!usuarioActual) {
    return <div className="text-center mt-12">No hay más candidatos por ahora.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center px-4">
      <div className="relative w-full max-w-md sm:max-w-lg md:max-w-xl h-[60vh] flex items-center justify-center">
        <AnimatePresence>
          {usuarioActual && (
            <motion.div
              key={usuarioActual._id}
              variants={variants}
              initial="initial"
              animate={direction || "initial"}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-gray-300 rounded-xl shadow-lg p-6 sm:p-8 absolute w-full h-full flex flex-col items-center justify-center text-center"
            >
              {usuarioActual.imagenPerfil && (
                <img
                  src={usuarioActual.imagenPerfil}
                  alt="Foto de perfil"
                  className="w-28 h-28 sm:w-36 sm:h-36 object-cover rounded-full mb-4"
                />
              )}
              <h3 className="text-xl font-bold mb-1">{usuarioActual.nombre}</h3>
              <p className="text-sm italic text-gray-600 mb-2">
                {usuarioActual.biografia || "Sin biografía"}
              </p>
              {usuarioActual.ubicacion?.ciudad && (
                <p className="text-sm text-gray-500 mb-1">
                  {usuarioActual.ubicacion.ciudad},{" "}
                  {usuarioActual.ubicacion.pais}
                </p>
              )}
              <p className="text-sm text-gray-700 mb-1">
                Género:{" "}
                <span className="font-medium">{usuarioActual.genero}</span>
              </p>
              <p className="text-sm text-gray-700 mb-1">
                Orientación:{" "}
                <span className="font-medium">{usuarioActual.orientacion}</span>
              </p>
              <p className="text-sm text-gray-700 mb-2">
                Intereses:{" "}
                {usuarioActual.intereses?.join(", ") || "No definidos"}
              </p>
              <div className="flex gap-6 mt-6">
                <button 
                  onClick={() => handleSwipe("left")}
                  className="bg-[#E6C4CC]  text-white px-4 py-2 rounded-full shadow-md hover:bg-red-600 transition"
                >
                  
                  ❌
                </button>
                <button
                  onClick={() => handleSwipe("up")}
                  className="bg-[#E6C4CC] text-white px-4 py-2 rounded-full shadow-md hover:bg-green-600 transition"
                >
                  ❤️
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SwipeCards;