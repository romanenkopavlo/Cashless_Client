import {useFestivalierStore} from "../store/FestivalierStore.ts";
import {useStandStore} from "../store/StandStore.ts";
import {useTransactionStore} from "../store/TransactionStore.ts";
import {useBenevoleStore} from "../store/BenevoleStore.ts";
import {useVariablesStore} from "../store/VariablesStore.ts";
import {useCategorieStore} from "../store/CategorieStore.ts";

export const ViderStores = () => {
    const festivalierState = useFestivalierStore.getState();
    const standState = useStandStore.getState();
    const transactionState = useTransactionStore.getState();
    const benevoleState = useBenevoleStore.getState();
    const categorieState = useCategorieStore.getState();
    const variablesState = useVariablesStore.getState();

    if (festivalierState.festivaliers) festivalierState.setFestivaliers([]);
    if (standState.stands) standState.setStands([]);
    if (transactionState.transactions) transactionState.setTransactions([]);
    if (benevoleState.benevoles) benevoleState.setBenevoles([]);
    if (categorieState.categories) categorieState.setCategories([]);

    if (variablesState.isFetchedVisitors) variablesState.setIsFetchedVisitors(false);
    if (variablesState.isFetchedStands) variablesState.setIsFetchedStands(false);
    if (variablesState.isFetchedTransactions) variablesState.setIsFetchedTransactions(false);
    if (variablesState.isFetchedBenevoles) variablesState.setIsFetchedBenevoles(false);
    if (variablesState.isFetchedCategories) variablesState.setIsFetchedCategories(false);
}