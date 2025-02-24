import {useEffect, useState} from "react";
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
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, Typography
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import Stand from "../../models/users/Stand.ts";
import * as React from "react";
import {GetStands} from "../../services_REST/serveur/GetStands.ts";
import {CreateStand} from "../../services_REST/serveur/CreateStand.ts";
import {UpdateStand} from "../../services_REST/serveur/UpdateStand.ts";
import {DeleteStand} from "../../services_REST/serveur/DeleteStand.ts";

export const GestionStands = () => {
    const [stands, setStands] = useState<Stand[]>([]);

    const [error, setError] = useState<string | null>(null);
    const [nomError, setNomError] = useState<string | null>(null);
    const [categorieError, setCategorieError] = useState<string | null>(null);
    const [soldeError, setSoldeError] = useState<string | null>(null);
    const soldeRegex = /^(?:\d+|\d*[.,]?\d+)$/;

    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Stand>(new Stand(0, "", 0, ""));


    useEffect(() => {
        GetStands()
            .then((data) => setStands(data))
            .catch((error) => console.error("Erreur lors de la récupération des stands:", error));
    }, []);

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

    const handleOpen = (editing = false, stand: Stand | null = null) => {
        setIsEditing(editing);
        if (editing && stand) {
            setFormData(stand);
        } else {
            setFormData(new Stand(0, "", 0, ""));
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setTimeout(() => {
            setFormData(new Stand(0, "", 0, ""));
            setIsEditing(false);
            setError(null);
            setSoldeError(null);
            setCategorieError(null);
            setNomError(null)
        }, 300);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        if (!soldeRegex.test(String(formData.solde))) {
            setSoldeError("Veuillez entrer un nombre positif valide");
            return;
        }

        if (formData.nom_stand.trim() === "") {
            setNomError("Le nom du stand est obligatoire");
            return;
        }

        if (formData.nom_categorie.trim() === "") {
            setCategorieError("La catégorie est obligatoire");
            return;
        }

        setNomError(null);
        setCategorieError(null);
        setSoldeError(null);

        if (isEditing) {
            UpdateStand(formData.id_stand, formData.nom_stand, formData.solde, formData.nom_categorie)
                .then((data) => {
                    console.log(data);
                    return GetStands();
                })
                .then((data) => {
                    setStands(data);
                    handleClose();
                })
                .catch((error) => {
                    console.error("Erreur lors de la récupération des stands:", error);
                    setError(error.message)
                })
        } else {
            CreateStand(formData.nom_stand, formData.solde, formData.nom_categorie)
                .then((data) => {
                    console.log(data);
                    return GetStands();
                })
                .then((data) => {
                    setStands(data)
                    handleClose();
                })
                .catch((error) => {
                    console.error("Erreur lors de la récupération des stands:", error);
                    setError(error.message)
                })
        }
    };

    const handleDelete = (id: number) => {
        DeleteStand(id)
            .then((data) => {
                console.log(data);
                return GetStands();
            })
            .then((data) => setStands(data))
            .catch((error) => console.error("Erreur lors de la récupération des stands:", error));
    };

    return (
        <>
            <Header />
            <div style={{ padding: "20px", textAlign: "center" }}>
                <Button variant="contained" onClick={() => handleOpen(false)} style={{ marginTop: "20px", backgroundColor: "#7f5656" }}>
                    Ajouter un stand
                </Button>
            </div>
            <div style={{ padding: "20px" }}>
                <TableContainer component={Paper} sx={{maxHeight: 400, boxShadow: 4, overflow: "auto", borderRadius: 2}}>
                    <Table sx={{ border: "1px solid #ddd" }}>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                <TableCell align="center" sx={{ border: "1px solid #ddd", width: "50px" }}>ID</TableCell>
                                <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>Nom</TableCell>
                                <TableCell align="center" sx={{ border: "1px solid #ddd", width: "100px" }}>Solde (€)</TableCell>
                                <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>Catégorie</TableCell>
                                <TableCell align="center" sx={{ border: "1px solid #ddd", width: "120px" }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stands ? (
                                stands.map((stand) => (
                                    <TableRow key={stand.id_stand}>
                                        <TableCell align="center" sx={{ border: "1px solid #ddd", width: "50px" }}>{stand.id_stand}</TableCell>
                                        <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>{stand.nom_stand}</TableCell>
                                        <TableCell align="center" sx={{ border: "1px solid #ddd", width: "100px" }}>{stand.solde}</TableCell>
                                        <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>{stand.nom_categorie}</TableCell>
                                        <TableCell align="center" sx={{ border: "1px solid #ddd", width: "120px" }}>
                                            <Button onClick={() => handleOpen(true, stand)}><Edit sx={{color: "#7f5656"}}/></Button>
                                            <Button onClick={() => handleDelete(stand.id_stand)} color="error"><Delete /></Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">Aucun stand trouvé.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{isEditing ? "Modifier le stand" : "Ajouter un stand"}</DialogTitle>
                <DialogContent>
                    <TextField fullWidth margin="dense" variant="outlined" sx={styleCustom} label="Nom" name="nom_stand" value={formData.nom_stand} onChange={handleChange} error={!!nomError} helperText={nomError}/>
                    <TextField fullWidth margin="dense" variant="outlined" sx={styleCustom} label="Solde (€)" name="solde" type="number" value={formData.solde} onChange={handleChange} error={!!soldeError} helperText={soldeError}/>
                    <TextField fullWidth margin="dense" variant="outlined" sx={styleCustom} label="Catégorie" name="nom_categorie" value={formData.nom_categorie} onChange={handleChange} error={!!categorieError} helperText={categorieError}/>
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
            <Footer />
        </>
    );
};
