export default class Stand {
    id_stand: number;
    nom_stand: string;
    solde: number;
    nom_categorie: string;

    constructor(id_stand: number, nom_stand: string, solde: number, categorie: string) {
        this.id_stand = id_stand;
        this.nom_stand = nom_stand;
        this.solde = solde;
        this.nom_categorie = categorie;
    }
}