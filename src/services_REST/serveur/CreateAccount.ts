import parameters from "../../../public/parameters.json";
import axios, {AxiosError} from "axios";

const URL_SERVER = parameters.URL_SERVER
const URL_SIGNUP = parameters.URL_SIGNUP

export const CreateAccount = async(name: string, surname: string, login: string, password: string, cardNumber: string) => {
    try {
        const response = await axios.post(`${URL_SERVER}${URL_SIGNUP}`, {name, surname, login, password, cardNumber}, {withCredentials: true});
        console.log(response.data)
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