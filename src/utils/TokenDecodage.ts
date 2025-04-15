import {jwtDecode} from "jwt-decode";
import Benevole from "../models/Benevole.ts";

export const getDecodedToken = (token: string | null | undefined): Benevole | null => {
    if (!token) {
        console.log("Token is null or undefined");
        return null;
    }

    try {
        return jwtDecode<Benevole>(token);
    } catch (error) {
        console.log("Failed to decode token: ", error);
        return null;
    }
}