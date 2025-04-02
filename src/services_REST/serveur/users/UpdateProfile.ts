import parameters from "../../../../public/parameters.json";
import {AxiosError} from "axios";
import {AxiosJwt} from "../../../utils/Axios-JWT.ts";


const URL_UPDATE_PROFILE = parameters.URL_UPDATE_PROFILE

export const UpdateProfile = async(id: number, nom: string, prenom: string, login: string, passwordCurrent: string, passwordNew: string) => {
    try {
        const axiosJWT = AxiosJwt();
        const response = await axiosJWT.post(`${URL_UPDATE_PROFILE}`, {id, nom, prenom, login, passwordCurrent, passwordNew});
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