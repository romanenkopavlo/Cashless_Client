import {useEffect, useState} from "react";
import { Header } from "../../components/Header.tsx";
import { Footer } from "../../components/Footer.tsx";
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography, Box,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import Stand from "../../models/Stand.ts";
import {DeleteStand} from "../../services_REST/serveur/admin/stands/DeleteStand.ts";
import {useStandsStore} from "../../stores/StandsStore.ts";
import {useVariablesStore} from "../../stores/VariablesStore.ts";
import {GestionCategories} from "../../components/gestions/GestionCategoriesStands.tsx";
import {useCategoriesStore} from "../../stores/CategoriesStore.ts";
import {useBenevolesStore} from "../../stores/BenevolesStore.ts";
import {GetBenevoles} from "../../services_REST/serveur/admin/benevoles/GetBenevoles.ts";
import {updateCategoriesStands, updateStands} from "../../services/stands.ts";
import {SnackbarError} from "../../components/SnackbarError.tsx";
import {SuccessMessage} from "../../components/SuccessMessage.tsx";
import {ModifyOrAdd} from "../../components/gestions/stands/dialogs/ModifyOrAdd.tsx";
import {AffOrDesaffBenevoles} from "../../components/gestions/stands/dialogs/AffOrDesaffBenevoles.tsx";

export const GestionStands = () => {
    const {stands, setStands, deleteStand} = useStandsStore();
    const {categories, setCategories} = useCategoriesStore();
    const {setBenevoles} = useBenevolesStore();
    const {isFetchedStands, setIsFetchedStands} = useVariablesStore();

    const [errorSnackbar, setErrorSnackbar] = useState<string | null>(null);

    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [openBenevolesDialog, setOpenBenevolesDialog] = useState(false);
    const [selectedStand, setSelectedStand] = useState<Stand | null>(null);
    const [selectedStandModifyOrAdd, setSelectedStandModifyOrAdd] = useState<Stand | null>(null);

    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!isFetchedStands) {
            setIsFetchedStands(true);
            (async () => {
                await updateStands(setStands);
                await updateCategoriesStands(setCategories);
            })();
        }
    }, [isFetchedStands, setStands, setCategories, setIsFetchedStands]);

    const handleOpen = (editing = false, stand: Stand | null = null) => {
        setIsEditing(editing);
        setSelectedStandModifyOrAdd(stand);
        setOpen(true);
    };

    const handleOpenBenevolesDialog = (stand: Stand) => {
        setSelectedStand(stand);
        setOpenBenevolesDialog(true);
    };

    const handleDelete = (id: number) => {
        DeleteStand(id)
            .then((data) => {
                setSuccessMessage(data.message);
                deleteStand(id);
                return GetBenevoles();
            })
            .then((data) => {
                if (!data || !Array.isArray(data)) {
                    setBenevoles([]);
                } else {
                    setBenevoles(data);
                }
            })
            .catch((error) => {
                console.error("Erreur lors de la suppression des stands:", error);
                setErrorSnackbar(error.message)
            })
    };

    return (
        <>
            <Header/>
            <Box sx={{p: 3, textAlign: "center" }}>
                <Typography variant="h5" sx={{ mt: 1 }}>
                    Gestion des stands
                </Typography>
                {categories && categories.length > 0 ? (
                    <Button variant="contained" onClick={() => handleOpen(false)} style={{ marginTop: "20px", backgroundColor: "#7f5656" }}>
                        Ajouter un stand
                    </Button>
                ) : (
                    <Typography variant="h6" sx={{ mt: 1 }}>L'ajout d'un stand est impossible. Veuillez d'abord ajouter des catégories.</Typography>
                )}
            </Box>

            <SuccessMessage successMessage={successMessage} setSuccessMessage={setSuccessMessage}/>

            <Box sx={{ p: 3 }}>
                <TableContainer component={Paper} sx={{maxHeight: 400, boxShadow: 4, overflow: "auto", borderRadius: 2}}>
                    <Table sx={{ border: "1px solid #ddd" }}>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                <TableCell align="center" sx={{ border: "1px solid #ddd", width: "50px" }}>ID</TableCell>
                                <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>Nom</TableCell>
                                <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>Catégorie</TableCell>
                                <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>Nombre de bénévoles</TableCell>
                                <TableCell align="center" sx={{ border: "1px solid #ddd", width: "120px" }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {stands && stands.length > 0 ? (
                                stands.map((stand) => (
                                    <TableRow key={stand.id_stand}>
                                        <TableCell align="center" sx={{ border: "1px solid #ddd", width: "50px" }}>{stand.id_stand}</TableCell>
                                        <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>{stand.nom_stand}</TableCell>
                                        <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>{stand.nom_categorie ? stand.nom_categorie : '—'}</TableCell>
                                        <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}><Button
                                            onClick={() => handleOpenBenevolesDialog(stand)}
                                            sx={{
                                            color: "#7f5656",
                                                textDecoration: "underline",
                                                background: "none",
                                                border: "none",
                                                padding: 0,
                                                minWidth: "auto"
                                            }}
                                        >
                                            {stand.nombre_benevoles}
                                        </Button></TableCell>
                                        <TableCell align="center" sx={{ border: "1px solid #ddd", width: "120px" }}>
                                            {categories && categories.length > 0 && (<Button onClick={() => handleOpen(true, stand)}><Edit sx={{color: "#7f5656"}}/></Button>)}
                                            <Button onClick={() => handleDelete(stand.id_stand)} color="error"><Delete /></Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">Aucun stand trouvé.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <GestionCategories/>

            <ModifyOrAdd
                open={open}
                setOpen={setOpen}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                stand={selectedStandModifyOrAdd}
                setSuccessMessage={setSuccessMessage}
            />

            <AffOrDesaffBenevoles
                openBenevolesDialog={openBenevolesDialog}
                setOpenBenevolesDialog={setOpenBenevolesDialog}
                selectedStand={selectedStand}
            />

            <SnackbarError error={errorSnackbar} setError={setErrorSnackbar}/>

            <Footer/>
        </>
    );
};