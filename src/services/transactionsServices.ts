import {GetTransactions} from "../services_REST/serveur/admin/transactions/GetTransactions.ts";
import Transaction from "../models/Transaction.ts";

export const updateTransactions = (setTransactions: (newTransactions: Transaction[]) => void) => {
    GetTransactions()
        .then((data) => {
            if (!data || !Array.isArray(data)) {
                setTransactions([]);
            } else {
                setTransactions(data);
            }
        })
        .catch((error) => {
            console.error("Erreur lors de la récupération des transactions:", error);
            setTransactions([])
        })
}