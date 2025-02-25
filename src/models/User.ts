export default class User {
    id: number
    login: string
    nom: string
    prenom: string
    role: string

    constructor(id_user: number, username: string, nom :string, prenom: string, role: string) {
        this.id = id_user
        this.login = username
        this.nom = nom
        this.prenom = prenom
        this.role = role
    }
}
