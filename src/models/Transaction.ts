export default class Transaction {
    id_transaction: number;
    date: string;
    montant_transaction: number;
    login_utilisateur: string;
    login_benevole: string;
    numero_carte: string;
    type: string;
    nom_stand: string;
    modele_terminal: string;
    marque_terminal: string;

    constructor(id_transaction: number, date: string, montant_transaction: number, login_utilisateur: string, login_benevole: string, numero_carte: string, type: string, nom_stand: string, modele_terminal: string, marque_terminal: string) {
        this.id_transaction = id_transaction;
        this.date = date;
        this.montant_transaction = montant_transaction;
        this.login_benevole = login_benevole;
        this.login_utilisateur = login_utilisateur;
        this.numero_carte = numero_carte;
        this.type = type;
        this.nom_stand = nom_stand;
        this.modele_terminal = modele_terminal;
        this.marque_terminal = marque_terminal;
    }
}