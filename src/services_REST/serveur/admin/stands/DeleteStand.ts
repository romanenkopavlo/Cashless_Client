import parameters from "../../../../../public/parameters.json";
import {AxiosError} from "axios";
import {AxiosJwt} from "../../../../utils/Axios-JWT.ts";


const URL_DELETE_STAND = parameters.URL_DELETE_STAND;

export const DeleteStand = async(id_stand: number) => {
    try {
        const axiosJWT = AxiosJwt()
        const response = await axiosJWT.post(`${URL_DELETE_STAND}`, {id_stand});
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