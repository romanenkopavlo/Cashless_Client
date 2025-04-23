import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography} from "@mui/material";
import * as React from "react";
import Benevole from "../../../../models/Benevole.ts";
import {useEffect, useState} from "react";
import {validateForm} from "../../../../utils/validateForm.ts";
import {UpdateBenevole} from "../../../../services_REST/serveur/admin/benevoles/UpdateBenevole.ts";
import {updateTransactions} from "../../../../services/transactions.ts";
import {updateCards} from "../../../../services/cards.ts";
import {CreateBenevole} from "../../../../services_REST/serveur/admin/benevoles/CreateBenevole.ts";
import {useBenevolesStore} from "../../../../stores/BenevolesStore.ts";
import {useTransactionsStore} from "../../../../stores/TransactionsStore.ts";
import {useCardsStore} from "../../../../stores/CardsStore.ts";
import {styleCustomInput} from "../../../../styles/CustomInputField.ts";

export const ModifyOrAdd = ({ open, setOpen, isEditing, setIsEditing, benevole, setSuccessMessage }: { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>, isEditing: boolean, setIsEditing: React.Dispatch<React.SetStateAction<boolean>>, benevole: Benevole | null, setSuccessMessage: React.Dispatch<React.SetStateAction<string | null>>}) => {
    const [password, setPassword] = useState<string>("");

    const {setCards} = useCardsStore();
    const {setTransactions} = useTransactionsStore();
    const {addBenevole, updateBenevole} = useBenevolesStore();

    const [formData, setFormData] = useState<Benevole>(new Benevole(0, "", "", "", "", "", ""));
    const [error, setError] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string | null }>({
        nom: null,
        prenom: null,
        username: null,
        password: null,
    });

    useEffect(() => {
        if (open) {
            if (isEditing && benevole) {
                setFormData(benevole);
            } else {
                setFormData(new Benevole(0, "", "", "", "", "", ""));
            }
        }
    }, [open, benevole, isEditing])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        cleanErrors();
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        cleanErrors();
        setPassword(e.target.value);
    };

    const handleSubmit = async () => {
        cleanErrors();

        const newErrors = validateForm(formData, isEditing, password, null);

        setErrors(newErrors);

        if (Object.values(newErrors).some((error) => error !== null)) {
            return;
        }

        if (isEditing) {
            try {
                const data = await UpdateBenevole(formData.id, formData.nom, formData.prenom, null, formData.login, null);
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

    const handleClose = () => {
        setOpen(false);
        setTimeout(() => {
            setFormData(new Benevole(0, "", "", "", "", "", ""));
            setPassword("");
            setIsEditing(false);
            cleanErrors();
        }, 300);
    };

    const cleanErrors = () => {
        if (error) setError(null);
        if (errors) setErrors({nom: null, prenom: null, username: null, password: null})
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{isEditing ? "Modifier le bénévole" : "Ajouter un bénévole"}</DialogTitle>
            <DialogContent>
                <TextField fullWidth margin="dense" variant="outlined" sx={styleCustomInput} label="Nom" name="nom" value={formData.nom} onChange={handleChange} error={!!errors.nom} helperText={errors.nom}/>
                <TextField fullWidth margin="dense" variant="outlined" sx={styleCustomInput} label="Prénom" name="prenom" value={formData.prenom} onChange={handleChange} error={!!errors.prenom} helperText={errors.prenom}/>
                <TextField fullWidth margin="dense" variant="outlined" sx={styleCustomInput} label="Login" name="login" value={formData.login} onChange={handleChange} error={!!errors.username} helperText={errors.username}/>
                {!isEditing && (<TextField fullWidth margin="dense" variant="outlined" sx={styleCustomInput} label="Mot de passe" name="password" type="password" value={password} onChange={handlePasswordChange} error={!!errors.password} helperText={errors.password}/>)}
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