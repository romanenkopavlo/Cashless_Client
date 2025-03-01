import {create} from "zustand";
import Transaction from "../models/Transaction.ts";

interface InterfaceTransactionStore {
    transactions: Transaction[];
    setTransactions: (newTransactions: Transaction[]) => void
}

export const useTransactionStore = create<InterfaceTransactionStore>((set) => ({
    transactions: [],
    setTransactions: (newTransactions) => set({ transactions: newTransactions }),
}));