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
    setUnassignedStands : (value: React.SetStateAction<Stand[]>) => void,
    setPermissionsForStand: (value: { id: number; stand_nom: string; permission: string }[]) => void
) => {
    GetStands().then((stands) => {
        if (stands && Array.isArray(stands)) {
            setStands(stands);
            const assigned = stands.filter(s => benevole?.ids_stands?.split(', ').includes(String(s.id_stand)));
            const unassigned = stands.filter(s => !benevole?.ids_stands || !benevole?.ids_stands.split(', ').includes(String(s.id_stand)));

            const permissionsForStand = assigned.map((stand) => {
                if (benevole != null && benevole.ids_stands && benevole.noms_stands && benevole.noms_permissions) {
                    const stand_ids = benevole.ids_stands.split(', ');
                    const stand_noms = benevole.noms_stands.split(', ');
                    const permissions = benevole.noms_permissions.split(', ');

                    const standIndex = stand_ids?.indexOf(String(stand.id_stand));
                    return {
                        id: stand.id_stand,
                        stand_nom: stand_noms[standIndex] || "Inconnu",
                        permission: permissions[standIndex] || "Aucune rôle"
                    };
                }
                return {
                    id: '',
                    stand_nom: '',
                    permission: '',
                }
            });

            setBenevoleStands(assigned);
            setUnassignedStands(unassigned);
            setPermissionsForStand(permissionsForStand);
        } else {
            setStands([]);
            setBenevoleStands([]);
            setUnassignedStands([]);
            setPermissionsForStand([]);
        }
    });
}