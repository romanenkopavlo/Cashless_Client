import {create} from "zustand";
import Categorie from "../models/Categorie.ts";

interface InterfaceCategoriesStore {
    categories: Categorie[]
    setCategories: (newCategories: Categorie[]) => void
    addCategorie: (newCategorie: Categorie) => void;
    updateCategorie: (updatedCategorie: Categorie) => void;
    deleteCategorie: (id: number) => void;
}
export const useCategoriesStore = create<InterfaceCategoriesStore>((set) => ({
    categories: [],

    setCategories: (newCategories) => set({ categories: newCategories }),

    addCategorie: (newCategorie) => set((state) => ({ categories: [...state.categories, newCategorie] })),

    updateCategorie: (updatedCategorie) => set((state) => ({
        categories: state.categories.map(categorie =>
            categorie.id_categorie === updatedCategorie.id_categorie ? updatedCategorie : categorie
        )
    })),

    deleteCategorie: (id) => set((state) => ({
        categories: state.categories.filter(categorie => categorie.id_categorie !== id)
    }))
}));