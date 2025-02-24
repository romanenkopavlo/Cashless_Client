import {AxiosJwt} from "../../../utils/Axios-JWT.ts";
import parameters from "../../../../public/parameters.json";
import {AxiosError} from "axios";

const URL_GET_TRANSACTIONS = parameters.URL_GET_TRANSACTIONS

export const GetTransactions = async(cardNumber: number | null | undefined) => {
    try {
        const axiosJWT = AxiosJwt();
        const response = await axiosJWT.post(`${URL_GET_TRANSACTIONS}`, {cardNumber});
        console.log(`response.data de requette GetTransactions ${response.data}`)
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