import {Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@mui/material";
import { styled } from "@mui/system";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import {Link} from "react-router";
import {useState} from "react";
import {ActivationCard} from "../services_REST/serveur/users/ActivationCard.ts";
import {SnackbarSuccess} from "./SnackbarSuccess.tsx";
import {useUserCardsStore} from "../stores/UserCardsStore.ts";

const CardContainer = styled(Card, {shouldForwardProp: (prop) => prop !== "is_active"})<{ is_active: boolean }>(({ is_active }) => ({
    width: 340,
    height: 220,
    background: is_active ? "linear-gradient(135deg, #6d4c41, #8d6e63)" : "linear-gradient(135deg, #424242, #616161)",
    color: "#fff",
    borderRadius: 16,
    padding: 16,
    position: "relative",
}));

const Chip = styled("div")({
    width: 40,
    height: 30,
    background: "#d4af37",
    borderRadius: 6,
    position: "absolute",
    top: 16,
    left: 16,
});

const CardNumber = styled(Typography)({
    fontSize: 20,
    letterSpacing: 2,
    marginTop: 24,
    color: "#f5f5f5",
});

const CardBalance = styled(Typography)({
    fontSize: 20,
    marginTop: 12,
    color: "#f5f5f5",
    fontWeight: "bold",
});

const CardStatus = styled(Typography, {shouldForwardProp: (prop) => prop !== "is_active"})<{ is_active: boolean }>(({ is_active }) => ({
    fontSize: 16,
    marginTop: 8,
    fontWeight: "bold",
    textAlign: "left",
    color: is_active ? "#43a047" : "#ef5350",
}));

const TransactionLink = styled(Link)({
    fontSize: 16,
    position: "absolute",
    textDecoration: "none",
    bottom: 16,
    right: 16,
    color: "#f5f5f5",
    "&:hover": {
        color: "#c79a2a",
    },
});

const ToggleButton = styled(Button)({
    position: "absolute",
    fontSize: 12,
    bottom: 10,
    left: 18,
    background: "#d32f2f",
    color: "#fff",
    "&:hover": {
        background: "#b71c1c",
    },
});

interface CardFestivalProps {
    number: number | null;
    balance: number | null;
    is_active: boolean;
    id: number
}

export const CardFestival = ({ number, balance, is_active, id }: CardFestivalProps) => {
    const {updateCard} = useUserCardsStore();
    const [openDialog, setOpenDialog] = useState(false);
    const [tempIsActive, setTempIsActive] = useState(is_active);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const toggleDialog = () => {
        setOpenDialog(!openDialog);
    };

    const handleConfirmation = () => {
        ActivationCard(number, tempIsActive)
            .then((data) => {
                if (data) {
                    setSuccessMessage(data.message);
                    updateCard(data.updatedCard);
                    setTempIsActive(!tempIsActive);
                    setOpenDialog(false);
                } else {
                    setError("Une erreur s'est produite. Veuillez réessayer.");
                }
            })
            .catch((error) => {
                console.error("Erreur lors de l'activation ou de la désactivation de la carte:", error);
                setError(error.message);
            })
    };

    const handleCancel = () => {
        setOpenDialog(false);
    };

    return (
        <>
            <CardContainer is_active={tempIsActive}>
                <Chip />
                <CreditCardIcon style={{ position: "absolute", top: 16, right: 16, fontSize: 32 }} />
                <CardContent>
                    <CardNumber>{number}</CardNumber>
                    <CardBalance>Solde: {balance} €</CardBalance>
                    <CardStatus is_active={tempIsActive}>Statut: {tempIsActive ? "Active" : "Désactivée"}</CardStatus>
                    <ToggleButton onClick={toggleDialog} style={{ background: tempIsActive ? "#ef5350" : "#43a047" }}>
                        {tempIsActive ? "Désactiver" : "Activer"}
                    </ToggleButton>
                    <TransactionLink to="/transaction-history" state={{ cardId: id }}>
                        Voir Transactions
                    </TransactionLink>
                </CardContent>

                <Dialog open={openDialog} onClose={toggleDialog}>
                    <DialogTitle>Confirmation</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Êtes-vous sûr de vouloir <span style={{ fontWeight: "bold" }}>
                            {tempIsActive ? "désactiver" : "activer"}
                        </span> cette carte ?
                        </Typography>
                        {error && (
                            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                                {error}
                            </Typography>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCancel} sx={{ color: "#3E2723" }}>
                            Annuler
                        </Button>
                        <Button onClick={handleConfirmation} sx={{ color: "#3E2723" }}>
                            Confirmer
                        </Button>
                    </DialogActions>
                </Dialog>
            </CardContainer>

            <SnackbarSuccess successMessage={successMessage} setSuccessMessage={setSuccessMessage}/>
        </>
    );
};