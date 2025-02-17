import {create} from "zustand";
import Card from "../models/users/Card.ts";

interface InterfaceCardStore {
    card: Card | null
    setCard: (newCard: Card | null ) => void
}
export const useCardStore = create<InterfaceCardStore>()(
    (set) => ({
        card: null,
        setCard: (card) => set({card: card}),
    })
)