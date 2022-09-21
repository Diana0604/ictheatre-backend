import { IConfig } from "../types/types.config"

const config: IConfig = {
    mariadbConfig: {
        connectionLimit: 5,
        user: "user", //default is sa
        password: "mypassword",
        server: "localhost", // for local machine
        database: "ictheatre", // name of database
        options: {
            encrypt: true
        }
    }
}

export default config