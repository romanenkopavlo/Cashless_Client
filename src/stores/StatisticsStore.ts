import {create} from "zustand";
import Statistic from "../models/Statistic.ts";
import StatisticTotal from "../models/StatisticTotal.ts";

interface InterfaceStatisticsStore {
    statistics: Statistic[];
    statisticTotal: StatisticTotal | null;
    setStatisticTotal: (newStatisticTotal: StatisticTotal | null) => void;
    setStatistics: (newStatistics: Statistic[]) => void
}

export const useStatisticsStore = create<InterfaceStatisticsStore>((set) => ({
    statistics: [],
    statisticTotal: null,
    setStatistics: (newStatistics) => set({ statistics: newStatistics }),
    setStatisticTotal: (newStatisticTotal) => set({statisticTotal: newStatisticTotal}),
}));