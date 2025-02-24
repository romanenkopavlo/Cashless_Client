import parameters from "../../../public/parameters.json";
import {AxiosError} from "axios";
import {AxiosJwt} from "../../utils/Axios-JWT.ts";


const URL_UPDATE_STAND = parameters.URL_UPDATE_STAND

export const UpdateStand = async(id_stand: number, nom_stand: string, solde: number, nom_categorie: string) => {
    try {
        const axiosJWT = AxiosJwt()
        const response = await axiosJWT.post(`${URL_UPDATE_STAND}`, {id_stand, nom_stand, solde, nom_categorie});
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