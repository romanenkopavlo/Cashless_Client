import Stand from "../models/Stand.ts";
import {GetStands} from "../services_REST/serveur/admin/stands/GetStands.ts";
import Benevole from "../models/Benevole.ts";
import React from "react";

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

export const separerStands = (
    benevole : Benevole | undefined,
    setStands: (newStands: Stand[]) => void,
    setBenevoleStands : (value: React.SetStateAction<Stand[]>) => void,
    setUnassignedStands : (value: React.SetStateAction<Stand[]>) => void
) => {
    GetStands().then((stands) => {
        if (stands && Array.isArray(stands)) {
            setStands(stands);
            const assigned = stands.filter(s => benevole?.ids_stands?.split(', ').includes(String(s.id_stand)));
            const unassigned = stands.filter(s => !benevole?.ids_stands || !benevole?.ids_stands.split(', ').includes(String(s.id_stand)));
            setBenevoleStands(assigned);
            setUnassignedStands(unassigned);
        } else {
            setStands([]);
            setBenevoleStands([]);
            setUnassignedStands([]);
        }
    });
}