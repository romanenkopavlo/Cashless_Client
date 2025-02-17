import {AppBar, Button, Container, IconButton, Toolbar, Typography} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import {Link} from "react-router";
import './Header.css';
import {useAuthenticationJWTStore} from "../store/AuthenticationJWT.ts";

export const Header = () => {
    const {accessToken} = useAuthenticationJWTStore()
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
                        {/*<Link to ="/logout">*/}
                        {/*    <Button color="inherit" className="cta-button">*/}
                        {/*        Déconnexion*/}
                        {/*    </Button>*/}
                        {/*</Link>*/}

                        {/*<div className="header-buttons">*/}
                        {/*    <Link to="/login">*/}
                        {/*        <Button color="inherit" className="cta-button">*/}
                        {/*            Se connecter*/}
                        {/*        </Button>*/}
                        {/*    </Link>*/}
                        {/*    <Link to="/signup">*/}
                        {/*        <Button color="inherit" className="cta-button">*/}
                        {/*            S'inscrire*/}
                        {/*        </Button>*/}
                        {/*    </Link>*/}
                        {/*</div>*/}

                </Container>
            </Toolbar>
        </AppBar>
    )
}