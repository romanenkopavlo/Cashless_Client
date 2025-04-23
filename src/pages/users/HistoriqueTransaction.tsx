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
import {useState} from "react";
import {useUserCardsStore} from "../../stores/UserCardsStore.ts";
import {ArrowDownward, ArrowUpward} from "@mui/icons-material";
import {handleUserSortByDate} from "../../utils/sortMethods.ts";
import {useLocation} from "react-router";

export const HistoriqueTransaction = () => {
    const {cards, setTransactions} = useUserCardsStore();
    const location = useLocation();
    const cardId = location.state?.cardId;
    const selectedCard = cards.find(card => card.id_carte === Number(cardId));
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    const getColorByType = (type: string) => {
        switch (type) {
            case 'Annulation de crédit':
                return 'grey';
            case 'Annulation de débit':
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
            {selectedCard ? (
                <Container maxWidth="md" sx={{mt: 3, mb: 18}}>
                    <Typography variant="h5" sx={{textAlign: "center", mb: 2, fontWeight: "bold"}}>
                        Historique des transactions
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{textAlign: "center", mb: 2, fontWeight: "bold"}}>
                        Carte: {selectedCard.numero}
                    </Typography>

                    {selectedCard.transactions && selectedCard.transactions.length > 0 ? (
                        <TableContainer component={Paper} sx={{maxHeight: 400, boxShadow: 4, overflow: "auto", borderRadius: 2}}>
                            <Table sx={{border: "1px solid #ddd"}}>
                                <TableHead>
                                    <TableRow sx={{bgcolor: "#f5f5f5"}}>
                                        <TableCell align="center" sx={{fontWeight: "bold", cursor: selectedCard.transactions.length > 1 ? "pointer" : "default"}} onClick={selectedCard.transactions.length > 1 ? () => handleUserSortByDate(selectedCard.id_carte, selectedCard.transactions, sortOrder, setTransactions, setSortOrder) : undefined}>
                                            Date {selectedCard.transactions.length > 1 && (
                                            sortOrder === "asc"
                                                ? <ArrowUpward fontSize="small" sx={{ verticalAlign: "middle" }}/>
                                                : <ArrowDownward fontSize="small" sx={{ verticalAlign: "middle" }}/>
                                        )}</TableCell>
                                        <TableCell align="center" sx={{fontWeight: "bold"}}>Montant (€)</TableCell>
                                        <TableCell align="center" sx={{fontWeight: "bold"}}>Opération</TableCell>
                                        <TableCell align="center" sx={{fontWeight: "bold"}}>Stand</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                        {selectedCard.transactions.map((transaction) => (
                                            <TableRow key={transaction.id_transaction}>
                                                <TableCell align="center">{new Date(transaction.date).toLocaleString()}</TableCell>
                                                <TableCell align="center"
                                                           sx={{color: getColorByType(transaction.type)}}>
                                                    {transaction.type === "Crédit" || transaction.type === "Remboursement" ? "+" : transaction.type === "Débit" ? "-" : ""}{transaction.montant_transaction}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {transaction.type}
                                                </TableCell>
                                                <TableCell align="center">{transaction.nom_stand ? transaction.nom_stand : '—'}</TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Typography variant="h6" align="center" fontWeight="bold">
                            Aucune transaction trouvée.
                        </Typography>
                    )}
                </Container>
                ) : (
                <Container maxWidth="md" sx={{mt: 3, mb: 18}}>
                    <Typography variant="h6" align="center" fontWeight="bold">
                        Carte non trouvée.
                    </Typography>
                </Container>
            )}
        <Footer/>
        </>
    )
}