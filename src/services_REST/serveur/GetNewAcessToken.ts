import axios, {AxiosError} from "axios";
import parametres from "../../../public/parameters.json";
import Token from "../../models/users/Token.ts";

const URL_SERVEUR = parametres.URL_SERVER
const URL_REFRESH_TOKEN = parametres.URL_REFRESH_TOKEN

export const GetNewAccessToken = async(): Promise<Token | null> => {
    try {
        const response = await axios.post<Token | null>(`${URL_SERVEUR}${URL_REFRESH_TOKEN}`, {}, {withCredentials: true})
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response && error.response.status === 403) {
                throw new Error(error.response.data.message);
            }
        }
        return null;
    }
}