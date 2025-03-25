import {Box, Card, CardContent, Typography, Grid2, Divider} from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import {Header} from "../../components/Header.tsx";
import {Footer} from "../../components/Footer.tsx";
import {StatistiquesVentes} from "../../components/tables/StatistiquesVentes.tsx";
import {useVariablesStore} from "../../stores/VariablesStore.ts";
import {useEffect} from "react";
import {updateStatistics} from "../../services/statistics.ts";
import {useStatisticsStore} from "../../stores/StatisticsStore.ts";

export const Statistiques = () => {
    const {statisticTotal, setStatisticTotal, setStatistics} = useStatisticsStore();
    const {isFetchedStatistics, setIsFetchedStatistics} = useVariablesStore();

    useEffect(() => {
        if (!isFetchedStatistics) {
            setIsFetchedStatistics(true)
            updateStatistics(setStatistics, setStatisticTotal)
        }
    }, [isFetchedStatistics, setIsFetchedStatistics, setStatistics, setStatisticTotal]);

    const formatDate = (date:Date) => {
        return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
    };

    const currentDate = formatDate(new Date());

    const colors = ["#4CAF50", "#2196F3", "#9C27B0", "#FF5722"];

    const statsData = [
        { title: "Rechargements sur la période", value: `${statisticTotal?.somme_credits} €`,
            nombre: `${statisticTotal?.credits} rechargements`, sans_ann: `${statisticTotal?.somme_credits_sans_ann} €`, annulations: `${statisticTotal?.annulations_credits} annulations`, somme_ann: `${statisticTotal?.somme_ann_cre} €`, color: colors[0] },
        { title: "Paiements sur la période", value: `${statisticTotal?.somme_debits} €`,
            nombre: `${statisticTotal?.debits} paiements`, sans_ann: `${statisticTotal?.somme_debits_sans_ann} €`, annulations: `${statisticTotal?.annulations_debits} annulations`, somme_ann: `${statisticTotal?.somme_ann_deb} €`, color: colors[1] },
        { title: "Balance sur la période", value: `${statisticTotal?.balance_periode} €`,
            nombre: "", sans_ann: "", annulations: "", somme_ann: "", color: colors[2] },
        { title: `Solde au ${currentDate}`, value: `${statisticTotal?.solde} €`, nombre: "", sans_ann: "", annulations: "", somme_ann: "", color: colors[3] },
    ];

    const pieData = [
        { name: "CB", value: 84054.53, color: "#0088FE" },
        { name: "Espèces", value: 19442.50, color: "#FFBB28" },
        { name: "Offert", value: 4170.28, color: "#FF8042" },
    ];

    return (
        <>
            <Header/>
            <div style={{height: "1200px"}}>
                <div style={{padding: "20px", textAlign: "center"}}>
                    <Typography variant="h5" sx={{mt: 1, fontWeight:"bold"}}>
                        Statistiques de ventes
                    </Typography>
                </div>
                {statisticTotal ? (
                        <Box p={4}>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center" }}>
                                {statsData.map((stat) => (
                                    <Grid2 key={stat.title}>
                                        <Card sx={{backgroundColor: stat.color, color: "#fff", height: 150, width: 350, pb: 23.5, borderRadius: 2}}>
                                            <CardContent>
                                                <Typography variant="h6">{stat.title}</Typography>
                                                <Box sx={{ display: 'flex', justifyContent: 'right', mt: 1}}>
                                                    <Typography variant="h5" fontWeight="bold">{stat.value}</Typography>
                                                </Box>

                                                {statsData.indexOf(stat) < 2 && <Divider sx={{ my: 2, borderColor: 'white' }} />}

                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 1 }}>
                                                    <Typography variant="body2">{stat.nombre}</Typography>
                                                    <Typography variant="body2">{stat.sans_ann}</Typography>
                                                </Box>

                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 1 }}>
                                                    <Typography variant="body2">{stat.annulations}</Typography>
                                                    <Typography variant="body2">{stat.somme_ann}</Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid2>
                                ))}
                            </Box>

                            <Box mt={10} display="flex" flexDirection="column" alignItems="center">
                                <Typography variant="h6" sx={{fontWeight:"bold"}}>Répartition des paiements</Typography>
                                <PieChart width={400} height={300}>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label
                                    >
                                        {pieData.map((entry) => (
                                            <Cell key={`cell-${entry.value}`} fill={entry.color}/>
                                        ))}
                                    </Pie>
                                    <Tooltip/>
                                    <Legend/>
                                </PieChart>
                            </Box>
                        </Box>
                ) : (
                    <Typography variant="body2" color="textSecondary" sx={{ textAlign: "center", py: 2 }}>
                        Aucune statistique disponible.
                    </Typography>
                )}
                <Box mt={3}>
                    <StatistiquesVentes/>
                </Box>
            </div>
            <Footer/>
        </>
    );
};

// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
// import {useState} from "react";

// const [startDate, setStartDate] = useState<Date | null>(null);
// const [endDate, setEndDate] = useState<Date | null>(null);

{/*<Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>*/}
{/*    <Typography variant="h6">*/}
{/*        Sélectionnez la période :*/}
{/*    </Typography>*/}
{/*    <LocalizationProvider dateAdapter={AdapterDayjs}>*/}
{/*        <Box sx={{ display: "flex", gap: 2 }}>*/}
{/*            <DatePicker*/}
{/*                label="Date de début"*/}
{/*                value={startDate}*/}
{/*                onChange={(newValue) => setStartDate(newValue)}*/}
{/*            />*/}
{/*            <DatePicker*/}
{/*                label="Date de fin"*/}
{/*                value={endDate}*/}
{/*                onChange={(newValue) => setEndDate(newValue)}*/}
{/*            />*/}
{/*        </Box>*/}
{/*    </LocalizationProvider>*/}
{/*</Box>*/}