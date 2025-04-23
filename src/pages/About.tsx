import { Box, Typography, Container, Divider, Paper } from "@mui/material";
import { motion } from "framer-motion";
import teamLogo from "../assets/team-logo.png";
import {Header} from "../components/Header.tsx";
import {Footer} from "../components/Footer.tsx";

export const About = () => {
    return (
        <>
            <Header/>
            <Container maxWidth="md" sx={{ mt: 7.5, mb: 15 }}>
                <Paper
                    sx={{
                        p: 4,
                        borderRadius: 4,
                        background: "#fff3e0",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                    }}
                >
                    <Box component={motion.div} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} textAlign="center">
                        <Box
                            component="img"
                            src={teamLogo}
                            alt="Logo de l'équipe"
                            sx={{
                                width: 180,
                                height: "auto",
                                maxWidth: "100%",
                                transition: "transform 0.3s ease-in-out",
                                '&:hover': {
                                    transform: "scale(1.3)",
                                    cursor: 'pointer'
                                }
                            }}
                        />
                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            À propos de <span style={{ color: "#7f5656" }}>Cashless</span>
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                            <strong>Cashless</strong> est une solution moderne de paiement sans espèces, conçue pour simplifier les transactions lors des événements. Elle permet une expérience rapide, sécurisée et intuitive pour les utilisateurs comme pour les organisateurs.
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 5 }} />

                    <Box component={motion.div} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }} textAlign="center">
                        <Typography variant="h5" fontWeight="medium" gutterBottom>
                            Ce projet a été réalisé par :
                        </Typography>
                        <Typography variant="subtitle1" sx={{ mt: 1 }}>Pavlo Romanenko</Typography>
                        <Typography variant="subtitle1">Robin Quirin</Typography>
                        <Typography variant="subtitle1">Nicolas Billet</Typography>
                    </Box>
                </Paper>
            </Container>
            <Footer/>
        </>
    );
};
