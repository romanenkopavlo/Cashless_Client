import axios from "axios"
import parametres from "../../../public/parameters.json"

const URL_SERVEUR = parametres.URL_SERVER
const URL_LOGOUT = parametres.URL_LOGOUT

export const Disconnect = async () => {
    try {
        await axios.get(`${URL_SERVEUR}${URL_LOGOUT}`, {withCredentials: true})
    } catch (error) {
        console.error(error)
    }
}