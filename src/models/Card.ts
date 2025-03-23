import Transaction from "./Transaction.ts";

export default class Card {
    id_carte: number
    numero: number | null = null
    montant: number | null = null
    login_utilisateur: string | null = null
    transactions: Transaction[] | null = null
    nfc: string | null = null

    constructor(id_carte: number, numero: number | null, montant: number | null, nom_utilisateur: string | null, nfc: string | null) {
        this.id_carte = id_carte
        this.numero = numero
        this.montant = montant
        this.login_utilisateur = nom_utilisateur
        this.nfc = nfc
    }
}