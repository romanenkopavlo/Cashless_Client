import {Header} from "../../components/Header.tsx";
import {Footer} from "../../components/Footer.tsx";
import {
    Box,
    FormControl, InputLabel, MenuItem,
    Paper, Select, SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {
    ArrowDownward,
    ArrowUpward,
} from "@mui/icons-material";
import { useTransactionsStore } from "../../stores/TransactionsStore.ts";
import {useVariablesStore} from "../../stores/VariablesStore.ts";
import {useEffect, useState} from "react";
import {handleAdminSortByDate} from "../../utils/sortMethods.ts";
import {updateTransactions} from "../../services/transactions.ts";
import {styleCustomFilter} from "../../styles/CustomInputField.ts";

export const GestionTransactions = () => {
    const {transactions, setTransactions} = useTransactionsStore();
    const {isFetchedTransactions, setIsFetchedTransactions} = useVariablesStore();
    const [filterType, setFilterType] = useState<string>("Tous");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    useEffect(() => {
        if (!isFetchedTransactions) {
            setIsFetchedTransactions(true)
            updateTransactions(setTransactions)
        }
    }, [isFetchedTransactions, setIsFetchedTransactions, setTransactions]);

    const handleFilterChange = (event: SelectChangeEvent) => {
        setFilterType(event.target.value as string);
    };

    const filteredTransactions = transactions.filter((transaction) => {
        if (filterType === "Tous") {
            return true;
        }
        return transaction.type === filterType;
    });

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
                <Box sx={{p: 3, textAlign: "center" }}>
                    <Typography variant="h5" sx={{ mt: 1 }}>
                        Gestion des transactions
                    </Typography>
                </Box>
                <Box sx={{p: 3, textAlign: "center"}}>
                    <FormControl sx={styleCustomFilter}>
                        <InputLabel>Filtrer par type</InputLabel>
                        <Select
                            value={filterType}
                            onChange={handleFilterChange}
                            label="Filtrer par type"
                        >
                            <MenuItem value="Tous">Tous</MenuItem>
                            <MenuItem value="Débit">Débit</MenuItem>
                            <MenuItem value="Crédit">Crédit</MenuItem>
                            <MenuItem value="Remboursement">Remboursement</MenuItem>
                            <MenuItem value="Annulation de débit">Annulation de débit</MenuItem>
                            <MenuItem value="Annulation de crédit">Annulation de crédit</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <Box sx={{ p: 3, mb: 15 }}>
                    <TableContainer component={Paper} sx={{maxHeight: 400, boxShadow: 4, overflow: "auto", borderRadius: 2}}>
                        <Table sx={{ border: "1px solid #ddd" }}>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                    <TableCell align="center" sx={{ border: "1px solid #ddd", width: "50px" }}>ID</TableCell>
                                    <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px", cursor: filteredTransactions && filteredTransactions.length > 1 ? "pointer" : "default"}} onClick={filteredTransactions && filteredTransactions.length > 1 ? () => handleAdminSortByDate(transactions, sortOrder, setTransactions, setSortOrder) : undefined}>
                                        Date {filteredTransactions && filteredTransactions.length > 1 && (
                                        sortOrder === "asc"
                                            ? <ArrowUpward fontSize="small" sx={{ verticalAlign: "middle" }}/>
                                            : <ArrowDownward fontSize="small" sx={{ verticalAlign: "middle" }}/>
                                    )}</TableCell>
                                    <TableCell align="center" sx={{ border: "1px solid #ddd", width: "100px" }}>Montant (€)</TableCell>
                                    <TableCell align="center" sx={{ border: "1px solid #ddd", width: "100px" }}>Carte</TableCell>
                                    <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>Opération</TableCell>
                                    <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>Utilisateur</TableCell>
                                    <TableCell align="center" sx={{ border: "1px solid #ddd", width: "120px" }}>Stand</TableCell>
                                    <TableCell align="center" sx={{ border: "1px solid #ddd", width: "120px" }}>Bénévole</TableCell>
                                    <TableCell align="center" sx={{ border: "1px solid #ddd", width: "120px" }}>Terminal</TableCell>
                                    <TableCell align="center" sx={{ border: "1px solid #ddd", width: "120px" }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredTransactions && filteredTransactions.length > 0 ? (
                                    filteredTransactions.map((transaction) => (
                                        <TableRow key={transaction.id_transaction}>
                                            <TableCell align="center" sx={{ border: "1px solid #ddd", width: "50px" }}>{transaction.id_transaction}</TableCell>
                                            <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>{new Date(transaction.date).toLocaleString()}</TableCell>
                                            <TableCell align="center" sx={{ border: "1px solid #ddd", width: "100px", color: getColorByType(transaction.type) }}>{transaction.type === "Crédit" || transaction.type === "Remboursement" ? "+" : transaction.type === "Débit" ? "-" : ""}{transaction.montant_transaction}</TableCell>
                                            <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>{transaction.numero_carte ? transaction.numero_carte : '—'}</TableCell>
                                            <TableCell align="center" sx={{ border: "1px solid #ddd", width: "100px" }}>{transaction.type}</TableCell>
                                            <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>{transaction.login_utilisateur ? transaction.login_utilisateur : '—'}</TableCell>
                                            <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>{transaction.nom_stand ? transaction.nom_stand : '—'}</TableCell>
                                            <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>{transaction.login_benevole ? transaction.login_benevole : '—'}</TableCell>
                                            <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>{transaction.marque_terminal ? transaction.marque_terminal : '—'} {transaction.modele_terminal ? transaction.modele_terminal : '—'}</TableCell>
                                            <TableCell align="center" sx={{ border: "1px solid #ddd", width: "120px" }}>—</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={10} align="center">Aucune transaction trouvée.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            <Footer/>
        </>
    )
}