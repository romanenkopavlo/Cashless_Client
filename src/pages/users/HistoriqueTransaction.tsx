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
import {useCardStore} from "../../store/CardStore.ts";
import {GetTransactions} from "../../services_REST/serveur/users/GetTransactions.ts";
import {ArrowDownward, ArrowUpward} from "@mui/icons-material";
import {useTransactionStore} from "../../store/TransactionStore.ts";
import {useVariablesStore} from "../../store/VariablesStore.ts";

export const HistoriqueTransaction = () => {
    const {card} = useCardStore();
    const {transactions, setTransactions} = useTransactionStore()
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
                    setTransactions([])
                })
        }
    }, [card?.numero, isFetchedTransactions, setIsFetchedTransactions, setTransactions]);

    const handleSortByDate = () => {
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
                                <TableCell align="center" sx={{fontWeight: "bold", cursor: "pointer"}} onClick={handleSortByDate}>Date {sortOrder === "asc" ? <ArrowUpward fontSize="small" sx={{ verticalAlign: "middle" }}/> : <ArrowDownward fontSize="small" sx={{ verticalAlign: "middle" }}/>}</TableCell>
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
                                                   sx={{color: transaction.type === "Crédit" ? "green" : "red"}}>
                                            {transaction.type === "Crédit" ? "+" : "-"}{transaction.montant_transaction}€
                                        </TableCell>
                                        <TableCell align="center">
                                            {transaction.type === "Crédit" ? "Crédité" : "Débité"}
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