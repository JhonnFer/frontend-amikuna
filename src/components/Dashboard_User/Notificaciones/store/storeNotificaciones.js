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
      noLeidas.map((n) => notificacionesService.markAsRead(n._id)),
    );
    set((state) => ({
      notificaciones: state.notificaciones.map((n) => ({ ...n, leido: true })),
    }));
  },
  
  initSocket: () => {
  if (get().inicializado) return () => {};

  const handleRefreshSocket = () => {
    get().obtenerNotificaciones();
  };

  const handleRefreshWindow = () => {
    get().obtenerNotificaciones();
  };

  // SOCKET EVENTS
  socket.on("notificacion_nueva", handleRefreshSocket);
  socket.on("notificacion_update", handleRefreshSocket);

  // WINDOW EVENTS (desde dashboard)
  window.addEventListener("refetch_notificaciones", handleRefreshWindow);

  set({ inicializado: true });

  return () => {
    socket.off("notificacion_nueva", handleRefreshSocket);
    socket.off("notificacion_update", handleRefreshSocket);

    window.removeEventListener("refetch_notificaciones", handleRefreshWindow);

    set({ inicializado: false });
  };
},
}));

export default storeNotificaciones;
