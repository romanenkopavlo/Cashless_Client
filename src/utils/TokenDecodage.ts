import {jwtDecode} from "jwt-decode";
import User from "../models/users/User.ts";

export const getDecodedToken = (token: string | null | undefined): User | null => {
    if (!token) {
        console.log("Token is null or undefined");
        return null;
    }

    try {
        return jwtDecode<User>(token);
    } catch (error) {
        console.log("Failed to decode token: ", error);
        return null;
    }
}