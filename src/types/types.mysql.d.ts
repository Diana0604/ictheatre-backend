/**
 * Interface for db config:
 * connectionLimit -> # of tries before assuming failure to connect
 * user -> user from db
 * password -> password for given user, put '' if no password
 * server -> server to connect to (for us it will be localhost from 'mother' computer or ip in local network)
 * database -> name of database that we will work on
 * options -> set to always encrypt as recommended in documentation
 */
export interface IDatabaseConfig {
    connectionLimit: number,
    user: string,
    password: string,
    server: string,
    database: string,
    options: {
        encrypt: true
    }
}

/**
 * Properties to be passed in company constructor
 */
export interface ICompanyProperties {
    name: string,
    description: string,
    initPricePerShare: number, //price at init of show
    finalPricePerShare: number //price at end of show
}

/**
 * Timer of show development
 */
export interface IShowStatus {
    timeSinceStartup: number
    isPlaying: boolean
}
