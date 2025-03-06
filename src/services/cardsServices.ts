import Card from "../models/Card.ts";
import {GetCards} from "../services_REST/serveur/admin/cards/GetCards.ts";

export const updateCards = (setCards: (newCards: Card[]) => void) => {
    GetCards()
        .then((data) => {
            if (!data || !Array.isArray(data)) {
                setCards([]);
            } else {
                setCards(data);
            }
        })
        .catch((error) => {
            console.error("Erreur lors de la récupération des cartes:", error);
            setCards([]);
        });
}