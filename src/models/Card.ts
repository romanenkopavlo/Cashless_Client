export default class Card {
    numero: number | null = null
    montant: number | null = null

    constructor(numero: number | null, montant: number | null = null) {
        this.numero = numero
        this.montant = montant
    }
}