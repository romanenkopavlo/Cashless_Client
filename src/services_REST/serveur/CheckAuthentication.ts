// import parametres from "../../../public/parameters.json"
// import axios from "axios";
// import User from "../../models/users/User.ts";
//
// const URL_SERVEUR = parametres.URL_SERVER
// const URL_CHECK_AUTH = parametres.URL_CHECK_AUTH
//
// export const CheckAuthentication = async(): Promise<User | null> => {
//     try {
//         const response = await axios.post(`${URL_SERVEUR}${URL_CHECK_AUTH}`, {}, {withCredentials: true})
//         return response.data
//     } catch (error) {
//         console.log(error)
//         return null
//     }
// }