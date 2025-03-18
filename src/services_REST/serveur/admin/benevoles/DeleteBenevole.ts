import parameters from "../../../../../public/parameters.json";
import {AxiosError} from "axios";
import {AxiosJwt} from "../../../../utils/Axios-JWT.ts";


const URL_DELETE_BENEVOLE = parameters.URL_DELETE_BENEVOLE;

export const DeleteBenevole = async(id_benevole: number) => {
    try {
        const axiosJWT = AxiosJwt()
        const response = await axiosJWT.post(`${URL_DELETE_BENEVOLE}`, {id_benevole});
        console.log(response.data)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response && (error.response.status === 409 || error.response.status === 501)) {
                throw new Error(error.response.data.message);
            }
        }
        return null;
    }
}