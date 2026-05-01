import { create } from "zustand";
import notificacionesService from "../api/notificacionesService";
import { socket } from "../../../../helpers/socket";

const storeNotificaciones = create((set, get) => ({
  notificaciones: [],
  loading: false,
  inicializado: false,

  obtenerNotificaciones: async () => {
    set({ loading: true });
    try {
      const res = await notificacionesService.getAll();
      set({ notificaciones: res?.notificaciones ?? [] });
    } finally {
      set({ loading: false });
    }
  },

  // ✅ nombre consistente
  marcarLeido: async (id) => {
    await notificacionesService.markAsRead(id);
    set((state) => ({
      notificaciones: state.notificaciones.map((n) =>
        n._id === id ? { ...n, leido: true } : n,
      ),
    }));
  },

  marcarTodasLeidas: async () => {
    const noLeidas = get().notificaciones.filter((n) => !n.leido);
    if (noLeidas.length === 0) return;
    await Promise.all(
      noLeidas.map((n) => notificacionesService.markAsRead(n._id))
    );
    set((state) => ({
      notificaciones: state.notificaciones.map((n) => ({ ...n, leido: true })),
    }));
  },

  initSocket: () => {
    if (get().inicializado) return () => {};

    // ✅ al llegar señal, hacer fetch completo
    const handleNueva = () => {
      get().obtenerNotificaciones();
    };

    socket.on("notificacion_nueva", handleNueva);
    socket.on("evento_eliminado", handleNueva);

    set({ inicializado: true });

    return () => {
      socket.off("notificacion_nueva", handleNueva);
      socket.off("evento_eliminado", handleNueva);
      set({ inicializado: false });
    };
  },
}));

export default storeNotificaciones;