import { useState, useEffect } from "react";
import { FaBell, FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import useNotificaciones from "../../hooks/useNotificaciones";
import useSeguirUsuario from "../../hooks/useSeguirUsuario";

const BotonNotificaciones = () => {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const [menuStyle, setMenuStyle] = useState({});

  const { notificaciones, loading, marcarLeido, obtenerNotificaciones } = useNotificaciones();
  const { seguirUsuario, cargando: cargandoSeguir } = useSeguirUsuario();

  const noLeidas = Array.isArray(notificaciones)
    ? notificaciones.filter((n) => !n.leido).length
    : 0;

  useEffect(() => {
    if (!mostrarMenu) return;

    const calcularPosicion = () => {
      const navbar = document.querySelector(".bg-\\[\\#ffba79\\]");
      if (!navbar) return;
      const rect = navbar.getBoundingClientRect();
      setMenuStyle({
        position: "fixed",
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width / 1.25,
        zIndex: 999,
      });
    };

    calcularPosicion();
    window.addEventListener("resize", calcularPosicion);
    return () => window.removeEventListener("resize", calcularPosicion);
  }, [mostrarMenu]);

const handleAceptarSolicitud = async (notificacion) => {
  try {
    const idSolicitante = notificacion.fromUser?._id || notificacion.fromUser;
    
    

    if (!idSolicitante) {
      toast.error("No se pudo identificar al usuario.");
      return;
    }

    const data = await seguirUsuario(idSolicitante);
    console.log("Respuesta del backend:", data); // 👈 Y esto

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
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 z-[998] bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMostrarMenu(false)}
            />

            {/* Dropdown — mismo efecto que modal galería */}
            <motion.div
              style={menuStyle}
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-4 border-b bg-gray-50/50 flex justify-between items-center">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                  Notificaciones
                </h3>
                <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-bold">
                  {noLeidas} nuevas
                </span>
              </div>

              <ul className="max-h-[50vh] overflow-y-auto divide-y divide-gray-100">
                {loading && (
                  <li className="p-8 text-center text-sm text-gray-500 italic">
                    Actualizando...
                  </li>
                )}

                {!loading && notificaciones.length === 0 ? (
                  <li className="p-10 text-center text-gray-400 text-sm">
                    <div className="flex flex-col items-center gap-2">
                      <FaBell className="text-gray-200 w-8 h-8" />
                      <p>No tienes notificaciones pendientes</p>
                    </div>
                  </li>
                ) : (
                  notificaciones.map((n) => (
                    <li
                      key={n._id}
                      className={`p-4 flex flex-col gap-3 transition-colors ${
                        n.leido ? "bg-white opacity-70" : "bg-blue-50/40"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-3">
                        <p className={`text-sm leading-snug ${n.leido ? "text-gray-500" : "text-gray-800 font-medium"}`}>
                          {n.mensaje}
                        </p>
                        {!n.leido && (
                          <span className="h-2.5 w-2.5 bg-blue-500 rounded-full mt-1 shrink-0" />
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        {n.tipo === "seguidor" && !n.leido ? (
                          <>
                            <button
                              onClick={() => handleAceptarSolicitud(n)}
                              disabled={cargandoSeguir}
                              className="flex items-center gap-2 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50"
                            >
                              <FaCheck size={10} /> Seguir de vuelta
                            </button>
                            <button
                              onClick={() => marcarLeido(n._id)}
                              className="text-xs text-gray-500 font-semibold hover:text-gray-700 transition-colors"
                            >
                              Ignorar
                            </button>
                          </>
                        ) : (
                          !n.leido && (
                            <button
                              onClick={() => marcarLeido(n._id)}
                              className="text-[11px] text-blue-600 font-bold uppercase tracking-tighter hover:text-blue-800 transition-colors"
                            >
                              Marcar como leída
                            </button>
                          )
                        )}
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BotonNotificaciones;