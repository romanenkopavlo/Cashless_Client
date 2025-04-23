import * as React from "react";
import Benevole from "../../../../models/Benevole.ts";
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
import PeopleIcon from "@mui/icons-material/People";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {styleCustomRole} from "../../../../styles/CustomInputField.ts";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {AffectationBenevole} from "../../../../services_REST/serveur/admin/benevoles/AffectationBenevole.ts";
import {separerBenevoles} from "../../../../services/benevoles.ts";
import {updateStands} from "../../../../services/stands.ts";
import {useEffect, useState} from "react";
import {useBenevolesStore} from "../../../../stores/BenevolesStore.ts";
import Stand from "../../../../models/Stand.ts";
import {useStandsStore} from "../../../../stores/StandsStore.ts";

export const AffOrDesaffBenevoles = ({ openBenevolesDialog, setOpenBenevolesDialog, selectedStand }: { openBenevolesDialog: boolean, setOpenBenevolesDialog: React.Dispatch<React.SetStateAction<boolean>>, selectedStand: Stand | null}) => {
    const {setStands} = useStandsStore();
    const {benevoles, setBenevoles} = useBenevolesStore();

    const [error, setError] = useState<string | null>(null);
    const [successAffMessage, setSuccessAffMessage] = useState<string | null>(null);

    const [standBenevoles, setStandBenevoles] = useState<Benevole[]>([]);
    const [unassignedBenevoles, setUnassignedBenevoles] = useState<Benevole[]>([]);

    const [permissionsForStand, setPermissionsForStand] = useState<{ id: number; login: string; stand_nom: string; permission: string }[]>([]);
    const [roles, setRoles] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (openBenevolesDialog) {
            separerBenevoles(selectedStand, setBenevoles, setStandBenevoles, setUnassignedBenevoles, setPermissionsForStand);
        }
    }, [openBenevolesDialog, selectedStand, setBenevoles])
    
    useEffect(() => {
        if (successAffMessage) {
            const timer = setTimeout(() => setSuccessAffMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [successAffMessage]);
    
    const handleRoleChange = (benevoleId: number, event: SelectChangeEvent) => {
        setRoles((prevRoles) => ({
            ...prevRoles,
            [benevoleId]: event.target.value,
        }));
    };

    const handleAffectation = async (benevole_id: number, action: "add" | "remove", role: string | null) => {
        try {
            const data = await AffectationBenevole(selectedStand?.id_stand, benevole_id, action, role);

            if (action === "remove") {
                setRoles({});
            }

            setError(null);
            setSuccessAffMessage(data.message);
            separerBenevoles(selectedStand, setBenevoles, setStandBenevoles, setUnassignedBenevoles, setPermissionsForStand);
            await updateStands(setStands)
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
    
    return (
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
                                                <IconButton color="inherit" onClick={() => handleAffectation(benevole.id, "remove", null)}>
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
                                            <IconButton color="inherit" onClick={() => handleAffectation(benevole.id, "add", roles[benevole.id])} disabled={!roles[benevole.id]}><AddCircleOutlineIcon/></IconButton>
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
    )
}