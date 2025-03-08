import parameters from "../../../../../public/parameters.json";
import {AxiosError} from "axios";
import {AxiosJwt} from "../../../../utils/Axios-JWT.ts";


const URL_UPDATE_BENEVOLE = parameters.URL_UPDATE_BENEVOLE

export const UpdateBenevole = async(id_benevole: number, nom: string, prenom: string, nom_stand: string, username: string, role: string | null) => {
    try {
        const axiosJWT = AxiosJwt()
        const response = await axiosJWT.post(`${URL_UPDATE_BENEVOLE}`, {id_benevole, nom, prenom, nom_stand, username, role});
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