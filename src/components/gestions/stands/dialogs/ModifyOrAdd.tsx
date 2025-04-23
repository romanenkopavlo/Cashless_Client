import {
    Button, Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select, SelectChangeEvent,
    TextField,
    Typography
} from "@mui/material";
import {UpdateStand} from "../../../../services_REST/serveur/admin/stands/UpdateStand.ts";
import {updateTransactions} from "../../../../services/transactions.ts";
import {updateStatistics} from "../../../../services/statistics.ts";
import {CreateStand} from "../../../../services_REST/serveur/admin/stands/CreateStand.ts";
import Stand from "../../../../models/Stand.ts";
import * as React from "react";
import {useEffect, useState} from "react";
import {useStatisticsStore} from "../../../../stores/StatisticsStore.ts";
import {useTransactionsStore} from "../../../../stores/TransactionsStore.ts";
import {useStandsStore} from "../../../../stores/StandsStore.ts";
import { styleCustomInput } from "../../../../styles/CustomInputField.ts";
import {useCategoriesStore} from "../../../../stores/CategoriesStore.ts";

export const ModifyOrAdd = ({ open, setOpen, isEditing, setIsEditing, stand, setSuccessMessage }: { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>, isEditing: boolean, setIsEditing: React.Dispatch<React.SetStateAction<boolean>>, stand: Stand | null, setSuccessMessage: React.Dispatch<React.SetStateAction<string | null>>}) => {
    const {categories} = useCategoriesStore();
    const {setStatistics} = useStatisticsStore();
    const {setTransactions} = useTransactionsStore();
    const {addStand, updateStand} = useStandsStore();
    const [formData, setFormData] = useState<Stand>(new Stand(0, "", "", 0));

    const [error, setError] = useState<string | null>(null);
    const [nomError, setNomError] = useState<string | null>(null);
    const [categorieError, setCategorieError] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            if (isEditing && stand) {
                setFormData(stand);
            } else {
                setFormData(new Stand(0, "", "", 0));
            }
        }
    }, [open, stand, isEditing])

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
                updateStatistics(setStatistics, null);
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

    const cleanErrors = () => {
        if (error) setError(null);
        if (nomError) setNomError(null);
        if (categorieError) setCategorieError(null);
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{isEditing ? "Modifier le stand" : "Ajouter un stand"}</DialogTitle>
            <DialogContent>
                <TextField fullWidth margin="dense" variant="outlined" sx={styleCustomInput} label="Nom" name="nom_stand" value={formData.nom_stand} onChange={handleChange} error={!!nomError} helperText={nomError}/>
                <FormControl fullWidth margin="dense" sx={styleCustomInput} error={!!categorieError}>
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
    )
}