import Benevole from "../models/Benevole.ts";
import {GetBenevoles} from "../services_REST/serveur/admin/benevoles/GetBenevoles.ts";

export const updateBenevoles = (setBenevoles: (newBenevoles: Benevole[]) => void) => {
    GetBenevoles()
        .then((data) => {
            if (!data || !Array.isArray(data)) {
                setBenevoles([]);
            } else {
                setBenevoles(data);
            }
        })
        .catch((error) => {
            console.error("Erreur lors de la récupération des bénévoles:", error);
            setBenevoles([]);
        });
}