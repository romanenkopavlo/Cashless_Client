import {create} from "zustand";
import Token from "../models/users/Token.ts";

interface InterfaceTokenStore {
    accessToken: Token | null
    setAccessToken: (newToken: Token | null ) => void
}
export const useAuthenticationJWTStore = create<InterfaceTokenStore>()(
    (set) => ({
        accessToken: null,
        setAccessToken: (token) => set({accessToken: token}),
    })
)