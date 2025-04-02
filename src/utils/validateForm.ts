import { ValidationConnexion } from "../components/formulaires/ValidationConnexion.ts";

export const validateForm = (formData: { nom: string; prenom: string; nom_stand?: string, login: string; }, isEditing: boolean, password: string, passwordNew: string | null): { [key: string]: string | null } => {
    const newErrors: { [key: string]: string | null } = {};

    if (!formData.nom.trim()) {
        newErrors.nom = ValidationConnexion.surname.required;
    } else if (!ValidationConnexion.surname.pattern.value.test(formData.nom)) {
        newErrors.nom = ValidationConnexion.surname.pattern.message;
    }

    if (!formData.prenom.trim()) {
        newErrors.prenom = ValidationConnexion.name.required;
    } else if (!ValidationConnexion.name.pattern.value.test(formData.prenom)) {
        newErrors.prenom = ValidationConnexion.name.pattern.message;
    }

    if (!formData.login.trim()) {
        newErrors.username = ValidationConnexion.login.required;
    } else if (!ValidationConnexion.login.pattern.value.test(formData.login)) {
        newErrors.username = ValidationConnexion.login.pattern.message;
    }

    if (!isEditing) {
        if (!password.trim()) {
            newErrors.password = ValidationConnexion.password.required;
        } else if (!ValidationConnexion.password.pattern.value.test(password)) {
            newErrors.password = ValidationConnexion.password.pattern.message;
        }

        if (passwordNew !== null) {
            if (!passwordNew.trim()) {
                newErrors.passwordNew = ValidationConnexion.password.required;
            } else if (!ValidationConnexion.password.pattern.value.test(passwordNew)) {
                newErrors.passwordNew = ValidationConnexion.password.pattern.message;
            }
        }
    }

    return newErrors;
};