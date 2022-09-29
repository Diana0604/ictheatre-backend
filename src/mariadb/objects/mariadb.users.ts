//basic user
class User {
    username: string
    password: string
    isAdmin: boolean
    isActor: boolean

    constructor(username: string, password: string) {
        this.username = username
        this.password = password
        this.isAdmin = false
        this.isActor = false
    }
}

class AdminUser extends User {

    resetShow = () => {
        console.log('show is resetting')
    }

    constructor(username: string, password: string) {
        super(username, password)
        this.isAdmin = true
    }
}

class ActorUser extends User {
    constructor(username: string, password: string) {
        super(username, password)
        this.isActor = true
    }
}