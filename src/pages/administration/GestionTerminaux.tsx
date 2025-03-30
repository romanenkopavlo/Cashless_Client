import {Header} from "../../components/Header.tsx";
import {Footer} from "../../components/Footer.tsx";
import {
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {useVariablesStore} from "../../stores/VariablesStore.ts";
import {useEffect, useState} from "react";
import { useTerminalsStore } from "../../stores/TerminalsStore.ts";
import {GetTerminals} from "../../services_REST/serveur/admin/terminals/GetTerminals.ts";
import {DeleteTerminal} from "../../services_REST/serveur/admin/terminals/DeleteTerminal.ts";
import {SuccessMessage} from "../../components/SuccessMessage.tsx";
import {SnackbarError} from "../../components/SnackbarError.tsx";

export const GestionTerminaux = () => {
    const {terminals, setTerminals, deleteTerminal} = useTerminalsStore();
    const {isFetchedTerminals, setIsFetchedTerminals,} = useVariablesStore();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorSnackbar, setSnackbarError] = useState<string | null>(null);


    useEffect(() => {
        if (!isFetchedTerminals) {
            setIsFetchedTerminals(true)

            GetTerminals()
                .then((data) => {
                    if (!data || !Array.isArray(data)) {
                        setTerminals([]);
                    } else {
                        setTerminals(data);
                    }
                })
                .catch((error) => {
                    console.error("Erreur lors de la récupération des terminaux:", error);
                    setTerminals([]);
                });
        }
    }, [isFetchedTerminals, setIsFetchedTerminals, setTerminals]);

    const handleDelete = (id: number) => {
        DeleteTerminal(id)
            .then((data) => {
                setSuccessMessage(data.message);
                deleteTerminal(id)
            })
            .catch((error) => {
                console.error("Erreur lors de la suppression des terminaux:", error);
                setSnackbarError(error.message);
            })
    };
    
    return (
        <>
            <Header/>
            <div style={{height: "1065px"}}>
                <div style={{padding: "20px", textAlign: "center" }}>
                    <Typography variant="h5" sx={{ mt: 1 }}>
                        Gestion des terminaux
                    </Typography>
                </div>
                <SuccessMessage successMessage={successMessage} setSuccessMessage={setSuccessMessage}/>
                <div style={{ padding: "20px" }}>
                    <TableContainer component={Paper} sx={{maxHeight: 400, boxShadow: 4, overflow: "auto", borderRadius: 2}}>
                        <Table sx={{ border: "1px solid #ddd" }}>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                    <TableCell align="center" sx={{ border: "1px solid #ddd", width: "50px" }}>ID</TableCell>
                                    <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>Android ID</TableCell>
                                    <TableCell align="center" sx={{ border: "1px solid #ddd", width: "100px" }}>Téléphone</TableCell>
                                    <TableCell align="center" sx={{ border: "1px solid #ddd", width: "120px" }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {terminals && terminals.length > 0 ? (
                                    terminals.map((terminal) => (
                                        <TableRow key={terminal.id_terminal}>
                                            <TableCell align="center" sx={{ border: "1px solid #ddd", width: "50px" }}>{terminal.id_terminal}</TableCell>
                                            <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>{terminal.id_android}</TableCell>
                                            <TableCell align="center" sx={{ border: "1px solid #ddd", width: "100px" }}>{terminal.phone ? (terminal.phone.nom_marque + " " + terminal.phone.nom_modele) : '—'}</TableCell>
                                            <TableCell align="center" sx={{ border: "1px solid #ddd", width: "120px" }}>
                                                <Button onClick={() => handleDelete(terminal.id_terminal)} color="error"><Delete /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">Aucun terminal trouvé.</TableCell>
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
    )
}