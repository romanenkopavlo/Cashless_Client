import parameters from "../../../../../public/parameters.json";
import {AxiosError} from "axios";
import {AxiosJwt} from "../../../../utils/Axios-JWT.ts";


const URL_CREATE_BENEVOLE = parameters.URL_CREATE_BENEVOLE

export const CreateBenevole = async(nom: string, prenom: string, nom_stand: string, username: string, password: string) => {
    try {
        const axiosJWT = AxiosJwt()
        const response = await axiosJWT.post(`${URL_CREATE_BENEVOLE}`, {nom, prenom, nom_stand, username, password});
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