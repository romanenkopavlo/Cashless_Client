export default class User  {
    id: number | null = null
    username: string | null = null
    nom: string | null = null
    prenom: string | null = null
    role: string | null = null


    constructor(id_user: number | null, username: string | null, nom :string | null, prenom: string | null, role: string | null) {
        this.id = id_user
        this.username = username
        this.nom = nom
        this.prenom = prenom
        this.role = role
    }
}
