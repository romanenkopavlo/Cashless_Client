import {Header} from "../../components/Header.tsx";
import {Footer} from "../../components/Footer.tsx";
import {
    Alert,
    Button,
    Container,
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
    MonetizationOn
} from "@mui/icons-material";
import { useTransactionsStore } from "../../stores/TransactionsStore.ts";
import {useVariablesStore} from "../../stores/VariablesStore.ts";
import {useEffect, useState} from "react";
import { handleSortByDate } from "../../utils/sortMethods.ts";
import {RembourserTransaction} from "../../services_REST/serveur/admin/transactions/RembourserTransaction.ts";
import {useCardsStore} from "../../stores/CardsStore.ts";
import {updateTransactions} from "../../services/transactionsServices.ts";
import {updateCards} from "../../services/cardsServices.ts";

export const GestionTransactions = () => {
    const {transactions, setTransactions} = useTransactionsStore();
    const {setCards} = useCardsStore();
    const {isFetchedTransactions, setIsFetchedTransactions} = useVariablesStore();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [filterType, setFilterType] = useState<string>("Tous");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    useEffect(() => {
        if (!isFetchedTransactions) {
            setIsFetchedTransactions(true)
            updateTransactions(setTransactions)
        }
    }, [isFetchedTransactions, setIsFetchedTransactions, setTransactions]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

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

    const handleRefund = async (id: number) => {
        try {
            await RembourserTransaction(id)
            setSuccessMessage("Les fonds ont été remboursés")

            updateTransactions(setTransactions)
            updateCards(setCards)
        } catch (error) {
            console.error("Erreur lors du remboursement:", error)
        }
    }

    const styleCustom = {
        '& label.Mui-focused': {
            color: '#2C2C2C',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: '#7f5656',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: '#7f5656',
            },
            '&:hover fieldset': {
                borderColor: '#7f5656',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#7f5656',
            },
        },
        minWidth: 200
    }

    return (
        <>
            <Header/>
            <div style={{height: "1065px"}}>
                <div style={{padding: "20px", textAlign: "center" }}>
                    <Typography variant="h5" sx={{ mt: 1 }}>
                        Gestion des transactions
                    </Typography>
                </div>
                {successMessage && (
                    <Container maxWidth="xs" sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Alert severity="success">
                            {successMessage}
                        </Alert>
                    </Container>
                )}
                <div style={{padding: "20px", textAlign: "center"}}>
                    <FormControl sx={styleCustom}>
                        <InputLabel>Filtrer par type</InputLabel>
                        <Select
                            value={filterType}
                            onChange={handleFilterChange}
                            label="Filtrer par type"
                        >
                            <MenuItem value="Tous">Tous</MenuItem>
                            <MenuItem value="Crédit">Crédit</MenuItem>
                            <MenuItem value="Débit">Débit</MenuItem>
                            <MenuItem value="Annulation">Annulation</MenuItem>
                            <MenuItem value="Remboursement">Remboursement</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div style={{ padding: "20px" }}>
                    <TableContainer component={Paper} sx={{maxHeight: 400, boxShadow: 4, overflow: "auto", borderRadius: 2}}>
                        <Table sx={{ border: "1px solid #ddd" }}>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                    <TableCell align="center" sx={{ border: "1px solid #ddd", width: "50px" }}>ID</TableCell>
                                    <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px", cursor: filteredTransactions && filteredTransactions.length > 1 ? "pointer" : "default"}} onClick={filteredTransactions && filteredTransactions.length > 1 ? () => handleSortByDate(transactions, sortOrder, setTransactions, setSortOrder) : undefined}>
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
                                            <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>{transaction.marque_terminal ? transaction.marque_terminal : '—'} {transaction.modele_terminal ? transaction.modele_terminal : '—'}</TableCell>
                                            <TableCell align="center" sx={{ border: "1px solid #ddd", width: "120px" }}>
                                                {(transaction.type === 'Annulation' || transaction.type === 'Remboursement' || transaction.type === 'Crédit') && (
                                                    <>—</>
                                                )}
                                                {transaction.type === 'Débit' && (
                                                    <>
                                                        <Button color="success" onClick={() => handleRefund(transaction.id_transaction)} startIcon={<MonetizationOn />}>
                                                            Rembourser
                                                        </Button>
                                                    </>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={9} align="center">Aucune transaction trouvée.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>

                {/*<Dialog open={open} onClose={handleClose}>*/}
                {/*    <DialogTitle>{isEditing ? "Modifier le bénévole" : "Ajouter un bénévole"}</DialogTitle>*/}
                {/*    <DialogContent>*/}
                {/*        <TextField fullWidth margin="dense" variant="outlined" sx={styleCustom} label="Nom" name="nom" value={formData.nom} onChange={handleChange} error={!!errors.nom} helperText={errors.nom}/>*/}
                {/*        <TextField fullWidth margin="dense" variant="outlined" sx={styleCustom} label="Prénom" name="prenom" value={formData.prenom} onChange={handleChange} error={!!errors.prenom} helperText={errors.prenom}/>*/}
                {/*        <TextField fullWidth margin="dense" variant="outlined" sx={styleCustom} label="Login" name="login" value={formData.login} onChange={handleChange} error={!!errors.username} helperText={errors.username}/>*/}
                {/*        <FormControl fullWidth margin="dense" sx={styleCustom} error={!!errors.nom_stand}>*/}
                {/*            <InputLabel id="stand-label">Stand</InputLabel>*/}
                {/*            <Select*/}
                {/*                labelId="stand-label"*/}
                {/*                label="Stand"*/}
                {/*                name="nom_stand"*/}
                {/*                value={formData.nom_stand}*/}
                {/*                onChange={handleSelectChange}*/}
                {/*                MenuProps={{*/}
                {/*                    PaperProps: {*/}
                {/*                        style: {*/}
                {/*                            maxHeight: 180,*/}
                {/*                            overflow: 'auto',*/}
                {/*                        },*/}
                {/*                    },*/}
                {/*                }}*/}
                {/*            >*/}
                {/*                {stands && stands.length > 0 && stands.map((stand) => (*/}
                {/*                    <MenuItem key={stand.id_stand} value={stand.nom_stand}>*/}
                {/*                        {stand.nom_stand}*/}
                {/*                    </MenuItem>*/}
                {/*                ))}*/}
                {/*            </Select>*/}
                {/*            {errors.nom_stand && (*/}
                {/*                <Typography color="error" variant="caption" sx={{mt: 0.5}}>*/}
                {/*                    {errors.nom_stand}*/}
                {/*                </Typography>*/}
                {/*            )}*/}
                {/*        </FormControl>*/}
                {/*        {!isEditing && (<TextField fullWidth margin="dense" variant="outlined" sx={styleCustom} label="Mot de passe" name="password" type="password" value={password} onChange={handlePasswordChange} error={!!errors.password} helperText={errors.password}/>)}*/}
                {/*        {error && (*/}
                {/*            <Typography color="error" variant="body2" sx={{ mt: 1 }}>*/}
                {/*                {error}*/}
                {/*            </Typography>*/}
                {/*        )}*/}
                {/*    </DialogContent>*/}
                {/*    <DialogActions>*/}
                {/*        <Button onClick={handleClose} sx={{color: "#7f5656"}}>Annuler</Button>*/}
                {/*        <Button onClick={handleSubmit} sx={{backgroundColor: "#7f5656"}} variant="contained">{isEditing ? "Modifier" : "Ajouter"}</Button>*/}
                {/*    </DialogActions>*/}
                {/*</Dialog>*/}

            </div>
            <Footer/>
        </>
    )
}