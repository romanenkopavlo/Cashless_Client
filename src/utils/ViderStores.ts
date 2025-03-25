import {useFestivaliersStore} from "../stores/FestivaliersStore.ts";
import {useStandsStore} from "../stores/StandsStore.ts";
import {useTransactionsStore} from "../stores/TransactionsStore.ts";
import {useBenevolesStore} from "../stores/BenevolesStore.ts";
import {useVariablesStore} from "../stores/VariablesStore.ts";
import {useCategoriesStore} from "../stores/CategoriesStore.ts";
import {useCardsStore} from "../stores/CardsStore.ts";
import {usePhonesStore} from "../stores/PhonesStore.ts";
import {useMarquesStore} from "../stores/MarquesStore.ts";
import {useTerminalsStore} from "../stores/TerminalsStore.ts";
import {useStatisticsStore} from "../stores/StatisticsStore.ts";

export const ViderStores = () => {
    const festivalierState = useFestivaliersStore.getState();
    const standState = useStandsStore.getState();
    const transactionState = useTransactionsStore.getState();
    const benevoleState = useBenevolesStore.getState();
    const categorieState = useCategoriesStore.getState();
    const cardState = useCardsStore.getState();
    const phoneState = usePhonesStore.getState();
    const marqueState = useMarquesStore.getState();
    const terminalState = useTerminalsStore.getState();
    const statisticState = useStatisticsStore.getState();
    const variablesState = useVariablesStore.getState();

    if (festivalierState.festivaliers) festivalierState.setFestivaliers([]);
    if (standState.stands) standState.setStands([]);
    if (transactionState.transactions) transactionState.setTransactions([]);
    if (benevoleState.benevoles) benevoleState.setBenevoles([]);
    if (categorieState.categories) categorieState.setCategories([]);
    if (cardState.cards) cardState.setCards([]);
    if (phoneState.phones) phoneState.setPhones([]);
    if (marqueState.marques) marqueState.setMarques([]);
    if (terminalState.terminals) terminalState.setTerminals([]);
    if (statisticState.statistics) statisticState.setStatistics([]);

    if (variablesState.isFetchedVisitors) variablesState.setIsFetchedVisitors(false);
    if (variablesState.isFetchedStands) variablesState.setIsFetchedStands(false);
    if (variablesState.isFetchedTransactions) variablesState.setIsFetchedTransactions(false);
    if (variablesState.isFetchedBenevoles) variablesState.setIsFetchedBenevoles(false);
    if (variablesState.isFetchedCategories) variablesState.setIsFetchedCategories(false);
    if (variablesState.isFetchedCards) variablesState.setIsFetchedCards(false);
    if (variablesState.isFetchedPhones) variablesState.setIsFetchedPhones(false);
    if (variablesState.isFetchedMarques) variablesState.setIsFetchedMarques(false);
    if (variablesState.isFetchedTerminals) variablesState.setIsFetchedTerminals(false);
    if (variablesState.isFetchedStatistics) variablesState.setIsFetchedStatistics(false);
}