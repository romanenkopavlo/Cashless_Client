import {AppBar, Button, Container, IconButton, Menu, MenuItem, Toolbar, Typography} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import {Link} from "react-router";
import './Header.css';
import {useAuthenticationJWTStore} from "../store/AuthenticationJWT.ts";
import {useState} from "react";
import * as React from "react";
import {CreditCard, People, Storefront} from "@mui/icons-material";
import {getDecodedToken} from "../utils/TokenDecodage.ts";

export const Header = () => {
    const {accessToken} = useAuthenticationJWTStore()
    const user = getDecodedToken(accessToken?.token)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const menuItemStyle = {
        '&:hover': {
            backgroundColor: '#bc8f8f',
            color: '#fff',
        },
        padding: '10px 20px',
    };

    return (
        <AppBar position="sticky" className="header">
            <Toolbar>
                <Container maxWidth="lg" className="header-container">
                    <Typography variant="h6" className="logo">
                        Château de Freycinet
                    </Typography>
                    <nav>
                        <ul className="nav-list">
                            <li><Link to="/" className="nav-link">Accueil</Link></li>
                            <li><Link to="/about" className="nav-link">À propos</Link></li>
                            <li><Link to="/contact" className="nav-link">Contact</Link></li>
                        </ul>
                    </nav>
                    {accessToken ? (
                        <div className="header-buttons">
                            {user?.role === "Administrateur" &&
                                <>
                                    <IconButton color="inherit" onClick={handleMenuOpen}>
                                        <MenuIcon fontSize="large" sx={{ color: "#FFFFFF" }} />
                                    </IconButton>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl)}
                                        onClose={handleMenuClose}
                                        sx={{
                                            '& .MuiMenu-paper': {
                                                backgroundColor: '#7f5656',
                                                color: '#fff',
                                                borderRadius: '8px',
                                                boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.3)',
                                            },
                                        }}
                                    >
                                        <MenuItem onClick={handleMenuClose} component={Link} to="/manage-cards" sx={menuItemStyle}><CreditCard sx={{ marginRight: '10px' }} /> Gestion des cartes</MenuItem>
                                        <MenuItem onClick={handleMenuClose} component={Link} to="/manage-stands" sx={menuItemStyle}><Storefront sx={{ marginRight: '10px' }} /> Gestion des stands</MenuItem>
                                        <MenuItem onClick={handleMenuClose} component={Link} to="/manage-users" sx={menuItemStyle}><People sx={{ marginRight: '10px' }} /> Gestion des utilisateurs</MenuItem>
                                    </Menu>
                                </>}
                            <Link to="/profile">
                                <IconButton color="inherit">
                                    <AccountCircleIcon fontSize="large" sx={{ color: "#FFFFFF" }}/>
                                </IconButton>
                            </Link>
                            <Link to="/logout">
                                <IconButton color="inherit">
                                    <LogoutIcon fontSize="large" sx={{ color: "#FFFFFF" }}/>
                                </IconButton>
                            </Link>
                        </div>
                    ) : (
                        <div className="header-buttons">
                            <Link to="/login">
                                <Button color="inherit" className="cta-button">
                                    Se connecter
                                </Button>
                            </Link>
                            <Link to="/signup">
                                <Button color="inherit" className="cta-button">
                                    S'inscrire
                                </Button>
                            </Link>
                        </div>
                    )}
                </Container>
            </Toolbar>
        </AppBar>
    )
}