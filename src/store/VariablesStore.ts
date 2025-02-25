import {create} from "zustand";

interface InterfaceVariablesStore {
    isFetchedVisitors: boolean
    isFetchedStands: boolean
    setIsFetchedStands: (newState: boolean) => void
    setIsFetchedVisitors: (newState: boolean) => void
}
export const useVariablesStore = create<InterfaceVariablesStore>()(
    (set) => ({
        isFetchedVisitors: false,
        isFetchedStands: false,
        setIsFetchedVisitors: (newState) => set({isFetchedVisitors: newState}),
        setIsFetchedStands: (newState) => set({isFetchedStands: newState}),
    }),
)