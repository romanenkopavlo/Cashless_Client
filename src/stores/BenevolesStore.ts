import {create} from "zustand";
import Benevole from "../models/Benevole.ts";

interface InterfaceBenevolesStore {
    benevoles: Benevole[]
    setBenevoles: (newBenevoles: Benevole[]) => void
    addBenevole: (newBenevole: Benevole) => void
    updateBenevole: (updatedBenevole: Benevole) => void
    deleteBenevole: (id: number) => void
}
export const useBenevolesStore = create<InterfaceBenevolesStore>((set) => ({
    benevoles: [],

    setBenevoles: (newBenevoles) => set({ benevoles: newBenevoles }),

    addBenevole: (newBenevole) => set((state) => ({ benevoles: [...state.benevoles, newBenevole] })),

    updateBenevole: (updatedBenevole) => set((state) => ({
        benevoles: state.benevoles.map(benevole =>
            benevole.id === updatedBenevole.id ? updatedBenevole : benevole
        )
    })),

    deleteBenevole: (id) => set((state) => ({
        benevoles: state.benevoles.filter(benevole => benevole.id !== id)
    }))
}));