import {useNavigate} from "react-router";
import {useEffect} from "react";
import {Disconnect} from "../../services_REST/serveur/connection/Disconnect.ts";
import {useAuthenticationJWTStore} from "../../stores/AuthenticationJWT.ts";
import Token from "../../models/Token.ts";
import {ViderStores} from "../../utils/ViderStores.ts";

export const Logout = () => {
    const navigate = useNavigate();
    useEffect(() => {
        Disconnect().then(() => {
            console.log("Redirecting to login...")
            useAuthenticationJWTStore.getState().setAccessToken(new Token(null))

            ViderStores()

            if (sessionStorage.getItem("isPageRefreshing")) sessionStorage.removeItem("isPageRefreshing");
        })
        navigate("/login", {replace: true})
    })
    return null
}