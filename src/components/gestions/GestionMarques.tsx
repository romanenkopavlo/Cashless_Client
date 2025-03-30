import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField,
    Typography
} from "@mui/material";
import {Delete, Edit} from "@mui/icons-material";
import {useEffect, useState} from "react";
import {useVariablesStore} from "../../stores/VariablesStore.ts";
import * as React from "react";
import { usePhonesStore } from "../../stores/PhonesStore.ts";
import { useMarquesStore } from "../../stores/MarquesStore.ts";
import Marque from "../../models/Marque.ts";
import {UpdateMarque} from "../../services_REST/serveur/admin/marques/UpdateMarque.ts";
import {GetPhones} from "../../services_REST/serveur/admin/phones/GetPhones.ts";
import {CreateMarque} from "../../services_REST/serveur/admin/marques/CreateMarque.ts";
import {DeleteMarque} from "../../services_REST/serveur/admin/marques/DeleteMarque.ts";
import {GetMarques} from "../../services_REST/serveur/admin/marques/GetMarques.ts";
import {SuccessMessage} from "../SuccessMessage.tsx";
import {SnackbarError} from "../SnackbarError.tsx";

export const GestionMarques = () => {
    const {marques, setMarques, addMarque, updateMarque, deleteMarque} = useMarquesStore();
    const {setPhones} = usePhonesStore();
    const {isFetchedMarques, setIsFetchedMarques} = useVariablesStore();

    const [error, setError] = useState<string | null>(null);
    const [errorSnackbar, setErrorSnackbar] = useState<string | null>(null);
    const [nomError, setNomError] = useState<string | null>(null);

    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Marque>(new Marque(0, ""));

    useEffect(() => {
        if (!isFetchedMarques) {
            setIsFetchedMarques(true)

            GetMarques()
                .then((data) => {
                    if (!data || !Array.isArray(data)) {
                        setMarques([]);
                    } else {
                        setMarques(data);
                    }
                })
                .catch((error) => {
                    console.error("Erreur lors de la récupération des marques:", error);
                    setMarques([]);
                });
        }
    }, [isFetchedMarques, setMarques, setIsFetchedMarques]);

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

    const handleOpen = (editing = false, marque: Marque | null = null) => {
        setIsEditing(editing);
        if (editing && marque) {
            setFormData(marque);
        } else {
            setFormData(new Marque(0, ""));
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setTimeout(() => {
            setFormData(new Marque(0, ""));
            setIsEditing(false);
            cleanErrors()
        }, 300);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        cleanErrors();
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        cleanErrors();

        if (formData.nom_marque.trim() === "") {
            setNomError("Le nom de la marque est obligatoire");
            return;
        }

        if (isEditing) {
            UpdateMarque(formData.id_marque, formData.nom_marque)
                .then((data) => {
                    setSuccessMessage(data.message);
                    updateMarque(data.updatedMarque);
                    return GetPhones();
                })
                .then((data) => {
                    if (!data || !Array.isArray(data)) {
                        setPhones([]);
                    } else {
                        setPhones(data);
                    }
                    handleClose();
                })
                .catch((error) => {
                    console.error("Erreur lors de la récupération des marques:", error);
                    setError(error.message)
                })
        } else {
            CreateMarque(formData.nom_marque)
                .then((data) => {
                    setSuccessMessage(data.message);
                    addMarque(data.newMarque);
                    handleClose();
                })
                .catch((error) => {
                    console.error("Erreur lors de la récupération des marques:", error);
                    setError(error.message)
                })
        }
    };

    const handleDelete = (id: number) => {
        DeleteMarque(id)
            .then((data) => {
                setSuccessMessage(data.message);
                deleteMarque(id);
                return GetPhones();
            })
            .then((data) => {
                if (!data || !Array.isArray(data)) {
                    setPhones([]);
                } else {
                    setPhones(data);
                }
            })
            .catch((error) => {
                console.error("Erreur lors de la suppression des marques:", error);
                setErrorSnackbar(error.message);
            });
    };

    const cleanErrors = () => {
        if (error) setError(null);
        if (nomError) setNomError(null);
    }

    return (
        <>
            <div style={{ padding: "20px", textAlign: "center" }}>
                <Typography variant="h5" sx={{ mt: 1 }}>
                    Gestion des marques
                </Typography>
                <Button variant="contained" onClick={() => handleOpen(false)} style={{ marginTop: "20px", backgroundColor: "#7f5656" }}>
                    Ajouter une marque
                </Button>
            </div>

            <SuccessMessage successMessage={successMessage} setSuccessMessage={setSuccessMessage}/>

            <div style={{ padding: "20px", display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <TableContainer component={Paper} sx={{maxHeight: 250, maxWidth: 600, boxShadow: 4, overflow: "auto", borderRadius: 2}}>
                    <Table sx={{ border: "1px solid #ddd" }}>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                <TableCell align="center" sx={{ border: "1px solid #ddd", width: "50px" }}>ID</TableCell>
                                <TableCell align="center" sx={{ border: "1px solid #ddd", width: "50px" }}>Nom</TableCell>
                                <TableCell align="center" sx={{ border: "1px solid #ddd", width: "50px" }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {marques && marques.length > 0 ? (
                                marques.map((marque) => (
                                    <TableRow key={marque.id_marque}>
                                        <TableCell align="center" sx={{ border: "1px solid #ddd", width: "50px" }}>{marque.id_marque}</TableCell>
                                        <TableCell align="center" sx={{ border: "1px solid #ddd", width: "50px" }}>{marque.nom_marque}</TableCell>
                                        <TableCell align="center" sx={{ border: "1px solid #ddd", width: "50px" }}>
                                            <Button onClick={() => handleOpen(true, marque)}><Edit sx={{color: "#7f5656"}}/></Button>
                                            <Button onClick={() => handleDelete(marque.id_marque)} color="error"><Delete /></Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} align="center">Aucune marque trouvée.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{isEditing ? "Modifier la marque" : "Ajouter une marque"}</DialogTitle>
                <DialogContent>
                    <TextField fullWidth margin="dense" variant="outlined" sx={styleCustom} label="Nom" name="nom_marque" value={formData.nom_marque} onChange={handleChange} error={!!nomError} helperText={nomError}/>
                    {error && (
                        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                            {error}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} sx={{color: "#7f5656"}}>Annuler</Button>
                    <Button onClick={handleSubmit} sx={{backgroundColor: "#7f5656"}} variant="contained">{isEditing ? "Modifier" : "Ajouter"}</Button>
                </DialogActions>
            </Dialog>

            <SnackbarError error={errorSnackbar} setError={setErrorSnackbar}/>
        </>
    )
}