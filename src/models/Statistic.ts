export default class Statistic {
    nom_stand: string;
    nombre_credits: number;
    nombre_debits: number;
    somme_debits: number;
    somme_credits: number;
    solde: number;

    constructor(nom_stand: string, solde: number, nombre_credits: number, nombre_debits: number, somme_debits: number, somme_credits: number) {
        this.nom_stand = nom_stand;
        this.solde = solde;
        this.nombre_credits = nombre_credits;
        this.nombre_debits = nombre_debits;
        this.somme_debits = somme_debits;
        this.somme_credits = somme_credits;
    }
}