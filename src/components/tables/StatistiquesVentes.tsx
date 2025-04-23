import {
    Box,
    Paper,
    Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow,
    Typography
} from "@mui/material";
import {useStatisticsStore} from "../../stores/StatisticsStore.ts";

export const StatistiquesVentes = () => {
    const {statistics} = useStatisticsStore();

    return (
        <>
                <Box sx={{p: 3, textAlign: "center"}}>
                    <Typography variant="h6" sx={{mt: 1, fontWeight: "bold"}}>
                        Points de ventes
                    </Typography>
                </Box>
                <Box sx={{p: 3, mb: 15}}>
                    <TableContainer component={Paper}
                                    sx={{maxHeight: 400, boxShadow: 4, overflow: "auto", borderRadius: 2}}>
                        <Table sx={{border: "1px solid #ddd"}}>
                            <TableHead>
                                <TableRow sx={{backgroundColor: "#f5f5f5"}}>
                                    <TableCell align="center"
                                               sx={{border: "1px solid #ddd", width: "50px"}}>Stand</TableCell>
                                    <TableCell align="center"
                                               sx={{border: "1px solid #ddd", width: "150px"}}>Nombre Crédits</TableCell>
                                    <TableCell align="center"
                                               sx={{border: "1px solid #ddd", width: "100px"}}>Somme Crédits (€)</TableCell>
                                    <TableCell align="center"
                                               sx={{border: "1px solid #ddd", width: "100px"}}>Nombre Débits</TableCell>
                                    <TableCell align="center"
                                               sx={{border: "1px solid #ddd", width: "150px"}}>Somme Débits (€)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {statistics && statistics.length > 0 ? (
                                    statistics.map((statistic) =>
                                        <TableRow key={statistic.nom_stand}>
                                            <TableCell align="center" sx={{
                                                border: "1px solid #ddd",
                                                width: "50px"
                                            }}>{statistic.nom_stand}</TableCell>
                                            <TableCell align="center" sx={{
                                                border: "1px solid #ddd",
                                                width: "150px"
                                            }}>{statistic.nombre_credits ? statistic.nombre_credits : 0}</TableCell>
                                            <TableCell align="center" sx={{
                                                border: "1px solid #ddd",
                                                width: "100px",
                                            }}>{statistic.somme_credits ? statistic.somme_credits : 0}</TableCell>
                                            <TableCell align="center" sx={{
                                                border: "1px solid #ddd",
                                                width: "150px"
                                            }}>{statistic.nombre_debits ? statistic.nombre_debits : 0}</TableCell>
                                            <TableCell align="center" sx={{
                                                border: "1px solid #ddd",
                                                width: "100px"
                                            }}>{statistic.somme_debits ? statistic.somme_debits : 0}</TableCell>
                                        </TableRow>
                                    )
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">Aucun point vente trouvé.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
        </>
    )
}