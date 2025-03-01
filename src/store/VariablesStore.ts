import {create} from "zustand";

interface InterfaceVariablesStore {
    isFetchedVisitors: boolean
    isFetchedStands: boolean
    isFetchedTransactions: boolean
    isFetchedBenevoles: boolean
    isFetchedCategories: boolean
    setIsFetchedStands: (newState: boolean) => void
    setIsFetchedVisitors: (newState: boolean) => void
    setIsFetchedTransactions: (newState: boolean) => void
    setIsFetchedBenevoles: (newState: boolean) => void
    setIsFetchedCategories: (newState: boolean) => void
}
export const useVariablesStore = create<InterfaceVariablesStore>()(
    (set) => ({
        isFetchedVisitors: false,
        isFetchedStands: false,
        isFetchedTransactions: false,
        isFetchedBenevoles: false,
        isFetchedCategories: false,
        setIsFetchedVisitors: (newState) => set({isFetchedVisitors: newState}),
        setIsFetchedStands: (newState) => set({isFetchedStands: newState}),
        setIsFetchedTransactions: (newState) => set({isFetchedTransactions: newState}),
        setIsFetchedBenevoles: (newState) => set({isFetchedBenevoles: newState}),
        setIsFetchedCategories: (newState) => set({isFetchedCategories: newState}),
    }),
)