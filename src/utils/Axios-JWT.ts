import axios from "axios";
import {useAuthenticationJWTStore} from "../store/AuthenticationJWT.ts";
import parameters from "../../public/parameters.json";
import Token from "../models/users/Token.ts";

const URL_SERVER = parameters.URL_SERVER
const URL_AUTH_REFRESH = parameters.URL_REFRESH_TOKEN

export const AxiosJwt = () => {

    const instance = axios.create({
        baseURL: `${URL_SERVER}`,
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    });

    instance.interceptors.request.use(
        (config) => {
            const token = useAuthenticationJWTStore.getState().accessToken?.token
            console.log("Token " + useAuthenticationJWTStore.getState().accessToken)
            console.log(`Token: ${token}`);
            config.headers['Authorization'] = token ? `Bearer ${token}` : '';
            return config
        },
        (error) => {
            return Promise.reject(error)
        }
    )

    instance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            if (error.response && error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    const response = await axios.get(`${URL_SERVER}${URL_AUTH_REFRESH}`,{
                        withCredentials: true
                    })
                    const newAccessToken = response.data.token;

                    useAuthenticationJWTStore.getState().setAccessToken(new Token(newAccessToken));
                    console.log("Response interceptor new access token:", newAccessToken)
                    const token = useAuthenticationJWTStore.getState().accessToken?.token
                    console.log(`Token interceptor : ${token}`);
                    originalRequest.headers['Authorization'] = token ? `Bearer ${token}` : ''
                    return axios(originalRequest);
                } catch (e) {
                    if (axios.isAxiosError(e) && e.response?.status === 504) {
                        console.error("Erreur 504 détectée, redirection...");
                        useAuthenticationJWTStore.getState().setAccessToken(new Token(null));
                        window.location.href = '/login';
                    } else {
                        console.error('Le refresh token a expiré ou autre erreur :', e);
                    }
                }
            }
            return Promise.reject(error);
        }
    );
    return instance;
}