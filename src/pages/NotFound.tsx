import {Box, Button, Typography} from "@mui/material";
import {Link} from "react-router";
import Image404 from "../assets/error_404.png"

export const NotFound = () => {
    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                textAlign: 'center',
                backgroundColor: '#f4f6f8',
                padding: 2,
            }}
        >
            <img
                src={Image404}
                alt="404 Not Found"
                style={{
                    width: '50%',
                    maxWidth: '400px',
                    marginBottom: '20px',
                }}
            />
            <Typography variant="h3" gutterBottom sx={{ color: '#a57272', fontWeight: 'bold' }}>
                Oups ! Page non trouvée
            </Typography>
            <Typography variant="h5" color="text.secondary" sx={{ marginBottom: 3 }}>
                Désolé, nous ne pouvons pas trouver la page que vous cherchez.
            </Typography>
            <Link to="/" style={{ textDecoration: 'none' }}>
                <Button sx = {{ color: "#E55B12" }} size="large">
                    Retour à l'accueil
                </Button>
            </Link>
        </Box>
    );
}