/**
 * Basic user
 */
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

/**
 * Actor user can:
 * 1. Pass Laws
 * 2. Change stock ownership
 */
 class ActorUser extends User {
    constructor(username: string, password: string) {
        super(username, password)
        this.isActor = true
    }
}

/**
 * Admin user can:
 * 1. Do everything an actor user can do
 * 2. Reset show -> restart companies, laws... to initial values (basically reseed DB)
 * 3. Modify already passed law
 */
class AdminUser extends User {

    resetShow = () => {
        console.log('show is resetting')
    }

    constructor(username: string, password: string) {
        super(username, password)
        this.isAdmin = true
    }
}
