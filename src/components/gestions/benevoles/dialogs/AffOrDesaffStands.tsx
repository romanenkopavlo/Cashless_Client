import {
    Alert, Button,
    Container, Dialog, DialogActions,
    DialogContent,
    DialogTitle, FormControl,
    Grid2, IconButton, InputLabel,
    List,
    ListItem,
    ListItemText, MenuItem,
    Paper, Select, SelectChangeEvent,
    Typography
} from "@mui/material";
import ApartmentIcon from "@mui/icons-material/Apartment";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import {styleCustomRole} from "../../../../styles/CustomInputField.ts";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {AffectationBenevole} from "../../../../services_REST/serveur/admin/benevoles/AffectationBenevole.ts";
import {GetBenevoles} from "../../../../services_REST/serveur/admin/benevoles/GetBenevoles.ts";
import {useBenevolesStore} from "../../../../stores/BenevolesStore.ts";
import {separerStands} from "../../../../services/stands.ts";
import {useEffect, useState} from "react";
import Stand from "../../../../models/Stand.ts";
import {useStandsStore} from "../../../../stores/StandsStore.ts";
import * as React from "react";
import Benevole from "../../../../models/Benevole.ts";

export const AffOrDesaffStands = ({ openStandsDialog, setOpenStandsDialog, selectedBenevole }: { openStandsDialog: boolean, setOpenStandsDialog: React.Dispatch<React.SetStateAction<boolean>>, selectedBenevole: Benevole | undefined}) => {
    const {setStands} = useStandsStore();
    const [error, setError] = useState<string | null>(null);
    const [roles, setRoles] = useState<{ [key: string]: string }>({});
    const [successAffMessage, setSuccessAffMessage] = useState<string | null>(null);

    const [benevoleStands, setBenevoleStands] = useState<Stand[]>([]);
    const [unassignedStands, setUnassignedStands] = useState<Stand[]>([]);
    const [permissionsForStand, setPermissionsForStand] = useState<{ id: number; stand_nom: string; permission: string }[]>([]);
    
    
    useEffect(() => {
        if (openStandsDialog) {
            separerStands(selectedBenevole, setStands, setBenevoleStands, setUnassignedStands, setPermissionsForStand);
        }
    }, [openStandsDialog, selectedBenevole, setStands])
    
    useEffect(() => {
        if (successAffMessage) {
            const timer = setTimeout(() => setSuccessAffMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    },  [successAffMessage]);
    
    const handleRoleChange = (standId: number, event: SelectChangeEvent) => {
        cleanErrors();
        setRoles((prevRoles) => ({
            ...prevRoles,
            [standId]: event.target.value,
        }));
    };
    
    const handleAffectation = async (id_stand: number, action: "add" | "remove", role: string | null) => {
        try {
            const data = await AffectationBenevole(id_stand, selectedBenevole?.id, action, role);

            if (action === "remove") {
                setRoles({});
            }

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

    const cleanErrors = () => {
        if (error) setError(null);
    }
    
    return (
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
                                                <IconButton color="inherit" onClick={() => handleAffectation(stand.id_stand, "remove", null)}>
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
                                            <IconButton color="inherit" onClick={() => handleAffectation(stand.id_stand, "add", roles[stand.id_stand])} disabled={!roles[stand.id_stand]}><AddCircleOutlineIcon/></IconButton>
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
    )
}