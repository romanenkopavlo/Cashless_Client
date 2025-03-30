import parameters from "../../../../../public/parameters.json";
import {AxiosError} from "axios";
import {AxiosJwt} from "../../../../utils/Axios-JWT.ts";


const URL_UPDATE_FESTIVALIER = parameters.URL_UPDATE_FESTIVALIER

export const UpdateFestivalier = async(id_festivalier: number, nom: string, prenom: string, username: string, role: string | null) => {
    try {
        const axiosJWT = AxiosJwt()
        const response = await axiosJWT.post(`${URL_UPDATE_FESTIVALIER}`, {id_festivalier, nom, prenom, username, role});
        console.log(response.data)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response && [400, 401, 404, 409, 500, 501].includes(error.response.status)) {
                throw new Error(error.response.data.message);
            }
        }
        return null;
    }
}