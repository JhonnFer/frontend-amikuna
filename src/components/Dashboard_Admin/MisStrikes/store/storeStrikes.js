import { create } from "zustand";

const storeStrikes = create((set) => ({
  strikes: [],

  setStrikes: (strikes) => set({ strikes }),
  
    agregarStrike: (strike) =>
    set((state) => ({
      strikes: [strike, ...state.strikes], // más reciente primero
    })),

  resolverStrike: (strikeId) =>
    set((state) => ({
      strikes: state.strikes.map((s) =>
        s._id === strikeId ? { ...s, status: "resuelto" } : s
      ),
    })),

  marcarRespondido: (strikeId) =>
    set((state) => ({
      strikes: state.strikes.map((s) =>
        s._id === strikeId ? { ...s, respondido: true } : s
      ),
    })),

  actualizarRespuesta : (strikeId, respuesta) =>
    set((state) => ({
      strikes: state.strikes.map((strike)=>
        strike._id === strikeId ?{...strike, respondido:true, respuesta,}: strike
    ),
    })),
}));

export default storeStrikes;