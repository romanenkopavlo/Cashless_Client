import axios, {AxiosError} from "axios";
import parametres from "../../../public/parameters.json";

const URL_SERVER = parametres.URL_SERVER;

export const ServerCheckOnline = async(): Promise<boolean> => {
    try {
        const response = await axios.get(URL_SERVER, {timeout: 3000});
        return response.status >= 200 && response.status < 300;
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response && [400, 401, 404, 409, 500, 501].includes(error.response.status)) {
                throw new Error(error.response.data.message);
            }
        }
        return false;
    }
}