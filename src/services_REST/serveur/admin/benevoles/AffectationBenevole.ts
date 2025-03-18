import parameters from "../../../../../public/parameters.json";
import {AxiosError} from "axios";
import {AxiosJwt} from "../../../../utils/Axios-JWT.ts";


const URL_AFFECTATION_BENEVOLE = parameters.URL_AFFECTATION_BENEVOLE

export const AffectationBenevole = async(id_stand: number | undefined, id_benevole: number | undefined, action: string) => {
    try {
        const axiosJWT = AxiosJwt()
        const response = await axiosJWT.post(`${URL_AFFECTATION_BENEVOLE}`, {id_stand, id_benevole, action});
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