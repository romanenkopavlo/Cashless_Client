import {create} from "zustand";
import Card from "../models/Card.ts";

interface InterfaceCardsStore {
    cards: Card[]
    setCards: (newCards: Card[]) => void
    addCard: (newCard: Card) => void
    updateCard: (updatedCard: Card) => void
    deleteCard: (id: number) => void
}
export const useCardsStore = create<InterfaceCardsStore>((set) => ({
    cards: [],

    setCards: (newCards) => set({ cards: newCards }),

    addCard: (newCard) => set((state) => ({ cards: [...state.cards, newCard] })),

    updateCard: (updatedCard) => set((state) => ({
        cards: state.cards.map(card =>
            card.id_carte === updatedCard.id_carte ? updatedCard : card
        )
    })),

    deleteCard: (id) => set((state) => ({
        cards: state.cards.filter(card => card.id_carte !== id)
    }))
}));