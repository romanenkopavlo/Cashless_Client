import Transaction from "./Transaction.ts";

export default class Card {
    id_carte: number
    numero: number | null = null
    montant: number | null = null
    login_utilisateur: string | null = null
    transactions: Transaction[] | null = null
    nfc: string | null = null
    is_active: boolean

    constructor(id_carte: number, numero: number | null, montant: number | null, nom_utilisateur: string | null, nfc: string | null, is_active: boolean) {
        this.id_carte = id_carte
        this.numero = numero
        this.montant = montant
        this.login_utilisateur = nom_utilisateur
        this.nfc = nfc
        this.is_active = is_active
    }
}