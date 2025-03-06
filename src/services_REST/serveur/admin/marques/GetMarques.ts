import {AxiosJwt} from "../../../../utils/Axios-JWT.ts";
import parameters from "../../../../../public/parameters.json";
import {AxiosError} from "axios";

const URL_GET_MARQUES = parameters.URL_GET_MARQUES

export const GetMarques = async() => {
    try {
        const axiosJWT = AxiosJwt();
        const response = await axiosJWT.get(`${URL_GET_MARQUES}`);
        console.log(`response.data de requette GetMarques ${response.data}`)
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