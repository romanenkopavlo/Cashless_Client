import {create} from "zustand";
import Card from "../models/Card.ts";
import Transaction from "../models/Transaction.ts";

interface InterfaceUserCardsStore {
    cards: Card[];
    setCards: (newCards: Card[]) => void;
    addCard: (newCard: Card) => void;
    setTransactions: (cardId: number, transactions: Transaction[]) => void
}
export const useUserCardsStore = create<InterfaceUserCardsStore>()(
    (set) => ({
        cards: [],

        setCards: (newCards) => set({cards: newCards}),

        addCard: (newCard) => set((state) => ({ cards: [...state.cards, newCard] })),

        setTransactions: (cardId, transactions) =>
            set((state) => ({
                cards: state.cards.map(card =>
                    card.id_carte === cardId
                        ? { ...card, transactions }
                        : card
                ),
            })),
    })
)