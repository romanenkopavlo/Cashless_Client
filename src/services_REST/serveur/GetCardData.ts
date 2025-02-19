import parameters from "../../../public/parameters.json";
import Card from "../../models/users/Card.ts";
import {AxiosJwt} from "../../utils/Axios-JWT.ts";
import {AxiosError} from "axios";

const URL_GET_CARD_DATA = parameters.URL_GET_CARD_DATA

export const GetCardData = async(): Promise<Card | null> => {
    try {
        const axiosJWT = AxiosJwt();
        const response = await axiosJWT.get<Card>(`${URL_GET_CARD_DATA}`);
        console.log(`response card:  ${response.data}`)
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