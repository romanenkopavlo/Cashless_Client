import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography} from "@mui/material";
import {styleCustomInput} from "../../styles/CustomInputField.ts";
import {useEffect, useState} from "react";
import User from "../../models/User.ts";
import {validateForm} from "../../utils/validateForm.ts";
import * as React from "react";
import {UpdateProfile} from "../../services_REST/serveur/users/UpdateProfile.ts";
import {SnackbarSuccess} from "../SnackbarSuccess.tsx";
import {useAuthenticationJWTStore} from "../../stores/AuthenticationJWT.ts";

export const ModificationProfile = ({ open, formData }: { open: boolean, formData: User}) => {
    const {setAccessToken} = useAuthenticationJWTStore();
    const [openTemp, setOpenTemp] = useState(false);
    const [formDataTemp, setFormDataTemp] = useState<User>(new User(0, "", "", "", ""));
    const [errors, setErrors] = useState<{ [key: string]: string | null }>({
        nom: null,
        prenom: null,
        username: null,
        password: null,
        passwordNew: null,
    });
    const [error, setError] = useState<string | null>(null);
    const [passwordNew, setPasswordNew] = useState<string>("");
    const [passwordCurrent, setPasswordCurrent] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            setOpenTemp(true);
        }
        if (formData) {
            setFormDataTemp(formData);
        }
    }, [open, formData]);

    const handleClose = () => {
        setOpenTemp(false);
        setTimeout(() => {
            setFormDataTemp(new User(0, "", "", "", ""));
            setPasswordNew("");
            setPasswordCurrent("");
            clearErrors();
        }, 300);
    };

    const handleSubmit = async () => {
        clearErrors();

        const newErrors = validateForm(formDataTemp, false, passwordCurrent, passwordNew);

        setErrors(newErrors);

        if (Object.values(newErrors).some((error) => error !== null)) {
            return;
        }

        try {
            const data = await UpdateProfile(formDataTemp.id, formDataTemp.nom, formDataTemp.prenom, formDataTemp.login, passwordCurrent, passwordNew);
            if (data) {
                setSuccessMessage(data.message);
                setAccessToken(data.token);
            } else {
                setError("Une erreur s'est produite. Veuillez réessayer.");
            }
            handleClose();
        } catch (error) {
            if (error instanceof Error) {
                console.error("Erreur lors de la modification du profil:", error);
                setError(error.message);
            } else {
                console.error("Erreur inconnue:", error);
                setError("Une erreur inconnue est survenue.");
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        clearErrors();
        setFormDataTemp({ ...formDataTemp, [e.target.name]: e.target.value });
    };

    const handlePasswordCurrentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        clearErrors();
        setPasswordCurrent(e.target.value);
    };

    const handlePasswordNewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        clearErrors();
        setPasswordNew(e.target.value);
    };

    const clearErrors = () => {
        if (error) setError(null);
        if (Object.values(errors).some((error) => error !== null)) {
            setErrors({nom: null, prenom: null, username: null, password: null, passwordNew: null})
        }
    }

    return (
        <>
            <Dialog open={openTemp} onClose={handleClose}>
                <DialogTitle>Modification du profil</DialogTitle>
                <DialogContent>
                    <TextField fullWidth margin="dense" variant="outlined" sx={styleCustomInput} label="Nom *" name="nom" value={formDataTemp.nom} onChange={handleChange} error={!!errors.nom} helperText={errors.nom}/>
                    <TextField fullWidth margin="dense" variant="outlined" sx={styleCustomInput} label="Prénom *" name="prenom" value={formDataTemp.prenom} onChange={handleChange} error={!!errors.prenom} helperText={errors.prenom}/>
                    <TextField fullWidth margin="dense" variant="outlined" sx={styleCustomInput} label="Login *" name="login" value={formDataTemp.login} onChange={handleChange} error={!!errors.username} helperText={errors.username}/>
                    <TextField fullWidth margin="dense" variant="outlined" sx={styleCustomInput} label="Mot de passe actuel" name="password_current" type="password" onChange={handlePasswordCurrentChange} error={!!errors.password} helperText={errors.password}/>
                    <TextField fullWidth margin="dense" variant="outlined" sx={styleCustomInput} label="Nouveau mot de passe" name="password_new" type="password" onChange={handlePasswordNewChange} error={!!errors.passwordNew} helperText={errors.passwordNew}/>
                    {error && (
                        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                            {error}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} sx={{color: "#7f5656"}}>Annuler</Button>
                    <Button onClick={handleSubmit} sx={{backgroundColor: "#7f5656"}} variant="contained">Modifier</Button>
                </DialogActions>
            </Dialog>

            <SnackbarSuccess successMessage={successMessage} setSuccessMessage={setSuccessMessage}/>
        </>
    )
}