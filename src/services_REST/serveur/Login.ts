import parameters from "../../../public/parameters.json";
import Token from "../../models/users/Token.ts";
import axios, {AxiosError} from "axios";

const URL_SERVER = parameters.URL_SERVER
const URL_AUTH = parameters.URL_AUTH

export const Login = async(username: string, password: string): Promise<Token | null> => {
    try {
        const response = await axios.post<Token>(`${URL_SERVER}${URL_AUTH}`, {username, password}, {withCredentials: true});
        console.log(`response.data de requette TokenLWT ${response.data.token}`)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response && error.response.status === 401) {
                throw new Error(error.response.data.message);
            }
        }
        return null;
    }
}