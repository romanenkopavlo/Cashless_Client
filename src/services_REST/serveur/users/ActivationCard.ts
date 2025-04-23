import parameters from "../../../../public/parameters.json";
import {AxiosError} from "axios";
import {AxiosJwt} from "../../../utils/Axios-JWT.ts";


const URL_ACTIVATION_CARD = parameters.URL_ACTIVATION_CARD

export const ActivationCard = async(cardNumber: number | null, action: boolean) => {
    try {
        const axiosJWT = AxiosJwt();
        const response = await axiosJWT.post(`${URL_ACTIVATION_CARD}`, {cardNumber, action});
        console.log(response.data);
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