import axios from "axios";
import parametres from "../../../public/parameters.json";

const URL_SERVER = parametres.URL_SERVER;

export const ServerCheckOnline = async(): Promise<boolean> => {
    try {
        const response = await axios.get(URL_SERVER, {timeout: 3000});
        return response.status >= 200 && response.status < 300;
    } catch (error) {
        console.log(error);
        return false;
    }
}