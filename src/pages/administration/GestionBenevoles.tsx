import {Header} from "../../components/Header.tsx";
import {Footer} from "../../components/Footer.tsx";
import {
    Alert,
    Button, Container,
    Dialog, DialogActions, DialogContent,
    DialogTitle, FormControl, Grid2, IconButton, InputLabel, List, ListItem, ListItemText, MenuItem,
    Paper, Select, SelectChangeEvent,
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
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import {AffectationBenevole} from "../../services_REST/serveur/admin/benevoles/AffectationBenevole.ts";
import {separerStands, updateStands} from "../../services/stands.ts";
import {useStandsStore} from "../../stores/StandsStore.ts";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ApartmentIcon from "@mui/icons-material/Apartment";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import Stand from "../../models/Stand.ts";
import {GetBenevoles} from "../../services_REST/serveur/admin/benevoles/GetBenevoles.ts";
import {SnackbarError} from "../../components/SnackbarError.tsx";
import {updateTransactions} from "../../services/transactions.ts";
import {useTransactionsStore} from "../../stores/TransactionsStore.ts";
import {useCardsStore} from "../../stores/CardsStore.ts";
import {updateCards} from "../../services/cards.ts";
import {styleCustomRole} from "../../styles/CustomInputField.ts";
import {SuccessMessage} from "../../components/SuccessMessage.tsx";

export const GestionBenevoles = () => {
    const {benevoles, setBenevoles, addBenevole, updateBenevole, deleteBenevole} = useBenevolesStore();
    const {setStands} = useStandsStore();
    const {setFestivaliers} = useFestivaliersStore();
    const {setTransactions} = useTransactionsStore();
    const {setCards} = useCardsStore();
    const {isFetchedBenevoles, isFetchedVisitors, isFetchedStands, setIsFetchedBenevoles, setIsFetchedVisitors, setIsFetchedStands} = useVariablesStore();
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
    const [formData, setFormData] = useState<Benevole>(new Benevole(0, "", "", "", "", "", ""));

    const [openRoleDialog, setOpenRoleDialog] = useState(false);
    const [selectedRole, setSelectedRole] = useState<string>("");

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [successAffMessage, setSuccessAffMessage] = useState<string | null>(null);
    
    const [openStandsDialog, setOpenStandsDialog] = useState(false);
    const [selectedBenevole, setSelectedBenevole] = useState<Benevole | null>(null);

    const [benevoleStands, setBenevoleStands] = useState<Stand[]>([]);
    const [unassignedStands, setUnassignedStands] = useState<Stand[]>([]);

    const [roles, setRoles] = useState<{ [key: string]: string }>({});
    const [permissionsForStand, setPermissionsForStand] = useState<{ id: number; stand_nom: string; permission: string }[]>([]);

    useEffect(() => {
        if (!isFetchedBenevoles) {
            setIsFetchedBenevoles(true);
            updateBenevoles(setBenevoles);
        }
    }, [isFetchedBenevoles, setBenevoles, setIsFetchedBenevoles]);

    useEffect(() => {
        if (successAffMessage) {
            const timer = setTimeout(() => setSuccessAffMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    },  [successAffMessage]);

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
            setFormData(new Benevole(0, "", "", "", "", "", ""));
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setTimeout(() => {
            setFormData(new Benevole(0, "", "", "", "", "", ""));
            setPassword("");
            setIsEditing(false);
            cleanErrors();
        }, 300);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        cleanErrors();
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleChange = (standId: number, event: SelectChangeEvent) => {
        cleanErrors();
        setRoles((prevRoles) => ({
            ...prevRoles,
            [standId]: event.target.value,
        }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        cleanErrors();
        setPassword(e.target.value);
    };

    const handleSubmit = async () => {
        cleanErrors();

        const newErrors = validateForm(formData, isEditing, password);

        setErrors(newErrors);

        if (Object.values(newErrors).some((error) => error !== null)) {
            return;
        }

        if (isEditing) {
            try {
                const data = await UpdateBenevole(formData.id, formData.nom, formData.prenom, null, formData.login, null)
                setSuccessMessage(data.message);
                updateBenevole(data.updatedBenevole);
                updateTransactions(setTransactions);
                updateCards(setCards);
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
                setSnackbarError(error.message);
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
            cleanErrors();
            setFormData(new Benevole(0, "", "", "", "", "", ""));
        }, 300);
    };

    const handleRoleSubmit = async () => {
        cleanErrors();

        if (selectedRole.trim() === "") {
            setRoleError("Le rôle est obligatoire.");
            return;
        }

        try {
            const data = await UpdateBenevole(formData.id, formData.nom, formData.prenom, null, formData.login, selectedRole);
            setSuccessMessage(data.message);
            updateFestivaliers(setFestivaliers);
            updateBenevoles(setBenevoles);
            updateStands(setStands);

            if (!isFetchedStands) setIsFetchedStands(true);
            if (!isFetchedVisitors) setIsFetchedVisitors(true);
            handleCloseRoleDialog();
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
    };

    const handleOpenStandsDialog = (benevole : Benevole) => {
        setSelectedBenevole(benevole);
        separerStands(benevole, setStands, setBenevoleStands, setUnassignedStands, setPermissionsForStand);
        setOpenStandsDialog(true);
    };

    const handleAffectStand = async (id_stand: number, role: string) => {
        try {
            const data = await AffectationBenevole(id_stand, selectedBenevole?.id, "add", role);

            setError(null);
            setSuccessAffMessage(data.message);
            const benevoles = await GetBenevoles();
            useBenevolesStore.getState().setBenevoles(benevoles);
            const updatedBenevole = useBenevolesStore.getState().benevoles.find(benevole => benevole.id === selectedBenevole?.id);

            separerStands(updatedBenevole, setStands, setBenevoleStands, setUnassignedStands, setPermissionsForStand);
        } catch (error) {
            setSuccessAffMessage(null);
            if (error instanceof Error) {
                console.error("Erreur lors de l'affecation du bénévole:", error);
                setError(error.message);
            } else {
                console.error("Erreur inconnue:", error);
                setError("Une erreur inconnue est survenue.");
            }
        }
    };

    const handleDisaffectStand = async (id_stand: number) => {
        try {
            const data = await AffectationBenevole(id_stand, selectedBenevole?.id, "remove", null);

            setRoles({});
            setError(null);
            setSuccessAffMessage(data.message);
            const benevoles = await GetBenevoles();
            useBenevolesStore.getState().setBenevoles(benevoles);
            const updatedBenevole = useBenevolesStore.getState().benevoles.find(benevole => benevole.id === selectedBenevole?.id);

            separerStands(updatedBenevole, setStands, setBenevoleStands, setUnassignedStands, setPermissionsForStand);
        } catch (error) {
            setSuccessAffMessage(null);
            if (error instanceof Error) {
                console.error("Erreur lors de la désaffecation du bénévole:", error);
                setError(error.message);
            } else {
                console.error("Erreur inconnue:", error);
                setError("Une erreur inconnue est survenue.");
            }
        }
    };

    const cleanErrors = () => {
        if (error) setError(null);
        if (roleError) setRoleError(null);
        if (errors) setErrors({nom: null, prenom: null, username: null, password: null})
    }

    return (
        <>
            <Header />
            <div style={{height: "1200px"}}>
            <div style={{ padding: "20px", textAlign: "center" }}>
                <Typography variant="h5" sx={{ mt: 1 }}>
                    Gestion des bénévoles
                </Typography>
                <Button variant="contained" onClick={() => handleOpen(false)} style={{ marginTop: "20px", backgroundColor: "#7f5656" }}>
                    Ajouter un bénévole
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
                                <TableCell align="center" sx={{ border: "1px solid #ddd", width: "100px" }}>Prénom</TableCell>
                                <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>Login</TableCell>
                                <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>Stands</TableCell>
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
                                        <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>
                                                <Button
                                                    onClick={() => handleOpenStandsDialog(benevole)}
                                                    sx={{
                                                    color: "#7f5656",
                                                    textDecoration: "underline",
                                                    background: "none",
                                                    border: "none",
                                                    padding: 0,
                                                    }}
                                                >
                                                    Voir stands
                                                </Button>
                                        </TableCell>
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

            <Dialog open={openStandsDialog} maxWidth="md" fullWidth>
                <DialogTitle
                    sx={{
                        bgcolor: "#7f5656",
                        color: "white",
                        textAlign: "center",
                        fontWeight: "bold",
                        py: 2,
                        borderTopLeftRadius: 2,
                        borderTopRightRadius: 2
                    }}
                >
                    Stands du bénévole: {selectedBenevole?.login}
                </DialogTitle>

                {(successAffMessage || error) && (
                    <Container maxWidth="xs" sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mt: 2,
                        mb: 2
                    }}>
                        <Alert severity={successAffMessage ? "success" : "error"} sx={{ textAlign: 'center' }}>
                            {successAffMessage || error}
                        </Alert>
                    </Container>
                )}

                <DialogContent dividers sx={{ p: 4, bgcolor: "#fafafa" }}>
                    <Grid2 container spacing={4} justifyContent="center" alignItems="stretch">
                        <Grid2 display="flex" flexDirection="column" height="100%" sx={{ alignItems: "center" }}>
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                            >
                                <ApartmentIcon fontSize="small" /> Stands du bénévole
                            </Typography>
                            <Paper sx={{
                                p: 1,
                                flex: 1,
                                overflowY: "auto",
                                border: "1px solid #ddd",
                                borderRadius: 2,
                                boxShadow: 1,
                                bgcolor: "white",
                                minHeight: 80,
                                maxHeight: 250,
                                minWidth: 300,
                                maxWidth: 320
                            }}>
                                {benevoleStands.length > 0 ? (
                                    <List dense>
                                        {benevoleStands.map((stand, id) => {
                                            const role = permissionsForStand.find(p => p.id === stand.id_stand)?.permission || "Aucune rôle";

                                            return (
                                                <ListItem
                                                    key={id}
                                                    sx={{ "&:hover": { bgcolor: "#f0f0f0", borderRadius: 1 } }}
                                                >
                                                    <ListItemText
                                                        primary={stand.nom_stand}
                                                        secondary={role}
                                                    />
                                                    <IconButton color="inherit" onClick={() => handleDisaffectStand(stand.id_stand)}>
                                                        <RemoveCircleOutlineIcon />
                                                    </IconButton>
                                                </ListItem>
                                            );
                                        })}
                                    </List>
                                ) : (
                                    <Typography variant="body2" color="textSecondary" sx={{ textAlign: "center", py: 2 }}>
                                        Aucun stand assigné.
                                    </Typography>
                                )}
                            </Paper>
                        </Grid2>

                        <Grid2 display="flex" flexDirection="column" height="100%" sx={{ alignItems: "center" }}>
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                            >
                                <AddBusinessIcon fontSize="small" /> Stands non assignés
                            </Typography>
                            <Paper sx={{
                                p: 1,
                                flex: 1,
                                overflowY: "auto",
                                border: "1px solid #ddd",
                                borderRadius: 2,
                                boxShadow: 1,
                                bgcolor: "white",
                                minHeight: 80,
                                maxHeight: 250,
                                minWidth: 300,
                                maxWidth: 320
                            }}>
                                {unassignedStands.length > 0 ? (
                                    <List dense>
                                        {unassignedStands.map((stand, id) => (
                                            <ListItem
                                                key={id}
                                                sx={{ "&:hover": { bgcolor: "#f0f0f0", borderRadius: 1 } }}
                                            >
                                                <ListItemText primary={stand.nom_stand} />
                                                <FormControl sx={styleCustomRole}>
                                                    <InputLabel>Rôle</InputLabel>
                                                    <Select
                                                        value={roles[stand.id_stand] || ''}
                                                        onChange={(event) => handleRoleChange(stand.id_stand, event)}
                                                        label="Rôle"
                                                        fullWidth
                                                    >
                                                        <MenuItem value="Créditeur">Créditeur</MenuItem>
                                                        <MenuItem value="Débiteur">Débiteur</MenuItem>
                                                    </Select>
                                                </FormControl>
                                                <IconButton color="inherit" onClick={() => handleAffectStand(stand.id_stand, roles[stand.id_stand])} disabled={!roles[stand.id_stand]}><AddCircleOutlineIcon/></IconButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (
                                    <Typography variant="body2" color="textSecondary" sx={{ textAlign: "center", py: 2 }}>
                                        Tous les stands sont assignés.
                                    </Typography>
                                )}
                            </Paper>
                        </Grid2>
                    </Grid2>
                </DialogContent>

                <DialogActions sx={{ justifyContent: "center", pb: 2, bgcolor: "#fafafa" }}>
                    <Button
                        onClick={() => {
                            setRoles({});
                            setError(null);
                            setSuccessAffMessage(null);
                            setOpenStandsDialog(false);
                        }}
                        sx={{
                            bgcolor: "#7f5656",
                            color: "white",
                            "&:hover": { bgcolor: "#5e3d3d" },
                            px: 3,
                            py: 1.2,
                            borderRadius: 2,
                            fontWeight: "bold"
                        }}
                    >
                        Fermer
                    </Button>
                </DialogActions>
            </Dialog>
            <SnackbarError error={errorSnackbar} setError={setSnackbarError}/>
            </div>
            <Footer />
        </>
    )
}