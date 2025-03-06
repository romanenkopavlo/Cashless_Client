import parameters from "../../../../../public/parameters.json";
import {AxiosError} from "axios";
import {AxiosJwt} from "../../../../utils/Axios-JWT.ts";


const URL_ADMIN_REFUND_TRANSACTION = parameters.URL_ADMIN_REFUND_TRANSACTION;

export const RembourserTransaction = async(id_transaction: number) => {
    try {
        const axiosJWT = AxiosJwt()
        const response = await axiosJWT.post(`${URL_ADMIN_REFUND_TRANSACTION}`, {id_transaction});
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