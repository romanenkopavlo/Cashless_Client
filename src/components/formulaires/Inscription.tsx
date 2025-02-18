import './Connexion.css'
import {FaCreditCard, FaLock, FaUser, FaUserTag} from "react-icons/fa"
import {Container, Typography} from "@mui/material";
import {useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {ValidationConnexion} from "./ValidationConnexion.ts";
import { useNavigate } from 'react-router';
import {CreateAccount} from "../../services_REST/serveur/CreateAccount.ts";

interface FormData {
    name: string
    surname: string
    login: string
    password: string
    cardNumber: string
}

export const Inscription = () => {
    const {register, handleSubmit, formState:{errors}} = useForm<FormData>();
    const [errorMessage, setErrorMessage] = useState<string>('');
    const navigate = useNavigate()

    const onSubmit:SubmitHandler<FormData>=data => {
        CreateAccount(data.name, data.surname, data.login, data.password, data.cardNumber)
            .then(response => {
                if (response != null) {
                    console.log("Response after account's creation: " + response)
                    navigate('/login', { state: {successMessage: response.message}});
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
                        <h1>Inscription</h1>
                        <div className="input-box">
                            <input {...register("surname", ValidationConnexion.surname)} type="text" className={errors.surname ? "input-error" : ""} placeholder="Nom" required/>
                            <FaUser className="icon"/>
                            {errors.surname && <p className="error-message">{errors.surname.message}</p>}
                        </div>
                        <div className={`input-box ${errors.surname ? "input-box-error" : ""}`}>
                            <input {...register("name", ValidationConnexion.name)} type="text" className={errors.name ? "input-error" : ""} placeholder="Prénom" required/>
                            <FaUser className="icon"/>
                            {errors.name && <p className="error-message">{errors.name.message}</p>}
                        </div>
                        <div className={`input-box ${errors.name ? "input-box-error" : ""}`}>
                            <input {...register("login", ValidationConnexion.login)} type="text" className={errors.login ? "input-error" : ""} placeholder="Pseudo" required/>
                            <FaUserTag className="icon"/>
                            {errors.login && <p className="error-message">{errors.login.message}</p>}
                        </div>
                        <div className={`input-box ${errors.login ? "input-box-error" : ""}`}>
                            <input {...register("cardNumber", ValidationConnexion.cardNumber)} type="text" className={errors.cardNumber ? "input-error" : ""} placeholder="Numéro de la carte" required={false}/>
                            <FaCreditCard className="icon"/>
                            {errors.cardNumber && <p className="error-message">{errors.cardNumber.message}</p>}
                        </div>
                        <div className={`input-box ${errors.cardNumber ? "input-box-error" : ""}`}>
                            <input {...register("password", ValidationConnexion.password)} type="password" className={errors.password ? "input-error" : ""} placeholder="Mot de passe" required/>
                            <FaLock className="icon"/>
                            {errors.password && <p className="error-message">{errors.password.message}</p>}
                        </div>
                        <button type="submit" className={errors.password ? "button-error" : ""}>Créer un compte</button>
                        {errorMessage && <Container maxWidth="sm" sx={{mt: 3}}>
                            <Typography
                                sx={{fontWeight: 'bold', textAlign: 'center'}}
                                color={'error'}
                            >
                                {errorMessage}
                            </Typography>
                        </Container>}
                        <div className="register-link">
                            <p>Vous avez déja un compte? <a href="/login">Se connecter</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}