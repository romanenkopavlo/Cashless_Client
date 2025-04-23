import {
    Button, Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography
} from "@mui/material";
import {styleCustomInput} from "../../../../styles/CustomInputField.ts";
import * as React from "react";
import {UpdateBenevole} from "../../../../services_REST/serveur/admin/benevoles/UpdateBenevole.ts";
import {updateFestivaliers} from "../../../../services/festivaliers.ts";
import {updateBenevoles} from "../../../../services/benevoles.ts";
import {updateCategoriesStands, updateStands} from "../../../../services/stands.ts";
import Benevole from "../../../../models/Benevole.ts";
import {useEffect, useState} from "react";
import {useCategoriesStore} from "../../../../stores/CategoriesStore.ts";
import {useFestivaliersStore} from "../../../../stores/FestivaliersStore.ts";
import {useVariablesStore} from "../../../../stores/VariablesStore.ts";
import {useBenevolesStore} from "../../../../stores/BenevolesStore.ts";
import {useStandsStore} from "../../../../stores/StandsStore.ts";

export const ChangeRole = ({ openRoleDialog, setOpenRoleDialog, benevole, setSuccessMessage }: { openRoleDialog: boolean, setOpenRoleDialog: React.Dispatch<React.SetStateAction<boolean>>, benevole: Benevole | null, setSuccessMessage: React.Dispatch<React.SetStateAction<string | null>>}) => {
    const {setStands} = useStandsStore();
    const {setBenevoles} = useBenevolesStore();
    const {setCategories} = useCategoriesStore();
    const {setFestivaliers} = useFestivaliersStore();
    const {isFetchedVisitors, isFetchedStands, setIsFetchedVisitors, setIsFetchedStands} = useVariablesStore();
    const [error, setError] = useState<string | null>(null);
    const [roleError, setRoleError] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [formData, setFormData] = useState<Benevole>(new Benevole(0, "", "", "", "", "", ""));
    
    useEffect(() => {
        if (openRoleDialog) {
            if (benevole) {
                setFormData(benevole);
            } else {
                setFormData(new Benevole(0, "", "", "", "", "", ""));
            }
            setSelectedRole("Visiteur");
        }
    }, [openRoleDialog, benevole])

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
            await updateStands(setStands);

            if (!isFetchedStands) {
                setIsFetchedStands(true);
                await updateCategoriesStands(setCategories);
            }
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

    const handleCloseRoleDialog = () => {
        setOpenRoleDialog(false);
        setTimeout(() => {
            cleanErrors();
            setFormData(new Benevole(0, "", "", "", "", "", ""));
        }, 300);
    };

    const cleanErrors = () => {
        if (error) setError(null);
        if (roleError) setRoleError(null);
    }

    return (
        <Dialog open={openRoleDialog} onClose={handleCloseRoleDialog}>
            <DialogTitle>Changer le rôle</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="dense" sx={styleCustomInput} error={!!roleError}>
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
    )
}