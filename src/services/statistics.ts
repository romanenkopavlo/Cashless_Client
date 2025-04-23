import Statistic from "../models/Statistic.ts";
import {GetStatistics} from "../services_REST/serveur/admin/statistics/GetStatistics.ts";
import StatisticTotal from "../models/StatisticTotal.ts";

export const updateStatistics = (
    setStatistics: (newStatistics: Statistic[]) => void,
    setStatisticTotal: ((newStatisticTotal: StatisticTotal | null) => void) | null) => {
    GetStatistics()
        .then((data) => {
            if (!data.statistics || !Array.isArray(data.statistics)) {
                setStatistics([]);
            } else {
                setStatistics(data.statistics);
            }

            if (setStatisticTotal) {
                if (!data.statisticTotal) {
                    setStatisticTotal(null);
                } else {
                    setStatisticTotal(data.statisticTotal);
                }
            }
        })
        .catch((error) => {
            console.error("Erreur lors de la récupération des statistiques:", error);
            setStatistics([]);
            if (setStatisticTotal) {
                setStatisticTotal(null)
            }
        })
}