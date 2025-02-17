import parameters from "../../../public/parameters.json";
import Card from "../../models/users/Card.ts";
import {AxiosJwt} from "../../utils/Axios-JWT.ts";
import {AxiosError} from "axios";

const URL_ADD_CARD = parameters.URL_ADD_CARD

export const AddCard = async(cardNumber: number): Promise<Card | null> => {
    try {
        const axiosJWT = AxiosJwt();
        const response = await axiosJWT.post<Card>(`${URL_ADD_CARD}`, {cardNumber});
        console.log(`response.data de requette TokenJWT ${response.data.numero}`)
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