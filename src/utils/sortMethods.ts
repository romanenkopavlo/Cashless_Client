import Transaction from "../models/Transaction.ts";
import * as React from "react";

export const handleSortByDate = (
        transactions: Transaction[],
        sortOrder: "asc" | "desc",
        setTransactions: (newTransactions: Transaction[]) => void,
        setSortOrder:  React.Dispatch<React.SetStateAction<"asc" | "desc">>,
    ) => {
    if (transactions) {
        if (transactions.length > 1) {
            const sortedTransactions = [...transactions].sort((a, b) => {
                return sortOrder === "asc"
                    ? new Date(a.date).getTime() - new Date(b.date).getTime()
                    : new Date(b.date).getTime() - new Date(a.date).getTime();
            });

            setTransactions(sortedTransactions);
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        }
    }
};