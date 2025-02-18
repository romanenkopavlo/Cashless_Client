import {useNavigate} from "react-router";
import {useEffect} from "react";
import {Disconnect} from "../services_REST/serveur/Disconnect.ts";
import {useAuthenticationJWTStore} from "../store/AuthenticationJWT.ts";
import Token from "../models/users/Token.ts";

export const Logout = () => {
    const navigate = useNavigate();
    useEffect(() => {
        Disconnect().then(() => {
            console.log("Redirecting to login...")
            useAuthenticationJWTStore.getState().setAccessToken(new Token(null))
            if (sessionStorage.getItem("isPageRefreshing")) {
                sessionStorage.removeItem("isPageRefreshing");
            }

        })
        navigate("/login", {replace: true})
    })
    return null
}