export const ValidationConnexion = {
    password: {
        required: "Password obligatoire",
        pattern: {
            value: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            message:
                "Le password doit comporter au moins 8 caractères, inclure une lettre majuscule, un chiffre et un symbole.",
        },
    },
    login: {
        required: "Login obligatoire",
        pattern:
            {
                value: /^[a-zA-Z0-9._-]{3,20}$/,
                message:
                    "Le Login doit  contenir entre 3 et 20 caractères, ne peut inclure que des lettres, chiffres, points, tirets bas ou tirets.",
            },
    },
}