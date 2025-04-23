import {create} from "zustand";
import Transaction from "../models/Transaction.ts";

interface InterfaceTransactionsStore {
    transactions: Transaction[];
    setTransactions: (newTransactions: Transaction[]) => void
}

export const useTransactionsStore = create<InterfaceTransactionsStore>((set) => ({
    transactions: [],
    setTransactions: (newTransactions) => set({ transactions: newTransactions })
}));