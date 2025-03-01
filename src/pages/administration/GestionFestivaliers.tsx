import {Header} from "../../components/Header.tsx";
import {Footer} from "../../components/Footer.tsx";
import {
    Button,
    Dialog, DialogActions, DialogContent,
    DialogTitle,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField, Typography
} from "@mui/material";
import {Delete, Edit} from "@mui/icons-material";
import * as React from "react";
import {useEffect, useState} from "react";
import User from "../../models/User.ts";
import {GetFestivaliers} from "../../services_REST/serveur/admin/festivaliers/GetFestivaliers.ts";
import { UpdateFestivalier } from "../../services_REST/serveur/admin/festivaliers/UpdateFestivalier.ts";
import {CreateFestivalier} from "../../services_REST/serveur/admin/festivaliers/CreateFestivalier.ts";
import {DeleteFestivalier} from "../../services_REST/serveur/admin/festivaliers/DeleteFestivalier.ts";
import {useFestivalierStore} from "../../store/FestivalierStore.ts";
import { useVariablesStore } from "../../store/VariablesStore.ts";
import {validateForm} from "../../utils/validateForm.ts";

export const GestionFestivaliers = () => {
    const {festivaliers, setFestivaliers, addFestivalier, updateFestivalier, deleteFestivalier} = useFestivalierStore();
    const {isFetchedVisitors, setIsFetchedVisitors} = useVariablesStore();
    const [password, setPassword] = useState<string>("");

    const [error, setError] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string | null }>({
        nom: null,
        prenom: null,
        username: null,
        password: null,
    });

    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<User>(new User(0, "", "", "", ""));

    useEffect(() => {
        if (!isFetchedVisitors) {
            setIsFetchedVisitors(true)

            GetFestivaliers()
                .then((data) => {
                    if (!data || !Array.isArray(data)) {
                        setFestivaliers([]);
                    } else {
                        setFestivaliers(data);
                    }
                })
                .catch((error) => {
                    console.error("Erreur lors de la récupération des festivaliers:", error);
                    setFestivaliers([]);
                });
        }
    }, [isFetchedVisitors, setFestivaliers, setIsFetchedVisitors]);

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

    const handleOpen = (editing = false, user: User | null = null) => {
        setIsEditing(editing);
        if (editing && user) {
            setFormData(user);
        } else {
            setFormData(new User(0, "", "", "", ""));
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setTimeout(() => {
            setFormData(new User(0, "", "", "", ""));
            setPassword("");
            setIsEditing(false);
            setError(null);
            setErrors({nom: null, prenom: null, username: null, password: null});
        }, 300);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleSubmit = () => {
        const newErrors = validateForm(formData, isEditing, password, "visitor");

        setErrors(newErrors);

        if (Object.values(newErrors).some((error) => error !== null)) {
            return;
        }

        if (isEditing) {
            UpdateFestivalier(formData.id, formData.nom, formData.prenom, formData.login)
                .then((data) => {
                    updateFestivalier(data.updatedFestivalier);
                    handleClose();
                })
                .catch((error) => {
                    console.error("Erreur lors de la récupération des festivaliers:", error);
                    setError(error.message)
                })
        } else {
            CreateFestivalier(formData.nom, formData.prenom, formData.login, password)
                .then((data) => {
                    addFestivalier(data.newFestivalier);
                    handleClose();
                })
                .catch((error) => {
                    console.error("Erreur lors de la récupération des festivaliers:", error);
                    setError(error.message)
                })
        }
    };

    const handleDelete = (id: number) => {
        DeleteFestivalier(id)
            .then(() => {
                deleteFestivalier(id);
            })
            .catch((error) => console.error("Erreur lors de la suppression des festivaliers:", error));
    };

    return (
        <>
            <Header />
            <div style={{ padding: "20px", textAlign: "center" }}>
                <Typography variant="h5" sx={{ mt: 1 }}>
                    Gestion des festivaliers
                </Typography>
                <Button variant="contained" onClick={() => handleOpen(false)} style={{ marginTop: "20px", backgroundColor: "#7f5656" }}>
                    Ajouter un festivalier
                </Button>
            </div>
            <div style={{ padding: "20px" }}>
                <TableContainer component={Paper} sx={{maxHeight: 400, boxShadow: 4, overflow: "auto", borderRadius: 2}}>
                    <Table sx={{ border: "1px solid #ddd" }}>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                <TableCell align="center" sx={{ border: "1px solid #ddd", width: "50px" }}>ID</TableCell>
                                <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>Nom</TableCell>
                                <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>Prénom</TableCell>
                                <TableCell align="center" sx={{ border: "1px solid #ddd", width: "100px" }}>Login</TableCell>
                                <TableCell align="center" sx={{ border: "1px solid #ddd", width: "120px" }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {festivaliers && festivaliers.length > 0 ? (
                                festivaliers.map((festivalier) => (
                                    <TableRow key={festivalier.id}>
                                        <TableCell align="center" sx={{ border: "1px solid #ddd", width: "50px" }}>{festivalier.id}</TableCell>
                                        <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>{festivalier.nom}</TableCell>
                                        <TableCell align="center" sx={{ border: "1px solid #ddd", width: "100px" }}>{festivalier.prenom}</TableCell>
                                        <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>{festivalier.login}</TableCell>
                                        <TableCell align="center" sx={{ border: "1px solid #ddd", width: "120px" }}>
                                            <Button onClick={() => handleOpen(true, festivalier)}><Edit sx={{color: "#7f5656"}}/></Button>
                                            <Button onClick={() => handleDelete(festivalier.id)} color="error"><Delete /></Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">Aucun festivalier trouvé.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{isEditing ? "Modifier le festivalier" : "Ajouter un festivalier"}</DialogTitle>
                <DialogContent>
                    <TextField fullWidth margin="dense" variant="outlined" sx={styleCustom} label="Nom" name="nom" value={formData.nom} onChange={handleChange} error={!!errors.nom} helperText={errors.nom}/>
                    <TextField fullWidth margin="dense" variant="outlined" sx={styleCustom} label="Prénom" name="prenom" value={formData.prenom} onChange={handleChange} error={!!errors.prenom} helperText={errors.prenom}/>
                    <TextField fullWidth margin="dense" variant="outlined" sx={styleCustom} label="Login" name="login" value={formData.login} onChange={handleChange} error={!!errors.username} helperText={errors.username}/>
                    {!isEditing && (<TextField fullWidth margin="dense" variant="outlined" sx={styleCustom} label="Mot de passe" name="password" type="password" value={password} onChange={handlePasswordChange} error={!!errors.password} helperText={errors.password}/>)}
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
    )
}