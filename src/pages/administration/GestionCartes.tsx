import React, {useEffect, useState} from "react";
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
    Typography, Box
} from "@mui/material";
import {Delete, UploadFile} from "@mui/icons-material";
import {useVariablesStore} from "../../stores/VariablesStore.ts";
import {useCardsStore} from "../../stores/CardsStore.ts";
import {DeleteCard} from "../../services_REST/serveur/admin/cards/DeleteCard.ts";
import {updateCards} from "../../services/cards.ts";
import {ReadFileCards} from "../../services_REST/serveur/admin/cards/AjouterCards.ts";
import {SuccessMessage} from "../../components/SuccessMessage.tsx";
import {SnackbarError} from "../../components/SnackbarError.tsx";

export const GestionCartes = () => {
    const {cards, setCards, deleteCard} = useCardsStore();
    const {isFetchedCards, setIsFetchedCards} = useVariablesStore();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [errorSnackbar, setSnackbarError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!isFetchedCards) {
            setIsFetchedCards(true)
            updateCards(setCards)
        }
    }, [isFetchedCards, setCards, setIsFetchedCards]);

    const handleDelete = async (id: number) => {
        try {
            const data = await DeleteCard(id);
            setSuccessMessage(data.message);
            deleteCard(id);
        } catch (error) {
            if (error instanceof Error) {
                console.error("Erreur lors de la suppression des cartes:", error);
                setSnackbarError(error.message);
                return;
            } else {
                console.error("Erreur inconnue:", error);
                setSnackbarError("Une erreur inconnue est survenue.");
                return;
            }
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0];
            event.target.value = '';

            if (file.type !== "text/plain") {
                setSnackbarError("Seuls les fichiers .txt sont autorisés !");
                return;
            }

            console.log(file);

            setSelectedFile(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        try {
            const data = await ReadFileCards(selectedFile);
            setSuccessMessage(data.message);
            setSelectedFile(null);
            updateCards(setCards);
        } catch (error) {
            setSelectedFile(null);
            if (error instanceof Error) {
                console.error("Erreur lors de l'envoi du fichier:", error);
                setSnackbarError(error.message);
                return;
            } else {
                console.error("Erreur inconnue:", error);
                setSnackbarError("Une erreur inconnue est survenue.");
                return;
            }
        }
    };

    return (
        <>
            <Header/>
            <div style={{height: "1065px"}}>
                <div style={{padding: "20px", textAlign: "center"}}>
                    <Typography variant="h5" sx={{mt: 1}}>
                        Gestion des cartes
                    </Typography>
                </div>
                <Box display="flex" flexDirection="column" alignItems="center" gap={2} p={2}>
                    <Typography variant="h6">
                        Ajouter des cartes
                    </Typography>
                    <Button
                        variant="contained"
                        component="label"
                        startIcon={<UploadFile />}
                        sx={{ backgroundColor: "#a57272", color: "white", "&:hover": { backgroundColor: "#7f5656" } }}
                    >
                        Choisir un fichier
                        <input type="file" accept=".txt" hidden onChange={handleFileChange} />
                    </Button>
                    {selectedFile && (
                        <Typography variant="body1" sx={{ mt: 1, fontStyle: "italic" }}>
                            {selectedFile.name}
                        </Typography>
                    )}
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: "#a57272", color: "white", "&:hover": { backgroundColor: "#7f5656" } }}
                        onClick={handleUpload}
                        disabled={!selectedFile}
                    >
                        Ajouter
                    </Button>
                </Box>

                <SuccessMessage successMessage={successMessage} setSuccessMessage={setSuccessMessage}/>

                <div style={{padding: "20px"}}>
                    <TableContainer component={Paper}
                                    sx={{maxHeight: 400, boxShadow: 4, overflow: "auto", borderRadius: 2}}>
                        <Table sx={{border: "1px solid #ddd"}}>
                            <TableHead>
                                <TableRow sx={{backgroundColor: "#f5f5f5"}}>
                                    <TableCell align="center"
                                               sx={{border: "1px solid #ddd", width: "50px"}}>ID</TableCell>
                                    <TableCell align="center"
                                               sx={{border: "1px solid #ddd", width: "150px"}}>Numéro</TableCell>
                                    <TableCell align="center"
                                               sx={{border: "1px solid #ddd", width: "150px"}}>NFC</TableCell>
                                    <TableCell align="center"
                                               sx={{border: "1px solid #ddd", width: "150px"}}>Montant (€)</TableCell>
                                    <TableCell align="center"
                                               sx={{border: "1px solid #ddd", width: "150px"}}>Utilisateur</TableCell>
                                    <TableCell align="center"
                                               sx={{border: "1px solid #ddd", width: "120px"}}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cards && cards.length > 0 ? (
                                    cards.map((card) => (
                                        <TableRow key={card.id_carte}>
                                            <TableCell align="center" sx={{
                                                border: "1px solid #ddd",
                                                width: "50px"
                                            }}>{card.id_carte}</TableCell>
                                            <TableCell align="center" sx={{
                                                border: "1px solid #ddd",
                                                width: "150px"
                                            }}>{card.numero}</TableCell>
                                            <TableCell align="center" sx={{
                                                border: "1px solid #ddd",
                                                width: "50px"
                                            }}>{card.nfc}</TableCell>
                                            <TableCell align="center" sx={{
                                                border: "1px solid #ddd",
                                                width: "100px"
                                            }}>{card.montant}</TableCell>
                                            <TableCell align="center" sx={{
                                                border: "1px solid #ddd",
                                                width: "150px"
                                            }}>{card.login_utilisateur ? card.login_utilisateur : '—'}</TableCell>
                                            <TableCell align="center" sx={{border: "1px solid #ddd", width: "120px"}}>
                                                <Button onClick={() => handleDelete(card.id_carte)}
                                                        color="error"><Delete/></Button>
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
                <SnackbarError error={errorSnackbar} setError={setSnackbarError}/>
            </div>
            <Footer/>
        </>
    );
};