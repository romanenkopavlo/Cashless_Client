import { Footer } from "../components/Footer.tsx";
import { Header } from "../components/Header.tsx";
import { Box, Container, TextField, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import {styleCustomInput} from "../styles/CustomInputField.ts"

export const Contact = () => {
    return (
        <>
            <Header />
            <Container maxWidth="sm" sx={{ mt: 7.5, mb: 15 }}>
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    sx={{
                        p: 4,
                        borderRadius: 6,
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                        background: '#ffffff',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid #e0e0e0',
                    }}
                >
                    <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
                        Contactez-nous
                    </Typography>
                    <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 4 }}>
                        Nous sommes à votre écoute. Remplissez le formulaire ci-dessous.
                    </Typography>

                    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField
                            sx={styleCustomInput}
                            label="Nom"
                            variant="outlined"
                            fullWidth
                            required
                        />
                        <TextField
                            sx={styleCustomInput}
                            label="Prénom"
                            variant="outlined"
                            fullWidth
                            required
                        />
                        <TextField
                            sx={styleCustomInput}
                            label="Adresse e-mail"
                            variant="outlined"
                            type="email"
                            fullWidth
                            required
                        />
                        <TextField
                            sx={styleCustomInput}
                            label="Votre message"
                            variant="outlined"
                            fullWidth
                            required
                            multiline
                            rows={5}
                        />
                        <Button
                            variant="contained"
                            size="large"
                            sx={{
                                mt: 2,
                                py: 1.5,
                                borderRadius: '12px',
                                backgroundColor: '#a57272',
                                '&:hover': {
                                    backgroundColor: '#7f5656'
                                },
                                textTransform: 'none',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                width: '50%',
                                alignSelf: 'center'
                            }}
                        >
                            Envoyer le message
                        </Button>
                    </Box>
                </Box>
            </Container>
            <Footer />
        </>
    );
};
