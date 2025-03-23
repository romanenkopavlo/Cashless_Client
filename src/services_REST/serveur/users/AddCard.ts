import parameters from "../../../../public/parameters.json";
import {AxiosJwt} from "../../../utils/Axios-JWT.ts";
import {AxiosError} from "axios";

const URL_ADD_CARD = parameters.URL_ADD_CARD

export const AddCard = async(cardNumber: number) => {
    try {
        const axiosJWT = AxiosJwt();
        const response = await axiosJWT.post(`${URL_ADD_CARD}`, {cardNumber});
        console.log(`response.data de requette AddCard ${response.data.message}`)
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