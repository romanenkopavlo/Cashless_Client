import {Header} from "../../components/Header.tsx";
import {Footer} from "../../components/Footer.tsx";
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem,
    Paper, Select, SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {Delete, Edit} from "@mui/icons-material";
import {useVariablesStore} from "../../stores/VariablesStore.ts";
import {useEffect, useState} from "react";
import { useTerminalsStore } from "../../stores/TerminalsStore.ts";
import { useStandsStore } from "../../stores/StandsStore.ts";
import Terminal from "../../models/Terminal.ts";
import {updateStands} from "../../services/standsServices.ts";
import {GetTerminals} from "../../services_REST/serveur/admin/terminals/GetTerminals.ts";
import {UpdateTerminal} from "../../services_REST/serveur/admin/terminals/UpdateTerminal.ts";
import {DeleteTerminal} from "../../services_REST/serveur/admin/terminals/DeleteTerminal.ts";

export const GestionTerminaux = () => {
    const {terminals, setTerminals, updateTerminal, deleteTerminal} = useTerminalsStore();
    const {stands, setStands} = useStandsStore();
    const {isFetchedTerminals, isFetchedStands, setIsFetchedTerminals, setIsFetchedStands} = useVariablesStore();

    const [error, setError] = useState<string | null>(null);
    const [standError, setStandError] = useState<string | null>(null);

    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<Terminal>(new Terminal(0, "", "", null));

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
        if (!isFetchedStands) {
            setIsFetchedStands(true)

            updateStands(setStands)
        }
    }, [isFetchedStands, isFetchedTerminals, setIsFetchedStands, setIsFetchedTerminals, setStands, setTerminals]);

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
        }
    }

    const handleOpen = (terminal: Terminal | null = null) => {
        if (terminal) {
            setFormData(terminal);
        } else {
            setFormData(new Terminal(0, "", "", null));
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setTimeout(() => {
            setFormData(new Terminal(0, "", "", null));
            setError(null);
        }, 300);
    };

    const handleSelectChange = (event: SelectChangeEvent) => {
        setFormData({
            ...formData,
            [event.target.name as string]: event.target.value
        });
    };

    const handleSubmit = () => {
        if (formData.stand_nom.trim() === "") {
            setStandError("Le nom du stand est obligatoire");
            return;
        }

        UpdateTerminal(formData.id_terminal, formData.stand_nom)
            .then((data) => {
                updateTerminal(data.updatedTerminal);
                handleClose();
            })
            .catch((error) => {
                console.error("Erreur lors de la récupération des terminaux:", error);
                setError(error.message)
            })
    };

    const handleDelete = (id: number) => {
        DeleteTerminal(id)
            .then(() => {
                deleteTerminal(id)
            })
            .catch((error) => console.error("Erreur lors de la suppression des terminaux:", error));
    };
    
    return (
        <>
            <Header/>
            <div style={{height: "1065px"}}>
                <div style={{padding: "20px", textAlign: "center" }}>
                    <Typography variant="h5" sx={{ mt: 1 }}>
                        Gestion des terminaux
                    </Typography>
                    {stands && stands.length > 0 ? (
                        ""
                    ) : (
                        <Typography variant="h6" sx={{ mt: 1 }}>L'afféctation des terminaux par stand est impossible. Veuillez d'abord ajouter des stands.</Typography>
                    )}
                </div>
                <div style={{ padding: "20px" }}>
                    <TableContainer component={Paper} sx={{maxHeight: 400, boxShadow: 4, overflow: "auto", borderRadius: 2}}>
                        <Table sx={{ border: "1px solid #ddd" }}>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                    <TableCell align="center" sx={{ border: "1px solid #ddd", width: "50px" }}>ID</TableCell>
                                    <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>Android ID</TableCell>
                                    <TableCell align="center" sx={{ border: "1px solid #ddd", width: "100px" }}>Téléphone</TableCell>
                                    <TableCell align="center" sx={{ border: "1px solid #ddd", width: "100px" }}>Stand</TableCell>
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
                                            <TableCell align="center" sx={{ border: "1px solid #ddd", width: "100px" }}>{terminal.stand_nom ? terminal.stand_nom : '—'}</TableCell>
                                            <TableCell align="center" sx={{ border: "1px solid #ddd", width: "120px" }}>
                                                {stands && stands.length > 0 && (<Button onClick={() => handleOpen(terminal)}><Edit sx={{color: "#7f5656"}}/></Button>)}
                                                <Button onClick={() => handleDelete(terminal.id_terminal)} color="error"><Delete /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">Aucun terminal trouvé.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>Modifier le terminal</DialogTitle>
                    <DialogContent>
                        <FormControl fullWidth margin="dense" sx={styleCustom} error={!!standError}>
                            <InputLabel id="marque-label">Stand</InputLabel>
                            <Select
                                labelId="stand-label"
                                label="Stand"
                                name="stand_nom"
                                value={formData.stand_nom}
                                onChange={handleSelectChange}
                                MenuProps={{
                                    PaperProps: {
                                        style: {
                                            maxHeight: 180,
                                            overflow: 'auto',
                                        },
                                    },
                                }}
                            >
                                {stands && stands.length > 0 && stands.map((stand) => (
                                    <MenuItem key={stand.id_stand} value={stand.nom_stand}>
                                        {stand.nom_stand}
                                    </MenuItem>
                                ))}
                            </Select>
                            {standError && (
                                <Typography color="error" variant="caption" sx={{mt: 0.5}}>
                                    {standError}
                                </Typography>
                            )}
                        </FormControl>
                        {error && (
                            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                                {error}
                            </Typography>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} sx={{color: "#7f5656"}}>Annuler</Button>
                        <Button onClick={handleSubmit} sx={{backgroundColor: "#7f5656"}} variant="contained">Modifier</Button>
                    </DialogActions>
                </Dialog>
            </div>
            <Footer/>
        </>
    )
}