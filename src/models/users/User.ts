export default class User  {
    id: number | null = null
    username: string | null = null
    role: string | null = null
    balance: number | null = null

    constructor(id_user: number | null, username: string | null, role: string | null, balance: number | null = null) {
        this.id = id_user
        this.username = username
        this.role = role
        this.balance = balance
    }
}
