import User from "./User.ts";

export default class Benevole extends User {
    ids_stands: string | null = null;
    noms_stands: string | null;
    noms_permissions: string | null;

    constructor(id_user: number, username: string, nom: string, prenom: string, role: string, noms_stands: string | null, noms_permissions: string | null) {
        super(id_user, username, nom, prenom, role);
        this.noms_stands = noms_stands;
        this.noms_permissions = noms_permissions;
    }
}