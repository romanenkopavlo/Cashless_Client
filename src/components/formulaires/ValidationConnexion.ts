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
    surname: {
        required: "Nom obligatoire",
        pattern: {
            value: /^[A-Za-zÀ-ÖØ-öø-ÿ\s-]{1,45}$/,
            message: "Le Nom ne peut contenir que des lettres et des tirets (max 45 caractères).",
        },
    },
    name: {
        required: "Prénom obligatoire",
        pattern: {
            value: /^[A-Za-zÀ-ÖØ-öø-ÿ\s-]{1,45}$/,
            message: "Le Prénom ne peut contenir que des lettres et des tirets (max 45 caractères).",
        },
    },
    cardNumber: {
        pattern: {
            value: /^\d{16}$/,
            message: "Le Numéro de la carte doit contenir exactement 16 chiffres.",
        },
    },
}