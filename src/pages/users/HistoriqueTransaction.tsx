import {Header} from "../../components/Header.tsx";
import {Footer} from "../../components/Footer.tsx";
import {
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import {useCardStore} from "../../stores/CardStore.ts";
import {GetTransactions} from "../../services_REST/serveur/users/GetTransactions.ts";
import {ArrowDownward, ArrowUpward} from "@mui/icons-material";
import {useTransactionsStore} from "../../stores/TransactionsStore.ts";
import {useVariablesStore} from "../../stores/VariablesStore.ts";
import {handleSortByDate} from "../../utils/sortMethods.ts";

export const HistoriqueTransaction = () => {
    const {card} = useCardStore();
    const {transactions, setTransactions} = useTransactionsStore()
    const {isFetchedTransactions, setIsFetchedTransactions} = useVariablesStore()
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    useEffect(() => {
        if (!isFetchedTransactions) {
            setIsFetchedTransactions(true)
            
            if (!card?.numero) return;
            GetTransactions(card?.numero)
                .then((data) => {
                    if (!data || !Array.isArray(data)) {
                        setTransactions([]);
                    } else {
                        setTransactions(data);
                    }
                })
                .catch((error) => {
                    console.error("Erreur lors de la récupération des transactions:", error);
                    setTransactions([]);
                })
        }
    }, [card?.numero, isFetchedTransactions, setIsFetchedTransactions, setTransactions]);

    const getColorByType = (type: string) => {
        switch (type) {
            case 'Annulation':
                return 'grey';
            case 'Remboursement':
                return 'blue';
            case 'Crédit':
                return 'green';
            case 'Débit':
                return 'red';
            default:
                return 'inherit';
        }
    };

    return (
        <>
        <Header/>
            <Container maxWidth="md" sx={{mt: 3, mb: 3}}>
                <Typography variant="h5" sx={{textAlign: "center", mb: 2, fontWeight: "bold"}}>
                    Historique des transactions
                </Typography>

                <TableContainer component={Paper} sx={{maxHeight: 400, boxShadow: 4, overflow: "auto", borderRadius: 2}}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow sx={{bgcolor: "#f5f5f5"}}>
                                <TableCell align="center" sx={{fontWeight: "bold", cursor: transactions && transactions.length > 1 ? "pointer" : "default"}} onClick={transactions && transactions.length > 1 ? () => handleSortByDate(transactions, sortOrder, setTransactions, setSortOrder) : undefined}>
                                    Date {transactions && transactions.length > 1 && (
                                    sortOrder === "asc"
                                        ? <ArrowUpward fontSize="small" sx={{ verticalAlign: "middle" }}/>
                                        : <ArrowDownward fontSize="small" sx={{ verticalAlign: "middle" }}/>
                                )}</TableCell>
                                <TableCell align="center" sx={{fontWeight: "bold"}}>Montant</TableCell>
                                <TableCell align="center" sx={{fontWeight: "bold"}}>Opération</TableCell>
                                <TableCell align="center" sx={{fontWeight: "bold"}}>Stand</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions && transactions.length > 0 ? (
                                transactions.map((transaction) => (
                                    <TableRow key={transaction.id_transaction}>
                                        <TableCell align="center">{new Date(transaction.date).toLocaleString()}</TableCell>
                                        <TableCell align="center"
                                                   sx={{color: getColorByType(transaction.type)}}>
                                            {transaction.type === "Crédit" || transaction.type === "Remboursement" ? "+" : transaction.type === "Débit" ? "-" : ""}{transaction.montant_transaction}€
                                        </TableCell>
                                        <TableCell align="center">
                                            {transaction.type}
                                        </TableCell>
                                        <TableCell align="center">{transaction.nom_stand}</TableCell>
                                    </TableRow>
                                    ))
                                ) : (
                                 <TableRow>
                                     <TableCell colSpan={4} align="center">Aucune transaction trouvée.</TableCell>
                                 </TableRow>
                             )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        <Footer/>
        </>
    )
}