import {useNavigate} from "react-router";
import {useEffect} from "react";
import {Disconnect} from "../../services_REST/serveur/connection/Disconnect.ts";
import {useAuthenticationJWTStore} from "../../store/AuthenticationJWT.ts";
import Token from "../../models/Token.ts";
import {useFestivalierStore} from "../../store/FestivalierStore.ts";
import {useVariablesStore} from "../../store/VariablesStore.ts";
import {useStandStore} from "../../store/StandStore.ts";

export const Logout = () => {
    const navigate = useNavigate();
    useEffect(() => {
        Disconnect().then(() => {
            console.log("Redirecting to login...")
            useAuthenticationJWTStore.getState().setAccessToken(new Token(null))

            const festivalierState = useFestivalierStore.getState();
            const standState = useStandStore.getState();
            const variablesState = useVariablesStore.getState();

            if (festivalierState.festivaliers) festivalierState.setFestivaliers([]);
            if (standState.stands) standState.setStands([]);
            if (variablesState.isFetchedVisitors) variablesState.setIsFetchedVisitors(false);
            if (variablesState.isFetchedStands) variablesState.setIsFetchedStands(false);

            if (sessionStorage.getItem("isPageRefreshing")) sessionStorage.removeItem("isPageRefreshing");
        })
        navigate("/login", {replace: true})
    })
    return null
}