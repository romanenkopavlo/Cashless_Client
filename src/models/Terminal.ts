import Phone from "./Phone.ts";

export default class Terminal {
    id_terminal: number;
    id_android: string;
    stand_nom: string;
    phone: Phone | null;

    constructor(id_terminal: number, id_android: string, stand_nom: string, phone: Phone | null) {
        this.id_terminal = id_terminal;
        this.id_android = id_android;
        this.stand_nom = stand_nom;
        this.phone = phone;
    }
}