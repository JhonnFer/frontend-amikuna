import { create } from "zustand";

const storeUnread = create((set) => ({
  unreadCounts: {},
  userChatMap : {},

  // llamado al cargar matches desde el backend
  inicializarCounts: (counts) => set({ unreadCounts: counts }),

    incrementarCount: (chatId) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [chatId]: (state.unreadCounts[chatId] || 0) + 1,
      },
    })),

  // llamado al abrir el chat
  marcarLeido: (chatId) =>
    set((state) => {
      const next = { ...state.unreadCounts };
      delete next[chatId];
      return { unreadCounts: next };
    }),

  agregarChatMap : (otherUserId, chatId) =>
    set((state) => ({
      userChatMap: {...state.userChatMap, [otherUserId]: chatId},
    })),
    
}));

export default storeUnread;