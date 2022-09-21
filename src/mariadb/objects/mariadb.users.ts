//basic user
class User {
    username: string
    password: string
    isAdmin: boolean
    isActor: boolean

    constructor() {
        this.username = ""
        this.password = ""
        this.isAdmin = false
        this.isActor = false
    }
}

class AdminUser extends User {
    constructor() {
        super()
        this.isAdmin = true
    }
}

class ActorUser extends User {
    constructor() {
        super()
        this.isActor = true
    }
}