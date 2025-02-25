import {Header} from "../../components/Header.tsx";
import {Footer} from "../../components/Footer.tsx";
import {Link} from "react-router";
import {Alert, Box, Button, Container, Typography} from "@mui/material";
import {useAuthenticationJWTStore} from "../../store/AuthenticationJWT.ts";
import {AddCardForm} from "../../components/formulaires/AddCard.tsx"
import {getDecodedToken} from "../../utils/TokenDecodage.ts";
import {useCardStore} from "../../store/CardStore.ts";
import {useEffect, useState} from "react";

export const Profile = () => {
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const {accessToken} = useAuthenticationJWTStore()
    const {card} = useCardStore();
    const user = getDecodedToken(accessToken?.token)

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    return (
        <>
            <Header/>
            <Container maxWidth="xs" sx={{mt: 3}}>
                {successMessage && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {successMessage}
                    </Alert>
                )}

                <Box
                    sx = {
                        {
                            p: 4,
                            boxShadow: 16,
                            borderRadius: 2,
                            bgcolor: "background.paper"
                        }
                    }>
                    <Typography
                        variant="subtitle1"
                        sx={{fontWeight: 'bold', textAlign: 'left'}}
                    >
                        ID: {user?.id}
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        sx={{fontWeight: 'bold', textAlign: 'left'}}
                    >
                        Nom: {user?.nom}
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        sx={{fontWeight: 'bold', textAlign: 'left'}}
                    >
                        Prenom: {user?.prenom}
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        sx={{fontWeight: 'bold', textAlign: 'left'}}
                    >
                        Username: {user?.login}
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        sx={{fontWeight: 'bold', textAlign: 'left'}}
                    >
                        Role: {user?.role}
                    </Typography>
                    {card && card.numero &&
                        <Typography
                            sx={{fontWeight: 'bold', textAlign: 'left'}}>
                            Numéro de la carte: {card.numero}
                        </Typography>}
                    {card && card.montant &&
                        <Typography
                            sx={{fontWeight: 'bold', textAlign: 'left'}}>
                            Solde: {card.montant}€
                        </Typography>}
                    {card?.numero && card?.montant &&
                        <Box sx={{mt: 2, textAlign: "center"}}>
                            <Link to="/transaction-history" style={{textDecoration: "none"}}>
                                <Button color="inherit" className="cta-button">
                                    Voir l'historique des transactions
                                </Button>
                            </Link>
                        </Box>
                    }
                </Box>
                {!card?.numero && !card?.montant &&
                    <AddCardForm setSuccessMessage={setSuccessMessage}/>}
            </Container>
            <Footer/>
        </>
    )
}