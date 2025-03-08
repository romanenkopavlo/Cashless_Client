import User from "../models/User.ts";
import {GetFestivaliers} from "../services_REST/serveur/admin/festivaliers/GetFestivaliers.ts";

export const updateFestivaliers = (setFestivaliers: (newFestivaliers: User[]) => void) => {
    GetFestivaliers()
        .then((data) => {
            if (!data || !Array.isArray(data)) {
                setFestivaliers([]);
            } else {
                setFestivaliers(data);
            }
        })
        .catch((error) => {
            console.error("Erreur lors de la récupération des festivaliers:", error);
            setFestivaliers([]);
        });
}