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
    DialogTitle,
    Typography,
    InputLabel,
    Select,
    MenuItem,
    FormControl,
    SelectChangeEvent,
    ListItemText,
    Grid2,
    List, ListItem, IconButton, Container, Alert
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Edit, Delete } from "@mui/icons-material";
import Stand from "../../models/Stand.ts";
import * as React from "react";
import {CreateStand} from "../../services_REST/serveur/admin/stands/CreateStand.ts";
import {UpdateStand} from "../../services_REST/serveur/admin/stands/UpdateStand.ts";
import {DeleteStand} from "../../services_REST/serveur/admin/stands/DeleteStand.ts";
import {useStandsStore} from "../../stores/StandsStore.ts";
import {useVariablesStore} from "../../stores/VariablesStore.ts";
import {GestionCategories} from "../../components/gestions/GestionCategoriesStands.tsx";
import {useCategoriesStore} from "../../stores/CategoriesStore.ts";
import {useBenevolesStore} from "../../stores/BenevolesStore.ts";
import {GetBenevoles} from "../../services_REST/serveur/admin/benevoles/GetBenevoles.ts";
import {updateStands} from "../../services/stands.ts";
import Benevole from "../../models/Benevole.ts";
import {AffectationBenevole} from "../../services_REST/serveur/admin/benevoles/AffectationBenevole.ts";
import {separerBenevoles} from "../../services/benevoles.ts";
import {SnackbarError} from "../../components/SnackbarError.tsx";
import {updateTransactions} from "../../services/transactions.ts";
import {useTransactionsStore} from "../../stores/TransactionsStore.ts";
import {SuccessMessage} from "../../components/SuccessMessage.tsx";
import {styleCustomRole} from "../../styles/CustomInputField.ts";

export const GestionStands = () => {
    const {stands, setStands, addStand, updateStand, deleteStand} = useStandsStore();
    const {categories} = useCategoriesStore();
    const {setTransactions} = useTransactionsStore();
    const {benevoles, setBenevoles} = useBenevolesStore();
    const {isFetchedStands, setIsFetchedStands} = useVariablesStore();

    const [error, setError] = useState<string | null>(null);
    const [errorSnackbar, setErrorSnackbar] = useState<string | null>(null);
    const [nomError, setNomError] = useState<string | null>(null);
    const [categorieError, setCategorieError] = useState<string | null>(null);

    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Stand>(new Stand(0, "", "", 0));

    const [openBenevolesDialog, setOpenBenevolesDialog] = useState(false);
    const [selectedStand, setSelectedStand] = useState<Stand | null>(null);
    const [standBenevoles, setStandBenevoles] = useState<Benevole[]>([]);
    const [unassignedBenevoles, setUnassignedBenevoles] = useState<Benevole[]>([]);
    const [permissionsForStand, setPermissionsForStand] = useState<{ id: number; login: string; stand_nom: string; permission: string }[]>([]);
    const [roles, setRoles] = useState<{ [key: string]: string }>({});

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [successAffMessage, setSuccessAffMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!isFetchedStands) {
            setIsFetchedStands(true);
            updateStands(setStands);
        }
    }, [isFetchedStands, setStands, setIsFetchedStands]);

    useEffect(() => {
        if (successAffMessage) {
            const timer = setTimeout(() => setSuccessAffMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [successAffMessage]);

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
            setFormData(new Stand(0, "", "", 0));
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setTimeout(() => {
            setFormData(new Stand(0, "", "", 0));
            setIsEditing(false);
            cleanErrors();
        }, 300);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        cleanErrors();
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleChange = (benevoleId: number, event: SelectChangeEvent) => {
        setRoles((prevRoles) => ({
            ...prevRoles,
            [benevoleId]: event.target.value,
        }));
    };

    const handleSelectChange = (event: SelectChangeEvent) => {
        cleanErrors();
        setFormData({
            ...formData,
            [event.target.name as string]: event.target.value
        });
    };

    const handleSubmit = async () => {
        cleanErrors();

        if (formData.nom_stand.trim() === "") {
            setNomError("Le nom du stand est obligatoire");
            return;
        }

        if (formData.nom_categorie.trim() === "") {
            setCategorieError("La catégorie est obligatoire");
            return;
        }

        if (isEditing) {
            try {
                const data = await UpdateStand(formData.id_stand, formData.nom_stand, formData.nom_categorie);
                setSuccessMessage(data.message);
                updateStand(data.updatedStand);
                updateTransactions(setTransactions);
                handleClose();
            } catch (error) {
                if (error instanceof Error) {
                    console.error("Erreur lors de la récupération des stands:", error);
                    setError(error.message);
                } else {
                    console.error("Erreur inconnue:", error);
                    setError("Une erreur inconnue est survenue.");
                }
            }
        } else {
            CreateStand(formData.nom_stand, formData.nom_categorie)
                .then((data) => {
                    setSuccessMessage(data.message);
                    addStand(data.newStand);
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
                setSuccessMessage(data.message);
                deleteStand(id);
                return GetBenevoles();
            })
            .then((data) => {
                if (!data || !Array.isArray(data)) {
                    setBenevoles([]);
                } else {
                    setBenevoles(data);
                }
            })
            .catch((error) => {
                console.error("Erreur lors de la suppression des stands:", error);
                setErrorSnackbar(error.message)
            })
    };

    const handleOpenBenevolesDialog = (stand: Stand) => {
        setError(null);
        setSelectedStand(stand);
        separerBenevoles(stand, setBenevoles, setStandBenevoles, setUnassignedBenevoles, setPermissionsForStand);
        setOpenBenevolesDialog(true);
    };

    const handleAffectBenevole = async (benevole_id: number, role: string) => {
        try {
            const data = await AffectationBenevole(selectedStand?.id_stand, benevole_id, "add", role);

            setError(null);
            setSuccessAffMessage(data.message);
            separerBenevoles(selectedStand, setBenevoles, setStandBenevoles, setUnassignedBenevoles, setPermissionsForStand);
            updateStands(setStands)
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

    const handleDisaffectBenevole = async (benevole_id: number) => {
        try {
            const data = await AffectationBenevole(selectedStand?.id_stand, benevole_id, "remove", null);

            setRoles({});
            setError(null);
            setSuccessAffMessage(data.message);
            separerBenevoles(selectedStand, setBenevoles, setStandBenevoles, setUnassignedBenevoles, setPermissionsForStand);
            updateStands(setStands)
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
        if (nomError) setNomError(null);
        if (categorieError) setCategorieError(null);
    };

    return (
        <>
            <Header />
            <div style={{height: "1200px"}}>
            <div style={{padding: "20px", textAlign: "center" }}>
                <Typography variant="h5" sx={{ mt: 1 }}>
                    Gestion des stands
                </Typography>
                {categories && categories.length > 0 ? (
                    <Button variant="contained" onClick={() => handleOpen(false)} style={{ marginTop: "20px", backgroundColor: "#7f5656" }}>
                        Ajouter un stand
                    </Button>
                ) : (
                    <Typography variant="h6" sx={{ mt: 1 }}>L'ajout d'un stand est impossible. Veuillez d'abord ajouter des catégories.</Typography>
                )}
            </div>

            <SuccessMessage successMessage={successMessage} setSuccessMessage={setSuccessMessage}/>

            <div style={{ padding: "20px" }}>
                <TableContainer component={Paper} sx={{maxHeight: 400, boxShadow: 4, overflow: "auto", borderRadius: 2}}>
                    <Table sx={{ border: "1px solid #ddd" }}>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                <TableCell align="center" sx={{ border: "1px solid #ddd", width: "50px" }}>ID</TableCell>
                                <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>Nom</TableCell>
                                <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>Catégorie</TableCell>
                                <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>Nombre de bénévoles</TableCell>
                                <TableCell align="center" sx={{ border: "1px solid #ddd", width: "120px" }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stands && stands.length > 0 ? (
                                stands.map((stand) => (
                                    <TableRow key={stand.id_stand}>
                                        <TableCell align="center" sx={{ border: "1px solid #ddd", width: "50px" }}>{stand.id_stand}</TableCell>
                                        <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>{stand.nom_stand}</TableCell>
                                        <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>{stand.nom_categorie ? stand.nom_categorie : '—'}</TableCell>
                                        <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}><Button
                                            onClick={() => handleOpenBenevolesDialog(stand)}
                                            sx={{
                                            color: "#7f5656",
                                                textDecoration: "underline",
                                                background: "none",
                                                border: "none",
                                                padding: 0,
                                                minWidth: "auto"
                                            }}
                                        >
                                            {stand.nombre_benevoles}
                                        </Button></TableCell>
                                        <TableCell align="center" sx={{ border: "1px solid #ddd", width: "120px" }}>
                                            {categories && categories.length > 0 && (<Button onClick={() => handleOpen(true, stand)}><Edit sx={{color: "#7f5656"}}/></Button>)}
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

            <GestionCategories/>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{isEditing ? "Modifier le stand" : "Ajouter un stand"}</DialogTitle>
                <DialogContent>
                    <TextField fullWidth margin="dense" variant="outlined" sx={styleCustom} label="Nom" name="nom_stand" value={formData.nom_stand} onChange={handleChange} error={!!nomError} helperText={nomError}/>
                    <FormControl fullWidth margin="dense" sx={styleCustom} error={!!categorieError}>
                        <InputLabel id="categorie-label">Catégorie</InputLabel>
                        <Select
                            labelId="categorie-label"
                            label="Catégorie"
                            name="nom_categorie"
                            value={formData.nom_categorie}
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
                            {categories && categories.length > 0 && categories.map((categorie) => (
                                <MenuItem key={categorie.id_categorie} value={categorie.nom_categorie}>
                                    {categorie.nom_categorie}
                                </MenuItem>
                            ))}
                        </Select>
                        {categorieError && (
                            <Typography color="error" variant="caption" sx={{mt: 0.5}}>
                                {categorieError}
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
                    <Button onClick={handleSubmit} sx={{backgroundColor: "#7f5656"}} variant="contained">{isEditing ? "Modifier" : "Ajouter"}</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openBenevolesDialog} maxWidth="md" fullWidth>
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
                    Bénévoles pour {selectedStand?.nom_stand}
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
                                <PeopleIcon fontSize="small" /> Bénévoles dans ce stand
                            </Typography>
                            <Paper sx={{
                                p: 2,
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
                                {standBenevoles.length > 0 ? (
                                    <List dense>
                                        {standBenevoles.map((benevole, id) => {
                                            const role = permissionsForStand.find(p => p.id === benevole.id)?.permission || "Aucune rôle";

                                            return (
                                                <ListItem
                                                    key={id}
                                                    sx={{ "&:hover": { bgcolor: "#f0f0f0", borderRadius: 1 } }}
                                                >
                                                    <ListItemText
                                                        primary={`${benevole.nom} ${benevole.prenom} ${benevole.login}`}
                                                        secondary={role}
                                                    />
                                                    <IconButton color="inherit" onClick={() => handleDisaffectBenevole(benevole.id)}>
                                                        <RemoveCircleOutlineIcon />
                                                    </IconButton>
                                                </ListItem>
                                            );
                                        })}
                                    </List>
                                ) : (
                                    <Typography variant="body2" color="textSecondary" sx={{ textAlign: "center", py: 2 }}>
                                        Aucun bénévole assigné.
                                    </Typography>
                                )}
                            </Paper>
                        </Grid2>

                        <Grid2 display="flex" flexDirection="column" height="100%" sx={{ alignItems: "center" }}>
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                            >
                                <PersonAddIcon fontSize="small" /> Bénévoles non assignés
                            </Typography>
                            <Paper sx={{
                                p: 2,
                                flex: 1,
                                overflowY: "auto",
                                border: "1px solid #ddd",
                                borderRadius: 2,
                                boxShadow: 1,
                                bgcolor: "white",
                                minHeight: 80,
                                maxHeight: 250,
                                minWidth: 400,
                                maxWidth: 450
                            }}>
                                {unassignedBenevoles.length > 0 ? (
                                    <List dense>
                                        {unassignedBenevoles.map((benevole, id) => (
                                            <ListItem
                                                key={id}
                                                sx={{ "&:hover": { bgcolor: "#f0f0f0", borderRadius: 1 } }}
                                            >
                                                <ListItemText primary={benevole.nom + " " + benevole.prenom + " " + benevole.login} />
                                                <FormControl sx={styleCustomRole}>
                                                    <InputLabel>Rôle</InputLabel>
                                                    <Select
                                                        value={roles[benevole.id] || ''}
                                                        onChange={(event) => handleRoleChange(benevole.id, event)}
                                                        label="Rôle"
                                                        fullWidth
                                                    >
                                                        <MenuItem value="Créditeur">Créditeur</MenuItem>
                                                        <MenuItem value="Débiteur">Débiteur</MenuItem>
                                                    </Select>
                                                </FormControl>
                                                <IconButton color="inherit" onClick={() => handleAffectBenevole(benevole.id, roles[benevole.id])} disabled={!roles[benevole.id]}><AddCircleOutlineIcon/></IconButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : benevoles.length > 0 ? (
                                    <Typography variant="body2" color="textSecondary" sx={{ textAlign: "center", py: 2 }}>
                                        Tous les bénévoles sont assignés.
                                    </Typography>
                                ) : (
                                    <Typography variant="body2" color="textSecondary" sx={{ textAlign: "center", py: 2 }}>
                                        Aucun bénévole trouvé.
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
                            setOpenBenevolesDialog(false);
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
                <SnackbarError error={errorSnackbar} setError={setErrorSnackbar}/>
            </div>
            <Footer />
        </>
    );
};