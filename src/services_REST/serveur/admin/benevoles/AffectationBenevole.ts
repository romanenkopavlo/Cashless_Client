import parameters from "../../../../../public/parameters.json";
import {AxiosError} from "axios";
import {AxiosJwt} from "../../../../utils/Axios-JWT.ts";


const URL_AFFECTATION_BENEVOLE = parameters.URL_AFFECTATION_BENEVOLE

export const AffectationBenevole = async(id_stand: number | undefined, id_benevole: number | undefined, action: string, role: string | null) => {
    try {
        const axiosJWT = AxiosJwt()
        const response = await axiosJWT.post(`${URL_AFFECTATION_BENEVOLE}`, {id_stand, id_benevole, action, role});
        console.log(response.data)
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