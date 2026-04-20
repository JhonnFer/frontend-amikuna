// src/components/Dashboard_User/BotonNotificaciones.jsx
import { useState, useEffect } from "react";
import { FaBell, FaCheck } from "react-icons/fa";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import useNotificaciones from "../../hooks/useNotificaciones";
import useSeguirUsuario from "../../hooks/useSeguirUsuario";

const BotonNotificaciones = ({ navbarRef }) => {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [menuStyle, setMenuStyle] = useState({});

  const { notificaciones, loading, marcarLeido, obtenerNotificaciones } =
    useNotificaciones();
  const { seguirUsuario, cargando: cargandoSeguir } = useSeguirUsuario();

  const noLeidas = Array.isArray(notificaciones)
    ? notificaciones.filter((n) => !n.leido).length
    : 0;

  useEffect(() => {
    if (!mostrarMenu || !navbarRef?.current) return;

    const updatePosition = () => {
      const rect = navbarRef.current.getBoundingClientRect();

      setMenuStyle({
        position: "fixed",
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width / 1.25,
        zIndex: 999,
      });
    };

    // 🔥 cálculo inicial
    updatePosition();

    // 🔥 escucha cambios reales del layout
    const observer = new ResizeObserver(updatePosition);
    observer.observe(navbarRef.current);

    // 🔥 opcional pero recomendado: scroll también
    window.addEventListener("scroll", updatePosition);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updatePosition);
    };
  }, [mostrarMenu, navbarRef]);

  const handleAceptarSolicitud = async (notificacion) => {
    try {
      const idSolicitante = notificacion.fromUser?._id || notificacion.fromUser;
      if (!idSolicitante) {
        toast.error("No se pudo identificar al usuario.");
        return;
      }
      const data = await seguirUsuario(idSolicitante);
      if (data?.huboMatch) {
        toast.success("¡Match confirmado! 🎉");
      } else {
        toast.info("Ahora sigues a este usuario.");
      }
      await marcarLeido(notificacion._id);
    } catch (error) {
      console.error("Error al aceptar:", error);
    }
  };

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && setMostrarMenu(false);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => {
          setMostrarMenu(!mostrarMenu);
          if (!mostrarMenu) obtenerNotificaciones();
        }}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-all active:scale-95"
      >
        <FaBell className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
        {noLeidas > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center ring-2 ring-white">
            {noLeidas > 9 ? "+9" : noLeidas}
          </span>
        )}
      </button>

      <AnimatePresence>
        {mostrarMenu && (
          <>
            <motion.div
              className="fixed inset-0 z-[998] bg-black/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMostrarMenu(false)}
            />

            <motion.div
              style={menuStyle}
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-gradient-to-br from-red-100 via-orange-50 to-orange-100 border border-gray-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* HEADER */}
              <div className="p-4 border-b bg-white/60 backdrop-blur flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <FaBell className="w-5 h-5 text-gray-600" />
                  <h3 className="text-sm font-bold text-gray-800 tracking-wide">
                    Notificaciones
                  </h3>
                </div>

                <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">
                  {noLeidas} nuevas
                </span>
              </div>

              {/* LISTA */}
              <ul className="max-h-[50vh] overflow-y-auto scrollbar-eventos divide-y divide-gray-100">
                {/* LOADING */}
                {loading && (
                  <li className="p-6 space-y-3 animate-pulse">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-4 bg-gray-200 rounded w-full" />
                    ))}
                  </li>
                )}

                {/* VACÍO */}
                {!loading && notificaciones.length === 0 && (
                  <li className="p-10 text-center text-gray-400 text-sm">
                    <div className="flex flex-col items-center gap-3">
                      <FaBell className="text-gray-200 w-10 h-10" />
                      <p>No tienes notificaciones</p>
                    </div>
                  </li>
                )}

                {/* NOTIFICACIONES */}
                {!loading &&
                  notificaciones.map((n) => (
                    <li
                      key={n._id}
                      className={`p-4 flex flex-col gap-3 transition-all duration-200 hover:bg-white/60 ${
                        n.leido ? "opacity-70" : "bg-blue-50/40"
                      }`}
                    >
                      {/* MENSAJE */}
                      <div className="flex justify-between items-start gap-3">
                        <p
                          className={`text-sm leading-snug ${
                            n.leido
                              ? "text-gray-500"
                              : "text-gray-800 font-medium"
                          }`}
                        >
                          {n.mensaje}
                        </p>

                        {!n.leido && (
                          <span className="h-2.5 w-2.5 bg-blue-500 rounded-full mt-1 shrink-0 animate-pulse" />
                        )}
                      </div>

                      {/* ACCIONES */}
                      <div className="flex items-center gap-3 flex-wrap">
                        {n.tipo === "seguidor" && !n.leido ? (
                          <>
                            <button
                              onClick={() => handleAceptarSolicitud(n)}
                              disabled={cargandoSeguir}
                              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full hover:from-blue-600 hover:to-blue-700 shadow-sm transition-all disabled:opacity-50 active:scale-95"
                            >
                              <FaCheck size={10} /> Seguir
                            </button>

                            <button
                              onClick={() => marcarLeido(n._id)}
                              className="text-xs text-gray-500 font-medium hover:text-gray-700 transition"
                            >
                              Ignorar
                            </button>
                          </>
                        ) : (
                          !n.leido && (
                            <button
                              onClick={() => marcarLeido(n._id)}
                              className="text-[11px] text-blue-600 font-semibold uppercase tracking-tight hover:text-blue-800 transition"
                            >
                              Marcar leída
                            </button>
                          )
                        )}
                      </div>
                    </li>
                  ))}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

BotonNotificaciones.propTypes = {
  navbarRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }),
};

export default BotonNotificaciones;
