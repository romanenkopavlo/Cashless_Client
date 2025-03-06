import {useEffect} from "react";
import { Header } from "../../components/Header.tsx";
import { Footer } from "../../components/Footer.tsx";
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import {useVariablesStore} from "../../stores/VariablesStore.ts";
import { useCardsStore } from "../../stores/CardsStore.ts";
import {DeleteCard} from "../../services_REST/serveur/admin/cards/DeleteCard.ts";
import {updateCards} from "../../services/cardsServices.ts";
import {updateTransactions} from "../../services/transactionsServices.ts";
import {useTransactionsStore} from "../../stores/TransactionsStore.ts";

export const GestionCartes = () => {
    const {cards, setCards, deleteCard} = useCardsStore();
    const {setTransactions} = useTransactionsStore();
    const {isFetchedCards, setIsFetchedCards} = useVariablesStore();

    useEffect(() => {
        if (!isFetchedCards) {
            setIsFetchedCards(true)
            updateCards(setCards)
        }
    }, [isFetchedCards, setCards, setIsFetchedCards]);

    const handleDelete = async (id: number) => {
        try {
            await DeleteCard(id)
            deleteCard(id)

            updateTransactions(setTransactions)
        } catch (error) {
            console.error("Erreur lors de la suppression des cartes:", error)
        }
    };

    return (
        <>
            <Header/>
            <div style={{height: "1065px"}}>
                <div style={{padding: "20px", textAlign: "center" }}>
                    <Typography variant="h5" sx={{ mt: 1 }}>
                        Gestion des cartes
                    </Typography>
                </div>
                <div style={{ padding: "20px" }}>
                    <TableContainer component={Paper} sx={{maxHeight: 400, boxShadow: 4, overflow: "auto", borderRadius: 2}}>
                        <Table sx={{ border: "1px solid #ddd" }}>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                    <TableCell align="center" sx={{ border: "1px solid #ddd", width: "50px" }}>ID</TableCell>
                                    <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>Numéro</TableCell>
                                    <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>NFC</TableCell>
                                    <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>Montant (€)</TableCell>
                                    <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>Utilisateur</TableCell>
                                    <TableCell align="center" sx={{ border: "1px solid #ddd", width: "120px" }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cards && cards.length > 0 ? (
                                    cards.map((card) => (
                                        <TableRow key={card.id_carte}>
                                            <TableCell align="center" sx={{ border: "1px solid #ddd", width: "50px" }}>{card.id_carte}</TableCell>
                                            <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>{card.numero}</TableCell>
                                            <TableCell align="center" sx={{ border: "1px solid #ddd", width: "50px" }}>{card.nfc}</TableCell>
                                            <TableCell align="center" sx={{ border: "1px solid #ddd", width: "100px" }}>{card.montant}</TableCell>
                                            <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>{card.login_utilisateur ? card.login_utilisateur : '—'}</TableCell>
                                            <TableCell align="center" sx={{ border: "1px solid #ddd", width: "120px" }}>
                                                <Button onClick={() => handleDelete(card.id_carte)} color="error"><Delete /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">Aucune carte trouvée.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>

                {/*<Dialog open={open} onClose={handleClose}>*/}
                {/*    <DialogTitle>{isEditing ? "Modifier le stand" : "Ajouter un stand"}</DialogTitle>*/}
                {/*    <DialogContent>*/}
                {/*        <TextField fullWidth margin="dense" variant="outlined" sx={styleCustom} label="Nom" name="nom_stand" value={formData.nom_stand} onChange={handleChange} error={!!nomError} helperText={nomError}/>*/}
                {/*        <TextField fullWidth margin="dense" variant="outlined" sx={styleCustom} label="Solde (€)" name="solde" type="number" value={formData.solde} onChange={handleChange} error={!!soldeError} helperText={soldeError}/>*/}
                {/*        <FormControl fullWidth margin="dense" sx={styleCustom} error={!!categorieError}>*/}
                {/*            <InputLabel id="categorie-label">Catégorie</InputLabel>*/}
                {/*            <Select*/}
                {/*                labelId="categorie-label"*/}
                {/*                label="Catégorie"*/}
                {/*                name="nom_categorie"*/}
                {/*                value={formData.nom_categorie}*/}
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
                {/*                {categories && categories.length > 0 && categories.map((categorie) => (*/}
                {/*                    <MenuItem key={categorie.id_categorie} value={categorie.nom_categorie}>*/}
                {/*                        {categorie.nom_categorie}*/}
                {/*                    </MenuItem>*/}
                {/*                ))}*/}
                {/*            </Select>*/}
                {/*            {categorieError && (*/}
                {/*                <Typography color="error" variant="caption" sx={{mt: 0.5}}>*/}
                {/*                    {categorieError}*/}
                {/*                </Typography>*/}
                {/*            )}*/}
                {/*        </FormControl>*/}
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
    );
};