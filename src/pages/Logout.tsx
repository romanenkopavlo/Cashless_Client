import {useNavigate} from "react-router";
import {useAuthenticationJWTStore} from "../store/AuthenticationJWT.ts";
import {useEffect} from "react";
import {Disconnect} from "../services_REST/serveur/Disconnect.ts";
import Token from "../models/users/Token.ts";

export const Logout = () => {
    const navigate = useNavigate();
    useEffect(() => {
        Disconnect().then(response => console.log(response))
        useAuthenticationJWTStore.getState().setAccessToken(new Token(null))
        navigate("/login", {replace: true})
    }, [])
    return null
}