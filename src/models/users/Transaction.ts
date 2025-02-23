export default class Transaction {
    idtransaction: number;
    date: string;
    montant_transaction: number;
    type: string;
    nom_stand: string;

    constructor(idtransaction: number, date: string, montant_transaction: number, type: string, nom_stand: string) {
        this.idtransaction = idtransaction;
        this.date = date;
        this.montant_transaction = montant_transaction;
        this.type = type;
        this.nom_stand = nom_stand;
    }
}