import {Header} from "../../components/Header.tsx";
import {Footer} from "../../components/Footer.tsx";
import {
    Button,
    Dialog, DialogActions, DialogContent,
    DialogTitle, FormControl, InputLabel, MenuItem,
    Paper, Select, SelectChangeEvent,
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
import { useVariablesStore } from "../../stores/VariablesStore.ts";
import {useBenevolesStore} from "../../stores/BenevolesStore.ts";
import Benevole from "../../models/Benevole.ts";
import {GetBenevoles} from "../../services_REST/serveur/admin/benevoles/GetBenevoles.ts";
import {UpdateBenevole} from "../../services_REST/serveur/admin/benevoles/UpdateBenevole.ts";
import {CreateBenevole} from "../../services_REST/serveur/admin/benevoles/CreateBenevole.ts";
import {DeleteBenevole} from "../../services_REST/serveur/admin/benevoles/DeleteBenevole.ts";
import {validateForm} from "../../utils/validateForm.ts";
import {GetStands} from "../../services_REST/serveur/admin/stands/GetStands.ts";
import {useStandsStore} from "../../stores/StandsStore.ts";

export const GestionBenevoles = () => {
    const {benevoles, setBenevoles, addBenevole, updateBenevole, deleteBenevole} = useBenevolesStore();
    const {stands, setStands} = useStandsStore();
    const {isFetchedBenevoles, isFetchedStands, setIsFetchedBenevoles, setIsFetchedStands} = useVariablesStore();
    const [password, setPassword] = useState<string>("");

    const [error, setError] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string | null }>({
        nom: null,
        prenom: null,
        nom_stand: null,
        username: null,
        password: null,
    });

    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Benevole>(new Benevole(0, "", "", "", "", ""));

    useEffect(() => {
        if (!isFetchedBenevoles) {
            setIsFetchedBenevoles(true);
            
            GetBenevoles()
                .then((data) => {
                    if (!data || !Array.isArray(data)) {
                        setBenevoles([]);
                    } else {
                        setBenevoles(data);
                    }
                })
                .catch((error) => {
                    console.error("Erreur lors de la récupération des bénévoles:", error);
                    setBenevoles([]);
                });
            
            if (!isFetchedStands) {
                setIsFetchedStands(true);

                GetStands()
                    .then((data) => {
                        if (!data || !Array.isArray(data)) {
                            setStands([]);
                        } else {
                            setStands(data);
                        }
                    })
                    .catch((error) => {
                        console.error("Erreur lors de la récupération des bénévoles:", error);
                        setStands([]);
                    });
            }
        }
    }, [isFetchedBenevoles, isFetchedStands, setBenevoles, setIsFetchedBenevoles, setIsFetchedStands, setStands]);

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

    const handleSelectChange = (event: SelectChangeEvent) => {
        setFormData({
            ...formData,
            [event.target.name as string]: event.target.value
        });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleSubmit = () => {
        const newErrors = validateForm(formData, isEditing, password, "benevole");

        setErrors(newErrors);

        if (Object.values(newErrors).some((error) => error !== null)) {
            return;
        }

        if (isEditing) {
            UpdateBenevole(formData.id, formData.nom, formData.prenom, formData.nom_stand, formData.login)
                .then((data) => {
                    updateBenevole(data.updatedBenevole);
                    handleClose();
                })
                .catch((error) => {
                    console.error("Erreur lors de la récupération des bénévoles:", error);
                    setError(error.message)
                })
        } else {
            CreateBenevole(formData.nom, formData.prenom, formData.nom_stand, formData.login, password)
                .then((data) => {
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
            .then(() => {
                deleteBenevole(id);
            })
            .catch((error) => console.error("Erreur lors de la suppression des bénévoles:", error));
    };

    return (
        <>
            <Header />
            <div style={{ padding: "20px", textAlign: "center" }}>
                <Typography variant="h5" sx={{ mt: 1 }}>
                    Gestion des bénévoles
                </Typography>
                {stands && stands.length > 0 ? (
                    <Button variant="contained" onClick={() => handleOpen(false)} style={{ marginTop: "20px", backgroundColor: "#7f5656" }}>
                        Ajouter un bénévole
                    </Button>
                ) : (
                    <Typography variant="h6" sx={{ mt: 1 }}>L'ajout d'un bénévole est impossible. Veuillez d'abord ajouter des stands.</Typography>
                )}
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
                                        <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>{benevole.nom_stand ? benevole.nom_stand : '—'}</TableCell>
                                        <TableCell align="center" sx={{ border: "1px solid #ddd", width: "120px" }}>
                                            {stands && stands.length > 0 && (<Button onClick={() => handleOpen(true, benevole)}><Edit sx={{color: "#7f5656"}}/></Button>)}
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
                    <FormControl fullWidth margin="dense" sx={styleCustom} error={!!errors.nom_stand}>
                        <InputLabel id="stand-label">Stand</InputLabel>
                        <Select
                            labelId="stand-label"
                            label="Stand"
                            name="nom_stand"
                            value={formData.nom_stand}
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
                            {stands && stands.length > 0 && stands.map((stand) => (
                                <MenuItem key={stand.id_stand} value={stand.nom_stand}>
                                    {stand.nom_stand}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.nom_stand && (
                            <Typography color="error" variant="caption" sx={{mt: 0.5}}>
                                {errors.nom_stand}
                            </Typography>
                        )}
                    </FormControl>
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