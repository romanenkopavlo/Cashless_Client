import {useEffect} from "react";
import {useAuthenticationJWTStore} from "../store/AuthenticationJWT.ts";
import {Disconnect} from "../services_REST/serveur/Disconnect.ts";

export const UnloadLogout = () => {
    useEffect(() => {
        const handleBeforeUnload = async () => {
            const token = useAuthenticationJWTStore.getState().accessToken?.token;
            if (token) {
                try {
                    Disconnect().then(response => console.log(response))
                    console.log("Logout request sent before unload");
                } catch (error) {
                    console.error("Error during logout request:", error);
                }
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);
}