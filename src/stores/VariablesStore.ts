import {create} from "zustand";

interface InterfaceVariablesStore {
    isFetchedVisitors: boolean
    isFetchedStands: boolean
    isFetchedTransactions: boolean
    isFetchedBenevoles: boolean
    isFetchedCategories: boolean
    isFetchedCards: boolean
    isFetchedPhones: boolean
    isFetchedMarques: boolean
    isFetchedTerminals: boolean
    isFetchedStatistics: boolean
    setIsFetchedStands: (newState: boolean) => void
    setIsFetchedVisitors: (newState: boolean) => void
    setIsFetchedTransactions: (newState: boolean) => void
    setIsFetchedBenevoles: (newState: boolean) => void
    setIsFetchedCategories: (newState: boolean) => void
    setIsFetchedCards: (newState: boolean) => void
    setIsFetchedPhones: (newState: boolean) => void
    setIsFetchedMarques: (newState: boolean) => void
    setIsFetchedTerminals: (newState: boolean) => void
    setIsFetchedStatistics: (newState: boolean) => void
}
export const useVariablesStore = create<InterfaceVariablesStore>()(
    (set) => ({
        isFetchedVisitors: false,
        isFetchedStands: false,
        isFetchedTransactions: false,
        isFetchedBenevoles: false,
        isFetchedCategories: false,
        isFetchedCards: false,
        isFetchedPhones: false,
        isFetchedMarques: false,
        isFetchedTerminals: false,
        isFetchedStatistics: false,
        setIsFetchedVisitors: (newState) => set({isFetchedVisitors: newState}),
        setIsFetchedStands: (newState) => set({isFetchedStands: newState}),
        setIsFetchedTransactions: (newState) => set({isFetchedTransactions: newState}),
        setIsFetchedBenevoles: (newState) => set({isFetchedBenevoles: newState}),
        setIsFetchedCategories: (newState) => set({isFetchedCategories: newState}),
        setIsFetchedCards: (newState) => set({isFetchedCards: newState}),
        setIsFetchedPhones: (newState) => set({isFetchedPhones: newState}),
        setIsFetchedMarques: (newState) => set({isFetchedMarques: newState}),
        setIsFetchedTerminals: (newState) => set({isFetchedTerminals: newState}),
        setIsFetchedStatistics: (newState) => set({isFetchedStatistics: newState}),
    }),
)