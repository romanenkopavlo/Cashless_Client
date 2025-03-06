export default class Phone {
    id_phone: number;
    nom_marque: string
    nom_modele: string

    constructor(id_phone: number, nom_marque: string, nom_modele: string) {
        this.id_phone = id_phone
        this.nom_marque = nom_marque
        this.nom_modele = nom_modele
    }
}