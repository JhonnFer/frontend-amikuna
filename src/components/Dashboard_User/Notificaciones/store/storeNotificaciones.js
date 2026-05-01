import { create } from "zustand";
import notificacionesService from "../Server/notificacionesService";
import { listenNotificaciones } from "../helpers/notificacionesSocket";

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

  marcarNotificacionLeida: async (id) => {
    await notificacionesService.markAsRead(id);

    set((state) => ({
      notificaciones: state.notificaciones.map((n) =>
        n._id === id ? { ...n, leido: true } : n,
      ),
    }));
  },

  agregarNotificacion: (nueva) => {
    set((state) => {
      if (state.notificaciones.some((n) => n._id === nueva._id)) {
        return state;
      }

      return {
        notificaciones: [nueva, ...state.notificaciones],
      };
    });
  },

  initSocket: () => {
    if (get().inicializado) return () => {};

    const unsubscribe = listenNotificaciones(get().agregarNotificacion);

    set({ inicializado: true });

    return unsubscribe;
  },
}));

export default storeNotificaciones;
