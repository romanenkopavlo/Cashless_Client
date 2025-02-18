import { useEffect } from "react";
import { Disconnect } from "../services_REST/serveur/Disconnect.ts";
import {useAuthenticationJWTStore} from "../store/AuthenticationJWT.ts";

export const UnloadLogout = () => {
    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            const token = useAuthenticationJWTStore.getState().accessToken?.token;
            if (token) {
                event.preventDefault();
                sessionStorage.setItem("isPageRefreshing", "true");
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    useEffect(() => {
        const isRefreshing = sessionStorage.getItem("isPageRefreshing");

        if (isRefreshing) {
            sessionStorage.removeItem("isPageRefreshing");

            Disconnect().then(() => {
                console.log("Redirecting to login");
            })
        }
    });

    return null;
}
