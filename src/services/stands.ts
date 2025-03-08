import Stand from "../models/Stand.ts";
import {GetStands} from "../services_REST/serveur/admin/stands/GetStands.ts";

export const updateStands = (setStands: (newStands: Stand[]) => void) => {
    GetStands()
        .then((data) => {
            if (!data || !Array.isArray(data)) {
                setStands([]);
            } else {
                setStands(data);
            }
        })
        .catch((error) => {
            console.error("Erreur lors de la récupération des stands:", error);
            setStands([]);
        });
}