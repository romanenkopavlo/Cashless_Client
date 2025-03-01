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
import Categorie from "../../models/Categorie.ts";
import {useVariablesStore} from "../../store/VariablesStore.ts";
import { useCategorieStore } from "../../store/CategorieStore.ts";
import * as React from "react";
import {UpdateCategory} from "../../services_REST/serveur/admin/categories/UpdateCategory.ts";
import {CreateCategory} from "../../services_REST/serveur/admin/categories/CreateCategory.ts";
import {DeleteCategory} from "../../services_REST/serveur/admin/categories/DeleteCategory.ts";
import {GetCategories} from "../../services_REST/serveur/admin/categories/GetCategories.ts";
import {useStandStore} from "../../store/StandStore.ts";
import {GetStands} from "../../services_REST/serveur/admin/stands/GetStands.ts";

export const GestionCategories = () => {
    const {categories, setCategories, addCategorie, updateCategorie, deleteCategorie} = useCategorieStore();
    const {setStands} = useStandStore();
    const {isFetchedCategories, setIsFetchedCategories} = useVariablesStore();

    const [error, setError] = useState<string | null>(null);
    const [nomError, setNomError] = useState<string | null>(null);

    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Categorie>(new Categorie(0, ""));

    useEffect(() => {
        if (!isFetchedCategories) {
            setIsFetchedCategories(true)

            GetCategories()
                .then((data) => {
                    if (!data || !Array.isArray(data)) {
                        setCategories([]);
                    } else {
                        setCategories(data);
                    }
                })
                .catch((error) => {
                    console.error("Erreur lors de la récupération des catégories:", error);
                    setCategories([]);
                });
        }
    }, [isFetchedCategories, setCategories, setIsFetchedCategories]);

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
            setError(null);
            setNomError(null)
        }, 300);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        if (formData.nom_categorie.trim() === "") {
            setNomError("Le nom de la catérogie est obligatoire");
            return;
        }

        if (isEditing) {
            UpdateCategory(formData.id_categorie, formData.nom_categorie)
                .then((data) => {
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
            .then(() => {
                deleteCategorie(id)
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
            <div style={{ padding: "20px" }}>
                <TableContainer component={Paper} sx={{maxHeight: 400, boxShadow: 4, overflow: "auto", borderRadius: 2}}>
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
                                    <TableCell colSpan={5} align="center">Aucune catégorie trouvée.</TableCell>
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