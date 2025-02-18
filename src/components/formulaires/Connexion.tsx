import './Connexion.css';
import {FaLock, FaUser} from "react-icons/fa";
import {Box, Container, Typography} from "@mui/material";
import {useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {useLocation, useNavigate} from "react-router";
import {ValidationConnexion} from "./ValidationConnexion.ts";
import {Login} from "../../services_REST/serveur/Login.ts";
import {useAuthenticationJWTStore} from "../../store/AuthenticationJWT.ts";

interface FormData {
    login: string
    password: string
}

export const Connexion = () => {
    const {register, handleSubmit, formState:{errors}} = useForm<FormData>();
    const [errorMessage, setErrorMessage] = useState<string>('');
    const navigate = useNavigate()
    const {accessToken, setAccessToken} = useAuthenticationJWTStore()
    const location = useLocation();
    const successMessage = location.state?.successMessage || '';

    console.log("access token est égal à " + accessToken?.token)

    const onSubmit:SubmitHandler<FormData>=data => {
        Login(data.login, data.password)
            .then(token => {
                if (token != null) {
                    console.log("token recu de la part de serveur: " + token)
                    setAccessToken(token)
                    navigate('/profile');
                }
            })
            .catch (error => {
                console.log(error)
                console.log(error.message)
                setErrorMessage(error.message)
            })
        console.log(data)
    }

    return (
        <>
            <div className="wrapper-main">
                <div className="wrapper">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <h1>Login</h1>
                        <div className="input-box">
                            <input {...register("login", ValidationConnexion.login)} type="text" className={errors.login ? "input-error" : ""} placeholder="Pseudo" required/>
                            <FaUser className="icon"/>
                            {errors.login && <p className="error-message">{errors.login.message}</p>}
                        </div>
                        <div className={`input-box ${errors.login ? "input-box-error" : ""}`}>
                            <input {...register("password", ValidationConnexion.password)} type="password" className={errors.password ? "input-error" : ""} placeholder="Mot de passe" required/>
                            <FaLock className="icon"/>
                            {errors.password && <p className="error-message">{errors.password.message}</p>}
                        </div>
                        <button type="submit" className={errors.password ? "button-error" : ""}>Login</button>
                        {errorMessage && <Container maxWidth="sm" sx={{mt: 3}}>
                            <Typography
                                sx={{fontWeight: 'bold', textAlign: 'center'}}
                                color={'error'}
                            >
                                {errorMessage}
                            </Typography>
                        </Container>}
                        <div className="register-link">
                            <p>Vous n'avez pas encore de compte? <a href="/signup">S'inscrire</a></p>
                        </div>
                        {successMessage && (<Container maxWidth="sm" sx={{mt: 5}}>
                            <Box
                                sx = {
                                    {
                                        p: 4,
                                        boxShadow: 16,
                                        borderRadius: 2,
                                        bgcolor: "background.paper"
                                    }
                                }>
                                <Typography
                                    variant="subtitle1"
                                    sx={{fontWeight: 'bold'}}
                                    color='success'
                                    textAlign='center'
                                >
                                    {successMessage}
                                </Typography>
                            </Box>
                        </Container>)}
                    </form>
                </div>
            </div>
        </>
    )
}