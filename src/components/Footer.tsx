import { Link } from "react-router-dom";
import { Container, Typography, Box, Button } from "@mui/material";
import './Footer.css';

export const Footer = () => {
    return (
        <Box component="footer" className="footer">
            <Container maxWidth="lg">
                <Box className="footer-content">
                    <Typography variant="h6" className="footer-title">
                        Château de Freycinet
                    </Typography>
                    <Box className="footer-nav">
                        <Link to="/about" className="footer-link">
                            <Button color="inherit">À propos</Button>
                        </Link>
                        <Link to="/contact" className="footer-link">
                            <Button color="inherit">Contact</Button>
                        </Link>
                        <Link to="/privacy-policy" className="footer-link">
                            <Button color="inherit">Politique de confidentialité</Button>
                        </Link>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}