export default class StatisticTotal {
    debits: number;
    credits: number;
    somme_debits: number;
    somme_credits: number;
    somme_ann_cre: number;
    somme_ann_deb: number;
    annulations_debits: number;
    annulations_credits: number;
    somme_debits_sans_ann: number;
    somme_credits_sans_ann: number;
    solde: number;
    balance_periode: number;

    constructor(
        credits: number, somme_credits: number,
        annulations_credits: number, debits: number,
        somme_debits: number, annulations_debits: number,
        solde: number, somme_ann_cre: number,
        somme_ann_deb: number, somme_debits_sans_ann: number,
        somme_credits_sans_ann: number, balance_periode: number
    ) {
        this.solde = solde;
        this.debits = debits;
        this.credits = credits;
        this.somme_debits = somme_debits;
        this.somme_credits = somme_credits;
        this.somme_ann_cre = somme_ann_cre;
        this.somme_ann_deb = somme_ann_deb;
        this.annulations_debits = annulations_debits;
        this.annulations_credits = annulations_credits;
        this.somme_debits_sans_ann = somme_debits_sans_ann;
        this.somme_credits_sans_ann = somme_credits_sans_ann;
        this.balance_periode = balance_periode
    }
}