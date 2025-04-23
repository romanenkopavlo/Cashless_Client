import {Header} from "../../components/Header.tsx";
import {Footer} from "../../components/Footer.tsx";
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, Typography
} from "@mui/material";
import {Delete, Edit, ManageAccounts} from "@mui/icons-material";
import {useEffect, useState} from "react";
import {useVariablesStore} from "../../stores/VariablesStore.ts";
import {useBenevolesStore} from "../../stores/BenevolesStore.ts";
import Benevole from "../../models/Benevole.ts";
import {DeleteBenevole} from "../../services_REST/serveur/admin/benevoles/DeleteBenevole.ts";
import {updateBenevoles} from "../../services/benevoles.ts";
import {SnackbarError} from "../../components/SnackbarError.tsx";
import {SuccessMessage} from "../../components/SuccessMessage.tsx";
import {ModifyOrAdd} from "../../components/gestions/benevoles/dialogs/ModifyOrAdd.tsx";
import {ChangeRole} from "../../components/gestions/benevoles/dialogs/ChangeRole.tsx";
import {AffOrDesaffStands} from "../../components/gestions/benevoles/dialogs/AffOrDesaffStands.tsx";

export const GestionBenevoles = () => {
    const {benevoles, setBenevoles, deleteBenevole} = useBenevolesStore();
    const {isFetchedBenevoles, setIsFetchedBenevoles} = useVariablesStore();

    const [errorSnackbar, setSnackbarError] = useState<string | null>(null);

    const [open, setOpen] = useState(false);
    const [openRoleDialog, setOpenRoleDialog] = useState(false);
    const [openStandsDialog, setOpenStandsDialog] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [selectedBenevole, setSelectedBenevole] = useState<Benevole | undefined>(undefined);
    const [selectedBenevoleModifyOrAdd, setSelectedBenevoleModifyOrAdd] = useState<Benevole | null>(null);
    const [selectedBenevoleChangeRole, setSelectedBenevoleChangeRole] = useState<Benevole | null>(null);

    useEffect(() => {
        if (!isFetchedBenevoles) {
            setIsFetchedBenevoles(true);
            updateBenevoles(setBenevoles);
        }
    }, [isFetchedBenevoles, setBenevoles, setIsFetchedBenevoles]);

    const handleOpen = (editing = false, benevole: Benevole | null = null) => {
        setIsEditing(editing);
        setSelectedBenevoleModifyOrAdd(benevole);
        setOpen(true);
    };

    const handleOpenRoleDialog = (benevole: Benevole) => {
        setSelectedBenevoleChangeRole(benevole);
        setOpenRoleDialog(true);
    };

    const handleOpenStandsDialog = (benevole : Benevole) => {
        setSelectedBenevole(benevole);
        setOpenStandsDialog(true);
    };

    const handleDelete = (id: number) => {
        DeleteBenevole(id)
            .then((data) => {
                setSuccessMessage(data.message);
                deleteBenevole(id);
            })
            .catch((error) => {
                console.error("Erreur lors de la suppression des bénévoles:", error);
                setSnackbarError(error.message);
            });
    };

    return (
        <>
            <Header/>

            <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="h5" sx={{ mt: 1 }}>
                    Gestion des bénévoles
                </Typography>
                <Button variant="contained" onClick={() => handleOpen(false)} style={{ marginTop: "20px", backgroundColor: "#7f5656" }}>
                    Ajouter un bénévole
                </Button>
            </Box>

            <SuccessMessage successMessage={successMessage} setSuccessMessage={setSuccessMessage}/>

            <Box sx={{ p: 3, mb: 15 }}>
                <TableContainer component={Paper} sx={{maxHeight: 400, boxShadow: 4, overflow: "auto", borderRadius: 2}}>
                    <Table sx={{ border: "1px solid #ddd" }}>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                <TableCell align="center" sx={{ border: "1px solid #ddd", width: "50px" }}>ID</TableCell>
                                <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>Nom</TableCell>
                                <TableCell align="center" sx={{ border: "1px solid #ddd", width: "100px" }}>Prénom</TableCell>
                                <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>Login</TableCell>
                                <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>Stands</TableCell>
                                <TableCell align="center" sx={{ border: "1px solid #ddd", width: "120px" }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {benevoles && benevoles.length > 0 ? (
                                benevoles.map((benevole) => (
                                    <TableRow key={benevole.id}>
                                        <TableCell align="center" sx={{ border: "1px solid #ddd", width: "50px" }}>{benevole.id}</TableCell>
                                        <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>{benevole.nom}</TableCell>
                                        <TableCell align="center" sx={{ border: "1px solid #ddd", width: "100px" }}>{benevole.prenom}</TableCell>
                                        <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>{benevole.login}</TableCell>
                                        <TableCell align="center" sx={{ border: "1px solid #ddd", width: "150px" }}>
                                                <Button
                                                    onClick={() => handleOpenStandsDialog(benevole)}
                                                    sx={{
                                                    color: "#7f5656",
                                                    textDecoration: "underline",
                                                    background: "none",
                                                    border: "none",
                                                    padding: 0,
                                                    }}
                                                >
                                                    Voir stands
                                                </Button>
                                        </TableCell>
                                        <TableCell align="center" sx={{ border: "1px solid #ddd", width: "120px" }}>
                                            <Button onClick={() => handleOpenRoleDialog(benevole)}><ManageAccounts sx={{ color: "#7f5656" }} /></Button>
                                            <Button onClick={() => handleOpen(true, benevole)}><Edit sx={{color: "#7f5656"}}/></Button>
                                            <Button onClick={() => handleDelete(benevole.id)} color="error"><Delete /></Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">Aucun bénévole trouvé.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <ModifyOrAdd
                open={open}
                setOpen={setOpen}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                benevole={selectedBenevoleModifyOrAdd}
                setSuccessMessage={setSuccessMessage}
            />

            <ChangeRole
                openRoleDialog={openRoleDialog}
                setOpenRoleDialog={setOpenRoleDialog}
                benevole={selectedBenevoleChangeRole}
                setSuccessMessage={setSuccessMessage}
            />

            <AffOrDesaffStands
                openStandsDialog={openStandsDialog}
                setOpenStandsDialog={setOpenStandsDialog}
                selectedBenevole={selectedBenevole}
            />

            <SnackbarError error={errorSnackbar} setError={setSnackbarError}/>

            <Footer/>
        </>
    )
}