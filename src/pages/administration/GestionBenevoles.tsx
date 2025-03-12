import {Header} from "../../components/Header.tsx";
import {Footer} from "../../components/Footer.tsx";
import {
    Alert,
    Button, Container,
    Dialog, DialogActions, DialogContent,
    DialogTitle, FormControl, InputLabel, MenuItem,
    Paper, Select, Snackbar,
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
import { useVariablesStore } from "../../stores/VariablesStore.ts";
import {useBenevolesStore} from "../../stores/BenevolesStore.ts";
import Benevole from "../../models/Benevole.ts";
import {UpdateBenevole} from "../../services_REST/serveur/admin/benevoles/UpdateBenevole.ts";
import {CreateBenevole} from "../../services_REST/serveur/admin/benevoles/CreateBenevole.ts";
import {DeleteBenevole} from "../../services_REST/serveur/admin/benevoles/DeleteBenevole.ts";
import {validateForm} from "../../utils/validateForm.ts";
import {updateBenevoles} from "../../services/benevoles.ts";
import {updateFestivaliers} from "../../services/festivaliers.ts";
import {useFestivaliersStore} from "../../stores/FestivaliersStore.ts";

export const GestionBenevoles = () => {
    const {benevoles, setBenevoles, addBenevole, updateBenevole, deleteBenevole} = useBenevolesStore();
    const {setFestivaliers} = useFestivaliersStore();
    const {isFetchedBenevoles, isFetchedVisitors, setIsFetchedBenevoles, setIsFetchedVisitors} = useVariablesStore();
    const [password, setPassword] = useState<string>("");

    const [error, setError] = useState<string | null>(null);
    const [roleError, setRoleError] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string | null }>({
        nom: null,
        prenom: null,
        username: null,
        password: null,
    });

    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Benevole>(new Benevole(0, "", "", "", "", ""));

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openRoleDialog, setOpenRoleDialog] = useState(false);
    const [selectedRole, setSelectedRole] = useState<string>("");

    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!isFetchedBenevoles) {
            setIsFetchedBenevoles(true);
            updateBenevoles(setBenevoles);
        }
    }, [isFetchedBenevoles, setBenevoles, setIsFetchedBenevoles]);

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

    const handleOpen = (editing = false, benevole: Benevole | null = null) => {
        setIsEditing(editing);
        if (editing && benevole) {
            setFormData(benevole);
        } else {
            setFormData(new Benevole(0, "", "", "", "", ""));
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setTimeout(() => {
            setFormData(new Benevole(0, "", "", "", "", ""));
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
        const newErrors = validateForm(formData, isEditing, password);

        setErrors(newErrors);

        if (Object.values(newErrors).some((error) => error !== null)) {
            return;
        }

        if (isEditing) {
            UpdateBenevole(formData.id, formData.nom, formData.prenom, null, formData.login, null)
                .then((data) => {
                    setSuccessMessage(data.message);
                    updateBenevole(data.updatedBenevole);
                    handleClose();
                })
                .catch((error) => {
                    console.error("Erreur lors de la récupération des bénévoles:", error);
                    setError(error.message)
                })
        } else {
            CreateBenevole(formData.nom, formData.prenom, formData.login, password)
                .then((data) => {
                    setSuccessMessage(data.message);
                    addBenevole(data.newBenevole);
                    handleClose();
                })
                .catch((error) => {
                    console.error("Erreur lors de la récupération des bénévoles:", error);
                    setError(error.message)
                })
        }
    };

    const handleDelete = (id: number) => {
        DeleteBenevole(id)
            .then((data) => {
                setSuccessMessage(data.message);
                deleteBenevole(id);
            })
            .catch((error) => {
                console.error("Erreur lors de la suppression des bénévoles:", error);
                setError(error.message);
                setOpenSnackbar(true);
            });
    };

    const handleOpenRoleDialog = (benevole: Benevole) => {
        setFormData(benevole);
        setSelectedRole("Visiteur");
        setOpenRoleDialog(true);
    };

    const handleCloseRoleDialog = () => {
        setOpenRoleDialog(false);
        setTimeout(() => {
            setError(null);
            setRoleError(null);
            setFormData(new Benevole(0, "", "", "", "", ""));
        }, 300);
    };

    const handleCloseSnackbar = () => {
        setError(null);
        setOpenSnackbar(false);
    };

    const handleRoleSubmit = async () => {
        if (selectedRole.trim() === "") {
            setRoleError("Le rôle est obligatoire");
            return;
        }

        try {
            const data = await UpdateBenevole(formData.id, formData.nom, formData.prenom, null, formData.login, selectedRole);
            setSuccessMessage(data.message);
            updateFestivaliers(setFestivaliers);
            updateBenevoles(setBenevoles);
            if (!isFetchedVisitors) setIsFetchedVisitors(true);
            handleClose();
        } catch (error) {
            if (error instanceof Error) {
                console.error("Erreur lors de la récupération des utilisateurs:", error);
                setError(error.message);
                return;
            } else {
                console.error("Erreur inconnue:", error);
                setError("Une erreur inconnue est survenue.");
                return;
            }
        }

        setOpenRoleDialog(false);
    };

    return (
        <>
            <Header />
            <div style={{height: "1065px"}}>
            <div style={{ padding: "20px", textAlign: "center" }}>
                <Typography variant="h5" sx={{ mt: 1 }}>
                    Gestion des bénévoles
                </Typography>
                <Button variant="contained" onClick={() => handleOpen(false)} style={{ marginTop: "20px", backgroundColor: "#7f5656" }}>
                    Ajouter un bénévole
                </Button>
            </div>
            {successMessage && (
                <Container maxWidth="xs" sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Alert severity="success">
                        {successMessage}
                    </Alert>
                </Container>
            )}
            <div style={{ padding: "20px" }}>
                <TableContainer component={Paper} sx={{maxHeight: 400, boxShadow: 4, overflow: "auto", borderRadius: 2}}>
                    <Table sx={{ border: "1px solid #ddd" }}>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                <TableCell align="center" sx={{ border: "1px solid #ddd", width: "50px" }}>ID</TableCell>
                                <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>Nom</TableCell>
                                <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>Prénom</TableCell>
                                <TableCell align="center" sx={{ border: "1px solid #ddd", width: "100px" }}>Login</TableCell>
                                <TableCell align="center" sx={{ border: "1px solid #ddd", width: "100px" }}>Stand</TableCell>
                                <TableCell align="center" sx={{ border: "1px solid #ddd", width: "120px" }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {benevoles && benevoles.length > 0 ? (
                                benevoles.map((benevole) => (
                                    <TableRow key={benevole.id}>
                                        <TableCell align="center" sx={{ border: "1px solid #ddd", width: "50px" }}>{benevole.id}</TableCell>
                                        <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>{benevole.nom}</TableCell>
                                        <TableCell align="center" sx={{ border: "1px solid #ddd", width: "100px" }}>{benevole.prenom}</TableCell>
                                        <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>{benevole.login}</TableCell>
                                        <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>{benevole.noms_stands ? benevole.noms_stands : '—'}</TableCell>
                                        <TableCell align="center" sx={{ border: "1px solid #ddd", width: "120px" }}>
                                            <Button onClick={() => handleOpenRoleDialog(benevole)}><ManageAccounts sx={{ color: "#7f5656" }} /></Button>
                                            <Button onClick={() => handleOpen(true, benevole)}><Edit sx={{color: "#7f5656"}}/></Button>
                                            <Button onClick={() => handleDelete(benevole.id)} color="error"><Delete /></Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">Aucun bénévole trouvé.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{isEditing ? "Modifier le bénévole" : "Ajouter un bénévole"}</DialogTitle>
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
                            <MenuItem value="Visiteur">Visiteur</MenuItem>
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