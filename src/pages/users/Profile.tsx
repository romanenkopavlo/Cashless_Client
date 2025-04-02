import {Header} from "../../components/Header.tsx";
import {Footer} from "../../components/Footer.tsx";
import {Alert, Box, Button, Card, CardContent, Container, Typography} from "@mui/material";
import {useAuthenticationJWTStore} from "../../stores/AuthenticationJWT.ts";
import {AddCardForm} from "../../components/formulaires/AddCard.tsx"
import {getDecodedToken} from "../../utils/TokenDecodage.ts";
import {useUserCardsStore} from "../../stores/UserCardsStore.ts";
import {useEffect, useState} from "react";
import {CardFestival} from "../../components/CreditCard.tsx";
import User from "../../models/User.ts";
import {ModificationProfile} from "../../components/formulaires/ModificationProfile.tsx";

export const Profile = () => {
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const {accessToken} = useAuthenticationJWTStore();
    const {cards} = useUserCardsStore();
    const user = getDecodedToken(accessToken?.token)
    const [formData, setFormData] = useState<User>(new User(0, "", "", "", ""));
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => setSuccessMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const handleOpen = (user: User | null = null) => {
        if (user) {
            setFormData(user);
        } else {
            setFormData(new User(0, "", "", "", ""));
        }
        setOpen(true);
    };

    return (
        <>
            <Header />
            <div style={{height: "1400px"}}>
            <Container maxWidth="sm" sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
                <Card sx={{ width: "100%", boxShadow: 6, borderRadius: 3, p: 3, textAlign: "center" }}>
                    <CardContent>
                        <Typography variant="h5" fontWeight="bold">
                            {user?.prenom} {user?.nom}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            {user?.login}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1, color: "gray" }}>
                            Rôle: {user?.role}
                        </Typography>

                        {successMessage && (
                            <Alert severity="success" sx={{ mt: 2, mb: 2, justifyContent: "center", textAlign: "center" }}>
                                {successMessage}
                            </Alert>
                        )}

                        <Button onClick={() => handleOpen(user)} sx={{color: "#7f5656"}}>Modifier le profil</Button>

                        <Box sx={{ mt: 3 }}>
                            <AddCardForm setSuccessMessage={setSuccessMessage} />
                        </Box>
                    </CardContent>
                </Card>
            </Container>

            {cards && cards.length > 0 &&
                <Container maxWidth="lg" sx={{ mt: 4 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, textAlign: "center" }}>
                        Mes Cartes
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center" }}>
                            {cards.map((card) => (
                                    <CardFestival key={card.id_carte} number={card.numero} balance={card.montant} is_active={card.is_active} id={card.id_carte}/>
                            ))}
                    </Box>
                </Container>
            }
            <ModificationProfile open={open} formData={formData}/>
            </div>
            <Footer />
        </>
    )
}