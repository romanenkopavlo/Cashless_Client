import parameters from "../../../../public/parameters.json"
import axios, {AxiosError} from "axios";

const URL_SERVER = parameters.URL_SERVER
const URL_LOGOUT = parameters.URL_LOGOUT

export const Disconnect = async () => {
    try {
        await axios.get(`${URL_SERVER}${URL_LOGOUT}`, {withCredentials: true})
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response && [400, 401, 404, 409, 500, 501].includes(error.response.status)) {
                throw new Error(error.response.data.message);
            }
        }
        return null;
    }
}