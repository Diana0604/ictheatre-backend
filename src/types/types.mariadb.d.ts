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