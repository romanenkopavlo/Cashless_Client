import {Paper, BottomNavigation, BottomNavigationAction} from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ContactMailIcon from '@mui/icons-material/ContactMail';

export const Footer = () => {
    return (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0}} elevation={3}>
            <BottomNavigation
                showLabels
                sx={{bgcolor: '#bc8f8f'}}
            >
                <BottomNavigationAction sx={{color: '#ffffff'}} label="Accueil" icon={<HomeIcon />} />
                <BottomNavigationAction sx={{color: '#ffffff'}} label="À propos" icon={<InfoIcon />} />
                <BottomNavigationAction sx={{color: '#ffffff'}} label="Contact" icon={<ContactMailIcon />} />
            </BottomNavigation>
        </Paper>
    );
}