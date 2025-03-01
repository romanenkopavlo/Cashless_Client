import User from "./User.ts";

export default class Benevole extends User {
    nom_stand: string;

    constructor(id_user: number, username: string, nom: string, prenom: string, role: string, nom_stand: string) {
        super(id_user, username, nom, prenom, role);
        this.nom_stand = nom_stand;
    }
}