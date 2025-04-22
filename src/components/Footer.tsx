import {Paper, Typography} from "@mui/material";

export const Footer = () => {
    return (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, bgcolor: '#bc8f8f', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px' }} elevation={3}>
            <Typography sx={{ color: '#ffffff', fontSize: '14px' }}>
                &copy; 2025 Cashless. Tous droits réservés.
            </Typography>
        </Paper>
    );
}