import { useEffect } from "react";
import { FaBell, FaCheck } from "react-icons/fa";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import useBotonNotificacionesLogic from "../hooks/useBotonNotificacionesLogic";

const BotonNotificaciones = ({ navbarRef }) => {
  const {
    notificaciones,
    loading,
    marcarLeido,
    cargando,
    mostrarMenu,
    setMostrarMenu,
    menuStyle,
    setMenuStyle,
    noLeidas,
    yaSigue,
    handleAceptarSolicitud,
    abrirNotificaciones,
    handleMarcarTodas,
  } = useBotonNotificacionesLogic();

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

    updatePosition();
    const observer = new ResizeObserver(updatePosition);
    observer.observe(navbarRef.current);
    window.addEventListener("scroll", updatePosition);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updatePosition);
    };
  }, [mostrarMenu, navbarRef, setMenuStyle]);

  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && setMostrarMenu(false);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setMostrarMenu]);

  return (
    <div className="relative inline-block text-left">
      {/* BOTÓN */}
      <button
        onClick={abrirNotificaciones}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-all active:scale-95"
      >
        <FaBell className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
        {noLeidas > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center ring-2 ring-white">
            {noLeidas > 9 ? "+9" : noLeidas}
          </span>
        )}
      </button>

      {/* BACKDROP */}
      <AnimatePresence>
        {mostrarMenu && (
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-[998] bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMostrarMenu(false)}
          />
        )}
      </AnimatePresence>

      {/* PANEL */}
      <AnimatePresence>
        {mostrarMenu && (
          <motion.div
            key="panel"
            style={menuStyle}
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-gradient-to-br from-red-100 via-orange-50 to-orange-100 border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* HEADER */}
            <div className="p-4 border-b bg-black/70 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FaBell className="w-4 h-4 text-white" />
                <h3 className="text-sm font-bold text-white">Notificaciones</h3>
                {noLeidas > 0 && (
                <button
                  onClick={handleMarcarTodas}
                  className="text-xs text-white bg-green-500 hover:bg-green-600 px-2 py-1 rounded-full transition"
                >
                  Marcar todas
                </button>
              )}
              </div>
              
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">
                {noLeidas} nuevas
              </span>
              
            </div>

            {/* LISTA */}
            <ul className="max-h-[50vh] overflow-y-auto divide-y divide-gray-100">
              {loading && (
                <li className="p-6 space-y-3 animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded w-full" />
                  ))}
                </li>
              )}

              {!loading && notificaciones.length === 0 && (
                <li className="p-10 text-center text-gray-400 text-sm">
                  <div className="flex flex-col items-center gap-3">
                    <FaBell className="text-gray-200 w-10 h-10" />
                    <p>No tienes notificaciones</p>
                  </div>
                </li>
              )}

              {!loading &&
                notificaciones
                  .filter((n) => n && typeof n === "object" && n._id)
                  .map((n) => (
                    <motion.li
                      key={n._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`p-4 flex flex-col gap-2 hover:bg-white/60 transition-colors ${
                        n.leido ? "opacity-60" : "bg-blue-50/40"
                      }`}
                    >
                      {/* MENSAJE */}
                      <div className="flex justify-between items-start gap-3">
                        <p
                          className={
                            n.leido
                              ? "text-gray-400 text-sm"
                              : "text-gray-800 font-medium text-sm"
                          }
                        >
                          {n.mensaje}
                        </p>
                        {!n.leido && (
                          <span className="h-2.5 w-2.5 bg-blue-500 rounded-full mt-1 shrink-0 animate-pulse" />
                        )}
                      </div>

                      {/* ACCIONES */}
                      <div className="flex gap-2 flex-wrap items-center">
                        {n.tipo === "match" && !n.leido && (
                          <button
                            onClick={() => marcarLeido(n._id)}
                            className="text-green-600 text-xs font-semibold hover:text-green-800 transition"
                          >
                            ¡Ver match! ✓
                          </button>
                        )}

                        {n.tipo === "seguidor" && !n.leido && (
                          <>
                            {yaSigue(n.fromUser) ? (
                              <div className="flex items-center gap-2">
                                <span className="text-green-600 text-xs font-semibold">
                                  Ya lo sigues ✓
                                </span>
                                <button
                                  onClick={() => marcarLeido(n._id)}
                                  className="text-xs text-gray-400 hover:text-gray-600 transition"
                                >
                                  Marcar leída
                                </button>
                              </div>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleAceptarSolicitud(n)}
                                  disabled={cargando}
                                  className="flex items-center gap-1 text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-full disabled:opacity-50 active:scale-95 transition-all"
                                >
                                  <FaCheck size={10} /> Seguir
                                </button>
                                <button
                                  onClick={() => marcarLeido(n._id)}
                                  className="text-xs text-gray-500 hover:text-gray-700 transition"
                                >
                                  Ignorar
                                </button>
                              </>
                            )}
                          </>
                        )}

                        {n.tipo !== "match" &&
                          n.tipo !== "seguidor" &&
                          !n.leido && (
                            <button
                              onClick={() => marcarLeido(n._id)}
                              className="text-xs text-blue-600 font-semibold hover:text-blue-800 transition"
                            >
                              Marcar leída
                            </button>
                          )}
                      </div>
                    </motion.li>
                  ))}
            </ul>
          </motion.div>
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
