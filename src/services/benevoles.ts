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
    setUnassignedBenevoles : (value: React.SetStateAction<Benevole[]>) => void,
    setPermissionsForStand: (value: { id: number; login: string; stand_nom: string; permission: string }[]) => void
) => {
    GetBenevoles().then((benevoles) => {
        if (benevoles && Array.isArray(benevoles)) {
            setBenevoles(benevoles);
            const assigned = benevoles.filter(b => b.ids_stands && b.ids_stands.split(', ').includes(String(stand?.id_stand))).map(b => b);
            const unassigned = benevoles.filter(b => !b.ids_stands || !b.ids_stands.split(', ').includes(String(stand?.id_stand))).map(b => b);

            const permissionsForStand = assigned.map((benevole) => {
                const stand_ids = benevole.ids_stands.split(", ");
                const stand_noms = benevole.noms_stands.split(", ");
                const permissions = benevole.noms_permissions.split(", ");

                const index = stand_ids.indexOf(String(stand?.id_stand));

                return {
                    id: benevole.id,
                    login: benevole.login,
                    stand_nom: stand_noms[index] || "Inconnu",
                    permission: permissions[index] || "Aucune rôle"
                };
            });

            setStandBenevoles(assigned);
            setUnassignedBenevoles(unassigned);
            setPermissionsForStand(permissionsForStand);
        } else {
            setBenevoles([]);
            setStandBenevoles([]);
            setUnassignedBenevoles([]);
            setPermissionsForStand([]);
        }
    });
}