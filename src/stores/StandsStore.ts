import {create} from "zustand";
import Stand from "../models/Stand.ts";

interface InterfaceStandsStore {
    stands: Stand[]
    setStands: (newStands: Stand[]) => void
    addStand: (newStand: Stand) => void;
    updateStand: (updatedStand: Stand) => void;
    deleteStand: (id: number) => void;
}
export const useStandsStore = create<InterfaceStandsStore>((set) => ({
    stands: [],

    setStands: (newStands) => set({ stands: newStands }),

    addStand: (newStand) => set((state) => ({ stands: [...state.stands, newStand] })),

    updateStand: (updatedStand) => set((state) => ({
        stands: state.stands.map(stand =>
            stand.id_stand === updatedStand.id_stand ? updatedStand : stand
        )
    })),

    deleteStand: (id) => set((state) => ({
        stands: state.stands.filter(stand => stand.id_stand !== id)
    }))
}));