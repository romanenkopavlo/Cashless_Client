import parameters from "../../../../../public/parameters.json";
import {AxiosError} from "axios";
import {AxiosJwt} from "../../../../utils/Axios-JWT.ts";


const URL_UPDATE_MARQUE = parameters.URL_UPDATE_MARQUE

export const UpdateMarque = async(id_marque: number, nom_marque: string) => {
    try {
        const axiosJWT = AxiosJwt()
        const response = await axiosJWT.post(`${URL_UPDATE_MARQUE}`, {id_marque, nom_marque});
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