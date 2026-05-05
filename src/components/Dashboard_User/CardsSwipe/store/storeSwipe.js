import { create } from "zustand";



const storeSwipe = create((set) => ({
  matchUserId: null,
  setMatchUserId: (id) => set({ matchUserId: id }),
  perfilActualizado: false,                              // ← agregar
  triggerRefetchSwipe: () => set({ perfilActualizado: true }),  // ← agregar
  clearRefetchSwipe: () => set({ perfilActualizado: false }),   // ← agregar
}));

export default storeSwipe;