export const ValidationCard  = {
    cardNumber: {
        required: "Numéro de la carte obligatoire",
        pattern: {
            value: /^[0-9]{16}$/,
            message:
                "Le numéro de la carte doit comporter 16 caracteres."
        },
    },
}