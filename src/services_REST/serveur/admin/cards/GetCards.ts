import {AxiosJwt} from "../../../../utils/Axios-JWT.ts";
import parameters from "../../../../../public/parameters.json";
import {AxiosError} from "axios";

const URL_GET_CARDS = parameters.URL_GET_CARDS

export const GetCards = async() => {
    try {
        const axiosJWT = AxiosJwt();
        const response = await axiosJWT.get(`${URL_GET_CARDS}`);
        console.log(`response.data de requette GetCards ${response.data}`)
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