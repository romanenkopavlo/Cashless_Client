import Benevole from "../models/Benevole.ts";
import {GetBenevoles} from "../services_REST/serveur/admin/benevoles/GetBenevoles.ts";
import Stand from "../models/Stand.ts";
import React from "react";

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

export const separerBenevoles = (
    stand : Stand | null,
    setBenevoles: (newBenevoles: Benevole[]) => void,
    setStandBenevoles : (value: React.SetStateAction<Benevole[]>) => void,
    setUnassignedBenevoles : (value: React.SetStateAction<Benevole[]>) => void
) => {
    GetBenevoles().then((benevoles) => {
        if (benevoles && Array.isArray(benevoles)) {
            setBenevoles(benevoles);
            const assigned = benevoles.filter(b => b.ids_stands && b.ids_stands.split(', ').includes(String(stand?.id_stand))).map(b => b);
            const unassigned = benevoles.filter(b => !b.ids_stands || !b.ids_stands.split(', ').includes(String(stand?.id_stand))).map(b => b);
            setStandBenevoles(assigned);
            setUnassignedBenevoles(unassigned);
        } else {
            setBenevoles([]);
            setStandBenevoles([]);
            setUnassignedBenevoles([]);
        }
    });
}