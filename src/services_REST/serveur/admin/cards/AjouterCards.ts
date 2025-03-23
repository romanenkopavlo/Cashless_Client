import {AxiosJwt} from "../../../../utils/Axios-JWT.ts";
import parameters from "../../../../../public/parameters.json";
import {AxiosError} from "axios";

const URL_READ_FILE_CARDS = parameters.URL_READ_FILE_CARDS

export const ReadFileCards = async(file : File) => {
    try {
        const axiosJWT = AxiosJwt();
        const formData = new FormData();
        formData.append("file", file);

        const response = await axiosJWT.post(`${URL_READ_FILE_CARDS}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        console.log(`response.data de requette ReadFileCards ${response.data}`)
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