import {Header} from "../../components/Header.tsx";
import {Footer} from "../../components/Footer.tsx";
import {
    Button,
    Dialog, DialogActions, DialogContent,
    DialogTitle, FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField, Typography
} from "@mui/material";
import {Delete, Edit, ManageAccounts} from "@mui/icons-material";
import * as React from "react";
import {useEffect, useState} from "react";
import User from "../../models/User.ts";
import { UpdateFestivalier } from "../../services_REST/serveur/admin/festivaliers/UpdateFestivalier.ts";
import {CreateFestivalier} from "../../services_REST/serveur/admin/festivaliers/CreateFestivalier.ts";
import {DeleteFestivalier} from "../../services_REST/serveur/admin/festivaliers/DeleteFestivalier.ts";
import {useFestivaliersStore} from "../../stores/FestivaliersStore.ts";
import { useVariablesStore } from "../../stores/VariablesStore.ts";
import {validateForm} from "../../utils/validateForm.ts";
import {useCardsStore} from "../../stores/CardsStore.ts";
import {useTransactionsStore} from "../../stores/TransactionsStore.ts";
import {updateCards} from "../../services/cards.ts";
import {updateTransactions} from "../../services/transactions.ts";
import {updateBenevoles} from "../../services/benevoles.ts";
import {useBenevolesStore} from "../../stores/BenevolesStore.ts";
import {updateFestivaliers} from "../../services/festivaliers.ts";
import {SnackbarError} from "../../components/SnackbarError.tsx";
import {SuccessMessage} from "../../components/SuccessMessage.tsx";

export const GestionFestivaliers = () => {
    const {festivaliers, setFestivaliers, addFestivalier, updateFestivalier, deleteFestivalier} = useFestivaliersStore();
    const {setBenevoles} = useBenevolesStore();
    const {setCards} = useCardsStore();
    const {setTransactions} = useTransactionsStore();
    const {isFetchedVisitors, isFetchedBenevoles, isFetchedCards, isFetchedTransactions, setIsFetchedVisitors, setIsFetchedBenevoles, setIsFetchedCards, setIsFetchedTransactions} = useVariablesStore();
    const [password, setPassword] = useState<string>("");

    const [error, setError] = useState<string | null>(null);
    const [errorSnackbar, setSnackbarError] = useState<string | null>(null);
    const [roleError, setRoleError] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string | null }>({
        nom: null,
        prenom: null,
        username: null,
        password: null,
    });

    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<User>(new User(0, "", "", "", ""));

    const [openRoleDialog, setOpenRoleDialog] = useState(false);
    const [selectedRole, setSelectedRole] = useState<string>("");

    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!isFetchedVisitors) {
            setIsFetchedVisitors(true)
            updateFestivaliers(setFestivaliers)
        }
    }, [isFetchedVisitors, setFestivaliers, setIsFetchedVisitors]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

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

    const handleSubmit = async () => {
        const newErrors = validateForm(formData, isEditing, password);

        setErrors(newErrors);

        if (Object.values(newErrors).some((error) => error !== null)) {
            return;
        }

        if (isEditing) {
            try {
                const data = await UpdateFestivalier(formData.id, formData.nom, formData.prenom, formData.login, null)
                setSuccessMessage(data.message);

                updateFestivalier(data.updatedFestivalier);
                updateTransactions(setTransactions);
                updateCards(setCards);

                if (!isFetchedTransactions) setIsFetchedTransactions(true);
                if (!isFetchedCards) setIsFetchedCards(true);

                handleClose();
            } catch (error) {
                if (error instanceof Error) {
                    console.error("Erreur lors de la récupération des festivaliers:", error);
                    setError(error.message);
                } else {
                    console.error("Erreur inconnue:", error);
                    setError("Une erreur inconnue est survenue.");
                }
            }
        } else {
            CreateFestivalier(formData.nom, formData.prenom, formData.login, password)
                .then((data) => {
                    setSuccessMessage(data.message);
                    addFestivalier(data.newFestivalier);
                    handleClose();
                })
                .catch((error) => {
                    console.error("Erreur lors de la récupération des festivaliers:", error);
                    setError(error.message)
                })
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const data = await DeleteFestivalier(id);
            setSuccessMessage(data.message);
            deleteFestivalier(id);
        } catch (error) {
            if (error instanceof Error) {
                console.error("Erreur lors de la récupération des utilisateurs:", error);
                setSnackbarError(error.message);
                return;
            } else {
                console.error("Erreur inconnue:", error);
                setSnackbarError("Une erreur inconnue est survenue.");
                return;
            }
        }
    };

    const handleOpenRoleDialog = (user: User) => {
        setFormData(user);
        setSelectedRole("Bénévole");
        setOpenRoleDialog(true);
    };

    const handleCloseRoleDialog = () => {
        setOpenRoleDialog(false);
        setTimeout(() => {
            setError(null);
            setRoleError(null);
            setFormData(new User(0, "", "", "", ""));
        }, 300);
    };

    const handleRoleSubmit = async () => {
        if (selectedRole.trim() === "") {
            setRoleError("Le rôle est obligatoire");
            return;
        }

        try {
            const data = await UpdateFestivalier(formData.id, formData.nom, formData.prenom, formData.login, selectedRole);
            setSuccessMessage(data.message);
            updateFestivaliers(setFestivaliers);
            updateBenevoles(setBenevoles);
            if (!isFetchedBenevoles) setIsFetchedBenevoles(true);
            handleCloseRoleDialog();
        } catch (error) {
            if (error instanceof Error) {
                console.error("Erreur lors de la récupération des utilisateurs:", error);
                setError(error.message);
            } else {
                console.error("Erreur inconnue:", error);
                setError("Une erreur inconnue est survenue.");
            }
        }
    };

    return (
        <>
            <Header />
            <div style={{height: "1100px"}}>
            <div style={{ padding: "20px", textAlign: "center" }}>
                <Typography variant="h5" sx={{ mt: 1 }}>
                    Gestion des festivaliers
                </Typography>
                <Button variant="contained" onClick={() => handleOpen(false)} style={{ marginTop: "20px", backgroundColor: "#7f5656" }}>
                    Ajouter un festivalier
                </Button>
            </div>

            <SuccessMessage successMessage={successMessage} setSuccessMessage={setSuccessMessage}/>

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
                                            <Button onClick={() => handleOpenRoleDialog(festivalier)}><ManageAccounts sx={{ color: "#7f5656" }} /></Button>
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

            <Dialog open={openRoleDialog} onClose={handleCloseRoleDialog}>
                <DialogTitle>Changer le rôle</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="dense" sx={styleCustom} error={!!roleError}>
                        <InputLabel id="role-label">Rôle</InputLabel>
                        <Select
                            label="Rôle"
                            name="nom_role"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                        >
                            <MenuItem value="Bénévole">Bénévole</MenuItem>
                            <MenuItem value="Administrateur">Administrateur</MenuItem>
                        </Select>
                        {roleError && (
                            <Typography color="error" variant="caption" sx={{mt: 0.5}}>
                                {roleError}
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
                    <Button onClick={handleCloseRoleDialog} sx={{color: "#7f5656"}}>Annuler</Button>
                    <Button onClick={handleRoleSubmit} sx={{backgroundColor: "#7f5656"}} variant="contained">Modifier</Button>
                </DialogActions>
            </Dialog>
            <SnackbarError error={errorSnackbar} setError={setSnackbarError}/>
            </div>
            <Footer />
        </>
    )
}