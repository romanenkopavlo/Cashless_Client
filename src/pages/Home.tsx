import {Header} from "../components/Header"
import {Footer} from "../components/Footer"
import BackgroundImage1 from "../assets/accueil_bg_1.jpg"
import BackgroundImage2 from "../assets/accueil_bg_2.jpg"
import BackgroundImage3 from "../assets/accueil_bg_3.jpg"
import ChateauImage1 from "../assets/image1.jpg"
import ChateauImage2 from "../assets/image2.jpg"
import ChateauImage3 from "../assets/image3.jpg"
import {Box, Card, CardMedia, Container, Grid2, Typography} from "@mui/material"
import { motion } from "framer-motion"
import {useEffect, useState} from "react"

export const Home = () => {
    const backgrounds = [BackgroundImage1, BackgroundImage2, BackgroundImage3];
    const [bgIndex, setBgIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setBgIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
        }, 5000);

        return () => clearInterval(interval);
    });

    return (
        <>
            <Header/>
            <Box
                component={motion.div} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                sx={{
                    backgroundImage: `url(${backgrounds[bgIndex]})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '70vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    textAlign: 'center',
                    transition: 'background-image 1s ease-in-out'
                }}
            >
                <Typography variant="h2" sx={{ backgroundColor: 'rgba(0,0,0,0.5)', p: 3, borderRadius: 2 }}>
                    Château de Freycinet
                </Typography>
            </Box>

            <Box sx={{ backgroundColor: '#f5f5f5', py: 8 }}>
                <Container maxWidth="lg">
                    <Typography variant="h4" align="center" gutterBottom>
                        Un lieu d’exception au cœur de la Drôme
                    </Typography>

                    <Box sx={{ my: 4 }}>
                        <Typography variant="h6" color="text.secondary" align="center">
                            Le Château de Freycinet, niché en Drôme, est un lieu d'exception alliant charme historique et confort moderne. Ce domaine du XIVe siècle propose un cadre idéal pour vos événements, qu'il s'agisse de mariages, séminaires ou événements culturels, avec ses espaces élégants, ses jardins soignés et des infrastructures adaptées pour garantir des moments inoubliables.
                        </Typography>
                    </Box>

                    <Grid2 container spacing={6} sx={{ my: 10 }}>
                        <Grid2 sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{
                                flex: 1,
                                '& img': {transition: 'transform 1.5s ease-in-out'},
                                '&:hover img': { transform: 'scale(1.3)', transition: 'transform 1.5s ease-in-out' }
                            }}>
                                <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
                                    <CardMedia
                                        component="img"
                                        height="350"
                                        image={ChateauImage1}
                                        alt="Vue du Château"
                                    />
                                </Card>
                            </Box>
                            <Box sx={{ flex: 1, pl: 4 }}>
                                <Typography variant="h6" gutterBottom>
                                    Un site historique pour vos événements 🏰
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Découvrez les nombreuses possibilités qu’offre le domaine : festivals, mariages, séminaires et bien plus encore. Un cadre parfait pour des moments inoubliables.
                                </Typography>
                                <Box sx={{ height: '1px', backgroundColor: '#ccc', my: 2 }}></Box>
                            </Box>
                        </Grid2>

                        <Grid2 sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row-reverse', justifyContent: 'space-between' }}>
                            <Box sx={{
                                flex: 1,
                                '& img': {transition: 'transform 1.5s ease-in-out'},
                                '&:hover img': { transform: 'scale(1.3)', transition: 'transform 1.5s ease-in-out' }
                            }}>
                                <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
                                    <CardMedia
                                        component="img"
                                        height="350"
                                        image={ChateauImage2}
                                        alt="Vue du Château"
                                    />
                                </Card>
                            </Box>
                            <Box sx={{ flex: 1, pr: 4 }}>
                                <Typography variant="h6" gutterBottom>
                                    Un lieu de rencontres et d’échanges 🤝
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Entre patrimoine et innovation, vivez une expérience culturelle inoubliable dans un lieu authentique, propice aux rencontres et aux échanges.
                                </Typography>
                                <Box sx={{ height: '1px', backgroundColor: '#ccc', my: 2 }}></Box>
                            </Box>
                        </Grid2>

                        <Grid2 sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{
                                flex: 1,
                                '& img': {transition: 'transform 1.5s ease-in-out'},
                                '&:hover img': { transform: 'scale(1.3)', transition: 'transform 1.5s ease-in-out' }
                            }}>
                                <Card sx={{ borderRadius: 4, boxShadow: 3 }}>
                                    <CardMedia
                                        component="img"
                                        height="350"
                                        image={ChateauImage3}
                                        alt="Vue du Château"
                                    />
                                </Card>
                            </Box>
                            <Box sx={{ flex: 1, pl: 4 }}>
                                <Typography variant="h6" gutterBottom>
                                    Des événements toute l’année 🌟
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    Le Château de Freycinet vous ouvre ses portes toute l’année pour vos événements, dans un cadre magique adapté à toutes les saisons.
                                </Typography>
                                <Box sx={{ height: '1px', backgroundColor: '#ccc', my: 2 }}></Box>
                            </Box>
                        </Grid2>
                    </Grid2>
                </Container>
            </Box>
            <Footer/>
        </>
    )
}