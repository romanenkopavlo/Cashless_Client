import {Box, Button, Typography, TextField, Grid2, styled, Container} from "@mui/material";
import { useState } from "react";
import { FaCreditCard } from "react-icons/fa";
import {SubmitHandler, useForm} from "react-hook-form";
import {AddCard} from "../../services_REST/serveur/AddCard.ts";
import {ValidationCard} from "./ValidationCard.ts";
import {useCardStore} from "../../store/useCardStore.ts";

interface FormData {
    cardNumber: number
}

export const AddCardForm = () => {
    const {register, handleSubmit, formState:{errors}} = useForm<FormData>();
    const [errorMessage, setErrorMessage] = useState<string>('');
    const {setCard} = useCardStore()

    const onSubmit:SubmitHandler<FormData>=data => {
        AddCard(data.cardNumber)
            .then(card => {
                if (card != null) {
                    setCard(card)
                    console.log(card)
                    console.log("Balance: " + card.montant)
                    console.log("Number: " + card.numero)
                }
            })
            .catch (error => {
                console.log(error)
                console.log(error.message)
                setErrorMessage(error.message)
            })
        console.log(data)
    }

    const TextFieldCustom = styled(TextField)({
        '& label.Mui-focused': {
            color: '#2C2C2C',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: '#7f5656',
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: '#7f5656',
            },
            '&:hover fieldset': {
                borderColor: '#7f5656',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#7f5656',
            },
        },
    });

    return (
        <Box
            sx={{
                p: 4,
                boxShadow: 16,
                borderRadius: 2,
                bgcolor: "background.paper",
                mt: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: "center", mb: 2 }}>
                Ajouter une carte
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)}>

                <Grid2 container spacing={2} sx={{ mb: 2 }}>
                        <TextFieldCustom
                            {...register("cardNumber", ValidationCard.cardNumber)}
                            label="Numéro de la carte"
                            variant="outlined"
                            color="secondary"
                            fullWidth
                            required
                        />
                </Grid2>

                {errors.cardNumber && <Container maxWidth="sm" sx={{mt: 2, mb: 2}}>
                    <Typography
                        sx={{fontWeight: 'bold', textAlign: 'center'}}
                        color={'error'}
                    >
                        {errors.cardNumber.message}
                    </Typography>
                </Container>}

                {errorMessage && <Container maxWidth="sm" sx={{mt: 2, mb: 2}}>
                    <Typography
                        sx={{fontWeight: 'bold', textAlign: 'center'}}
                        color={'error'}
                    >
                        {errorMessage}
                    </Typography>
                </Container>}


                <Button
                    type="submit"
                    variant="contained"
                    className="cta-button"
                    fullWidth
                    startIcon={<FaCreditCard />}
                >
                    Ajouter la carte
                </Button>
            </form>
        </Box>
    );
};