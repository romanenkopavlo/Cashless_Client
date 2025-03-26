export default class Stand {
    id_stand: number;
    nom_stand: string;
    nom_categorie: string;
    nombre_benevoles: number;
    nombre_terminaux: number;

    constructor(id_stand: number, nom_stand: string, categorie: string, nombre_benevoles: number, nombre_terminaux: number) {
        this.id_stand = id_stand;
        this.nom_stand = nom_stand;
        this.nom_categorie = categorie;
        this.nombre_benevoles = nombre_benevoles;
        this.nombre_terminaux = nombre_terminaux;
    }
}