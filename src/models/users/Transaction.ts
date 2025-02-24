export default class Transaction {
    id_transaction: number;
    date: string;
    montant_transaction: number;
    type: string;
    nom_stand: string;

    constructor(idtransaction: number, date: string, montant_transaction: number, type: string, nom_stand: string) {
        this.id_transaction = idtransaction;
        this.date = date;
        this.montant_transaction = montant_transaction;
        this.type = type;
        this.nom_stand = nom_stand;
    }
}