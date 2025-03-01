import parameters from "../../../../../public/parameters.json";
import {AxiosError} from "axios";
import {AxiosJwt} from "../../../../utils/Axios-JWT.ts";


const URL_DELETE_CATEGORY = parameters.URL_DELETE_CATEGORY;

export const DeleteCategory = async(id_categorie: number) => {
    try {
        const axiosJWT = AxiosJwt()
        const response = await axiosJWT.post(`${URL_DELETE_CATEGORY}`, {id_categorie});
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