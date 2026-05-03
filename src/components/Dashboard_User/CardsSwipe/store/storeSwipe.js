import { create } from "zustand";

const storeSwipe = create((set) => ({
  matchUserId: null,
  setMatchUserId: (id) => set({ matchUserId: id }),
}));

export default storeSwipe;