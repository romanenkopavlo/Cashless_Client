import {create} from "zustand";
import Marque from "../models/Marque.ts";

interface InterfaceMarquesStore {
    marques: Marque[]
    setMarques: (newMarques: Marque[]) => void
    addMarque: (newMarque: Marque) => void;
    updateMarque: (updatedMarque: Marque) => void;
    deleteMarque: (id: number) => void;
}
export const useMarquesStore = create<InterfaceMarquesStore>((set) => ({
    marques: [],

    setMarques: (newMarques) => set({ marques: newMarques }),

    addMarque: (newMarque) => set((state) => ({ marques: [...state.marques, newMarque] })),

    updateMarque: (updatedMarque) => set((state) => ({
        marques: state.marques.map(marque =>
            marque.id_marque === updatedMarque.id_marque ? updatedMarque : marque
        )
    })),

    deleteMarque: (id) => set((state) => ({
        marques: state.marques.filter(marque => marque.id_marque !== id)
    }))
}));