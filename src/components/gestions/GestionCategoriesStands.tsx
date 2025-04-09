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
import {useState} from "react";
import Categorie from "../../models/Categorie.ts";
import { useCategoriesStore } from "../../stores/CategoriesStore.ts";
import * as React from "react";
import {UpdateCategory} from "../../services_REST/serveur/admin/categories/UpdateCategory.ts";
import {CreateCategory} from "../../services_REST/serveur/admin/categories/CreateCategory.ts";
import {DeleteCategory} from "../../services_REST/serveur/admin/categories/DeleteCategory.ts";
import {useStandsStore} from "../../stores/StandsStore.ts";
import {GetStands} from "../../services_REST/serveur/admin/stands/GetStands.ts";
import {SuccessMessage} from "../SuccessMessage.tsx";

export const GestionCategories = () => {
    const {categories, addCategorie, updateCategorie, deleteCategorie} = useCategoriesStore();
    const {setStands} = useStandsStore();

    const [error, setError] = useState<string | null>(null);
    const [nomError, setNomError] = useState<string | null>(null);

    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Categorie>(new Categorie(0, ""));

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

    const handleOpen = (editing = false, categorie: Categorie | null = null) => {
        setIsEditing(editing);
        if (editing && categorie) {
            setFormData(categorie);
        } else {
            setFormData(new Categorie(0, ""));
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setTimeout(() => {
            setFormData(new Categorie(0, ""));
            setIsEditing(false);
            cleanErrors();
        }, 300);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        cleanErrors();
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        cleanErrors();

        if (formData.nom_categorie.trim() === "") {
            setNomError("Le nom de la catérogie est obligatoire");
            return;
        }

        if (isEditing) {
            UpdateCategory(formData.id_categorie, formData.nom_categorie)
                .then((data) => {
                    setSuccessMessage(data.message);
                    updateCategorie(data.updatedCategorie);
                    return GetStands();
                })
                .then((data) => {
                    if (!data || !Array.isArray(data)) {
                        setStands([]);
                    } else {
                        setStands(data);
                    }
                  handleClose();
                })
                .catch((error) => {
                    console.error("Erreur lors de la récupération des catégories:", error);
                    setError(error.message)
                })
        } else {
            CreateCategory(formData.nom_categorie)
                .then((data) => {
                    setSuccessMessage(data.message);
                    addCategorie(data.newCategorie);
                    handleClose();
                })
                .catch((error) => {
                    console.error("Erreur lors de la récupération des catégories:", error);
                    setError(error.message)
                })
        }
    };

    const handleDelete = (id: number) => {
        DeleteCategory(id)
            .then((data) => {
                setSuccessMessage(data.message);
                deleteCategorie(id);
                return GetStands();
            })
            .then((data) => {
                if (!data || !Array.isArray(data)) {
                    setStands([]);
                } else {
                    setStands(data);
                }
            })
            .catch((error) => console.error("Erreur lors de la suppression des catégories:", error));
    };

    const cleanErrors = () => {
        if (error) setError(null);
        if (nomError) setNomError(null);
    }

    return (
        <>
            <div style={{ padding: "20px", textAlign: "center" }}>
                <Typography variant="h5" sx={{ mt: 1 }}>
                    Gestion des catégories de stands
                </Typography>
                <Button variant="contained" onClick={() => handleOpen(false)} style={{ marginTop: "20px", backgroundColor: "#7f5656" }}>
                    Ajouter une catégorie
                </Button>
            </div>
            <SuccessMessage successMessage={successMessage} setSuccessMessage={setSuccessMessage}/>
            <div style={{ padding: "20px", display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <TableContainer component={Paper} sx={{maxHeight: 250, maxWidth: 600, boxShadow: 4, overflow: "auto", borderRadius: 2}}>
                    <Table sx={{ border: "1px solid #ddd" }}>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                <TableCell align="center" sx={{ border: "1px solid #ddd", width: "50px" }}>ID</TableCell>
                                <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>Nom</TableCell>
                                <TableCell align="center" sx={{ border: "1px solid #ddd", width: "120px" }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categories && categories.length > 0 ? (
                                categories.map((categorie) => (
                                    <TableRow key={categorie.id_categorie}>
                                        <TableCell align="center" sx={{ border: "1px solid #ddd", width: "50px" }}>{categorie.id_categorie}</TableCell>
                                        <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>{categorie.nom_categorie}</TableCell>
                                        <TableCell align="center" sx={{ border: "1px solid #ddd", width: "120px" }}>
                                            <Button onClick={() => handleOpen(true, categorie)}><Edit sx={{color: "#7f5656"}}/></Button>
                                            <Button onClick={() => handleDelete(categorie.id_categorie)} color="error"><Delete /></Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} align="center">Aucune catégorie trouvée.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{isEditing ? "Modifier la catégorie" : "Ajouter une catégorie"}</DialogTitle>
                <DialogContent>
                    <TextField fullWidth margin="dense" variant="outlined" sx={styleCustom} label="Nom" name="nom_categorie" value={formData.nom_categorie} onChange={handleChange} error={!!nomError} helperText={nomError}/>
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
        </>
    )
}