import {Header} from "../../components/Header.tsx";
import {Footer} from "../../components/Footer.tsx";
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem,
    Paper, Select, SelectChangeEvent, Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField,
    Typography
} from "@mui/material";
import {Delete, Edit} from "@mui/icons-material";
import * as React from "react";
import {useVariablesStore} from "../../stores/VariablesStore.ts";
import {useEffect, useState} from "react";
import { usePhonesStore } from "../../stores/PhonesStore.ts";
import Phone from "../../models/Phone.ts";
import { GestionMarques } from "./GestionMarques.tsx";
import {useMarquesStore} from "../../stores/MarquesStore.ts";
import {UpdatePhone} from "../../services_REST/serveur/admin/phones/UpdatePhone.ts";
import {CreatePhone} from "../../services_REST/serveur/admin/phones/CreatePhone.ts";
import {GetPhones} from "../../services_REST/serveur/admin/phones/GetPhones.ts";
import {DeletePhone} from "../../services_REST/serveur/admin/phones/DeletePhone.ts";

export const GestionPhones = () => {
    const {phones, setPhones, addPhone, updatePhone, deletePhone} = usePhonesStore();
    const {marques} = useMarquesStore();
    const {isFetchedPhones, setIsFetchedPhones} = useVariablesStore();

    const [error, setError] = useState<string | null>(null);
    const [marqueError, setMarqueError] = useState<string | null>(null);
    const [modeleError, setModeleError] = useState<string | null>(null);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Phone>(new Phone(0, "", ""));

    useEffect(() => {
        if (!isFetchedPhones) {
            setIsFetchedPhones(true)

            GetPhones()
                .then((data) => {
                    if (!data || !Array.isArray(data)) {
                        setPhones([]);
                    } else {
                        setPhones(data);
                    }
                })
                .catch((error) => {
                    console.error("Erreur lors de la récupération des téléphones:", error);
                    setPhones([]);
                });
        }
    }, [isFetchedPhones, setPhones, setIsFetchedPhones]);

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

    const handleOpen = (editing = false, phone: Phone | null = null) => {
        setIsEditing(editing);
        if (editing && phone) {
            setFormData(phone);
        } else {
            setFormData(new Phone(0, "", ""));
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setTimeout(() => {
            setFormData(new Phone(0, "", ""));
            setIsEditing(false);
            setError(null);
            setModeleError(null);
            setMarqueError(null);
        }, 300);
    };

    const handleCloseSnackbar = () => {
        setError(null);
        setOpenSnackbar(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (event: SelectChangeEvent) => {
        setFormData({
            ...formData,
            [event.target.name as string]: event.target.value
        });
    };

    const handleSubmit = () => {
        if (formData.nom_marque.trim() === "") {
            setMarqueError("La marque est obligatoire");
            return;
        }

        if (formData.nom_modele.trim() === "") {
            setModeleError("Le modèle est obligatoire");
            return;
        }

        if (isEditing) {
            UpdatePhone(formData.id_phone, formData.nom_marque, formData.nom_modele)
                .then((data) => {
                    updatePhone(data.updatedPhone);
                    handleClose();
                })
                .catch((error) => {
                    console.error("Erreur lors de la récupération des téléphones:", error);
                    setError(error.message)
                })
        } else {
            CreatePhone(formData.nom_marque, formData.nom_modele)
                .then((data) => {
                    addPhone(data.newPhone);
                    handleClose();
                })
                .catch((error) => {
                    console.error("Erreur lors de la récupération des téléphones:", error);
                    setError(error.message)
                })
        }
    };

    const handleDelete = (id: number) => {
        DeletePhone(id)
            .then(() => {
                deletePhone(id)
            })
            .catch((error) => {
                console.error("Erreur lors de la suppression des téléphones:", error)
                setError(error.message)
                setOpenSnackbar(true);
            });
    };

    return (
        <>
            <Header />
            <div style={{height: "1065px"}}>
                <div style={{padding: "20px", textAlign: "center" }}>
                    <Typography variant="h5" sx={{ mt: 1 }}>
                        Gestion des téléphones
                    </Typography>
                    {marques && marques.length > 0 ? (
                        <Button variant="contained" onClick={() => handleOpen(false)} style={{ marginTop: "20px", backgroundColor: "#7f5656" }}>
                            Ajouter un téléphone
                        </Button>
                    ) : (
                        <Typography variant="h6" sx={{ mt: 1 }}>L'ajout d'un téléphone est impossible. Veuillez d'abord ajouter des marques.</Typography>
                    )}
                </div>
                <div style={{ padding: "20px" }}>
                    <TableContainer component={Paper} sx={{maxHeight: 400, boxShadow: 4, overflow: "auto", borderRadius: 2}}>
                        <Table sx={{ border: "1px solid #ddd" }}>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                    <TableCell align="center" sx={{ border: "1px solid #ddd", width: "50px" }}>ID</TableCell>
                                    <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>Marque</TableCell>
                                    <TableCell align="center" sx={{ border: "1px solid #ddd", width: "100px" }}>Modèle</TableCell>
                                    <TableCell align="center" sx={{ border: "1px solid #ddd", width: "120px" }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {phones && phones.length > 0 ? (
                                    phones.map((phone) => (
                                        <TableRow key={phone.id_phone}>
                                            <TableCell align="center" sx={{ border: "1px solid #ddd", width: "50px" }}>{phone.id_phone}</TableCell>
                                            <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>{phone.nom_marque ? phone.nom_marque : '—'}</TableCell>
                                            <TableCell align="center" sx={{ border: "1px solid #ddd", width: "100px" }}>{phone.nom_modele}</TableCell>
                                            <TableCell align="center" sx={{ border: "1px solid #ddd", width: "120px" }}>
                                                {marques && marques.length > 0 && (<Button onClick={() => handleOpen(true, phone)}><Edit sx={{color: "#7f5656"}}/></Button>)}
                                                <Button onClick={() => handleDelete(phone.id_phone)} color="error"><Delete /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">Aucun téléphone trouvé.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>

                <GestionMarques/>
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>{isEditing ? "Modifier le téléphone" : "Ajouter un téléphone"}</DialogTitle>
                    <DialogContent>
                        <FormControl fullWidth margin="dense" sx={styleCustom} error={!!marqueError}>
                            <InputLabel id="marque-label">Marque</InputLabel>
                            <Select
                                labelId="marque-label"
                                label="Marque"
                                name="nom_marque"
                                value={formData.nom_marque}
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
                                {marques && marques.length > 0 && marques.map((marque) => (
                                    <MenuItem key={marque.id_marque} value={marque.nom_marque}>
                                        {marque.nom_marque}
                                    </MenuItem>
                                ))}
                            </Select>
                            {marqueError && (
                                <Typography color="error" variant="caption" sx={{mt: 0.5}}>
                                    {marqueError}
                                </Typography>
                            )}
                        </FormControl>
                        <TextField fullWidth margin="dense" variant="outlined" sx={styleCustom} label="Modèle" name="nom_modele" value={formData.nom_modele} onChange={handleChange} error={!!modeleError} helperText={modeleError}/>
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

                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    message={error}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center'
                    }}
                    action={
                        <Button sx={{color: "#fff"}} size="small" onClick={handleCloseSnackbar}>
                            Fermer
                        </Button>
                    }
                />
            </div>
            <Footer />
        </>
    )
}