import { create } from "zustand";
import fetchDataBackend from "../helpers/fetchDataBackend";
import { socket } from "../helpers/socket";

const storeNotificaciones = create((set, get) => ({
  notificaciones: [],
  loading: false,
  inicializado: false, 

  obtenerNotificaciones: async () => {
    set({ loading: true });
    try {
      const res = await fetchDataBackend(
        "estudiantes/notificaciones",
        null,
        "GET",
      );

      set({ notificaciones: res?.notificaciones ?? [] });
    } catch (error) {
      console.error("❌ Error al obtener notificaciones:", error);
      set({ notificaciones: [] });
    } finally {
      set({ loading: false });
    }
  },

  agregarNotificacion: (nueva) => {
    if (!nueva || !nueva._id) return;

    set((state) => {
      // 🔥 Evitar duplicados: si ya existe, no agregar
      const yaExiste = state.notificaciones.some((n) => n._id === nueva._id);
      if (yaExiste) return state;

      return {
        notificaciones: [nueva, ...state.notificaciones],
      };
    });
  },

  marcarLeido: async (id) => {
    try {
      await fetchDataBackend(
        `estudiantes/notificaciones/${id}/leido`,
        {},
        "PUT",
      );

      set((state) => ({
        notificaciones: state.notificaciones.map((n) =>
          n._id === id ? { ...n, leido: true } : n,
        ),
      }));
    } catch (error) {
      console.error("❌ Error al marcar como leído:", error);
    }
  },

  initSocket: () => {
    // 🔥 IMPORTANTE: Esta función se llama solo UNA VEZ desde App.jsx
    const state = get();
    if (state.inicializado) {
      console.log("⚠️  Socket ya inicializado, saltando...");
      return () => {};
    }

    console.log("🚀 Inicializando listeners de socket para notificaciones");

    const handleNotificacionNueva = (notificacion) => {
      console.log("📡 Nueva notificación recibida:", notificacion);

      // 🔥 Agregar directamente sin refetch
      get().agregarNotificacion(notificacion);
    };

    // Limpiar listener anterior si existe
    socket.off("notificacion_nueva", handleNotificacionNueva);
    socket.on("notificacion_nueva", handleNotificacionNueva);

    // 🔥 Marcar como inicializado para evitar duplicaciones futuras
    set({ inicializado: true });

    // Devolver función de limpieza
    return () => {
      socket.off("notificacion_nueva", handleNotificacionNueva);
    };
  },
}));

export default storeNotificaciones;
