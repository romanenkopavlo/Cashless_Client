import parameters from "../../../../../public/parameters.json";
import {AxiosError} from "axios";
import {AxiosJwt} from "../../../../utils/Axios-JWT.ts";


const URL_DELETE_PHONE = parameters.URL_DELETE_PHONE;

export const DeletePhone = async(id_phone: number) => {
    try {
        const axiosJWT = AxiosJwt()
        const response = await axiosJWT.post(`${URL_DELETE_PHONE}`, {id_phone});
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