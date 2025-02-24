export default class User {
    id: number
    username: string
    nom: string
    prenom: string
    role: string

    constructor(id_user: number, username: string, nom :string, prenom: string, role: string) {
        this.id = id_user
        this.username = username
        this.nom = nom
        this.prenom = prenom
        this.role = role
    }
}
