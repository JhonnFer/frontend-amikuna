import { create } from "zustand";
import notificacionesService from "../api/notificacionesService";

const storeNotificaciones = create((set, get) => ({
  notificaciones: [],
  loading: false,
  inicializado: false,

  // =====================
  // CARGA INICIAL (solo 1 vez al montar Dashboard)
  // =====================
  obtenerNotificaciones: async () => {
    set({ loading: true });
    try {
      const res = await notificacionesService.getAll();
      set({
        notificaciones: res?.notificaciones ?? [],
        inicializado: true,
      });
    } catch (error) {
      console.error("Error cargando notificaciones:", error);
      set({ inicializado: true });
    } finally {
      set({ loading: false });
    }
  },

  // =====================
  // MARK READ (con optimistic update)
  // =====================
  marcarLeido: async (id) => {
    // 1. Optimistic update en memoria
    set((state) => ({
      notificaciones: state.notificaciones.map((n) =>
        n._id === id ? { ...n, leido: true } : n,
      ),
    }));

    // 2. Sincronizar con backend (fire & forget)
    try {
      await notificacionesService.markAsRead(id);
    } catch (error) {
      console.error("Error marcando notificación como leída:", error);
      // Revertir cambio si falla (opcional)
      set((state) => ({
        notificaciones: state.notificaciones.map((n) =>
          n._id === id ? { ...n, leido: false } : n,
        ),
      }));
    }
  },

  // =====================
  // MARK ALL READ (con optimistic update)
  // =====================
  marcarTodasLeidas: async () => {
  const noLeidas = get().notificaciones.filter((n) => !n.leido);
  if (noLeidas.length === 0) return;

  await Promise.all(
    noLeidas.map((n) => notificacionesService.markAsRead(n._id))
  );

  set((state) => ({
    notificaciones: state.notificaciones.map((n) => ({
      ...n,
      leido: true,
    })),
  }));
},

  // =====================
  // PUSH REAL-TIME (socket - sin lógica de API)
  // =====================
  agregarNotificacion: (nueva) => {
    // 🛡️ VALIDACIÓN: Solo agregar notificaciones válidas
    if (!nueva || typeof nueva !== "object" || !nueva._id || !nueva.tipo) {
      console.warn("⚠️ No se puede agregar notificación inválida:", nueva);
      return;
    }
    set((state) => ({
      notificaciones: [nueva, ...state.notificaciones],
    }));
  },

  actualizarNotificacion: (update) => {
    // 🛡️ VALIDACIÓN: Solo actualizar notificaciones válidas
    if (!update || typeof update !== "object" || !update._id) {
      console.warn("⚠️ No se puede actualizar notificación inválida:", update);
      return;
    }
    set((state) => ({
      notificaciones: state.notificaciones.map((n) =>
        n._id === update._id ? { ...n, ...update } : n,
      ),
    }));
  },

  eliminarNotificacion: (id) =>
    set((state) => ({
      notificaciones: state.notificaciones.filter((n) => n._id !== id),
    })),

  // =====================
  // HELPERS (sin refetch)
  // =====================
  contarNoLeidas: () => {
    const state = get();
    return state.notificaciones.filter((n) => !n.leido).length;
  },

  filtrarPorTipo: (tipo) => {
    const state = get();
    return state.notificaciones.filter((n) => n.tipo === tipo);
  },

  buscar: (termino) => {
    const state = get();
    const termBajo = termino.toLowerCase();
    return state.notificaciones.filter(
      (n) =>
        n.mensaje?.toLowerCase().includes(termBajo) ||
        n.tipo?.toLowerCase().includes(termBajo),
    );
  },

  limpiar: () =>
    set({
      notificaciones: [],
      loading: false,
      inicializado: false,
    }),
}));

export default storeNotificaciones;
