import parameters from "../../../public/parameters.json"
import axios from "axios";

const URL_SERVER = parameters.URL_SERVER
const URL_LOGOUT = parameters.URL_LOGOUT

export const Disconnect = async () => {
    try {
        await axios.get(`${URL_SERVER}${URL_LOGOUT}`, {withCredentials: true})
    } catch (error) {
        console.error(error)
    }
}