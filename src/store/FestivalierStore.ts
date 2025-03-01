import {create} from "zustand";
import User from "../models/User.ts";

interface InterfaceFestivalierStore {
    festivaliers: User[]
    setFestivaliers: (newFestivaliers: User[]) => void
    addFestivalier: (newFestivalier: User) => void
    updateFestivalier: (updatedFestivalier: User) => void
    deleteFestivalier: (id: number) => void
}
export const useFestivalierStore = create<InterfaceFestivalierStore>((set) => ({
    festivaliers: [],

    setFestivaliers: (newFestivaliers) => set({ festivaliers: newFestivaliers }),

    addFestivalier: (newFestivalier) => set((state) => ({ festivaliers: [...state.festivaliers, newFestivalier] })),

    updateFestivalier: (updatedFestivalier) => set((state) => ({
        festivaliers: state.festivaliers.map(festivalier =>
            festivalier.id === updatedFestivalier.id ? updatedFestivalier : festivalier
        )
    })),

    deleteFestivalier: (id) => set((state) => ({
        festivaliers: state.festivaliers.filter(festivalier => festivalier.id !== id)
    }))
}));