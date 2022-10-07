import { IConfig } from "../types/types.config"

const config: IConfig = {
    mysqlConfig: {
        connectionLimit: 5,
        user: "user", //default is sa
        password: "mypassword",
        host: "localhost", // for local machine
        database: "ictheatre", // name of database
        options: {
            encrypt: true
        }
    },
    seedDB: true, //set to false if you don't want to seed the dab
    showConfig: {
        lengthInSeconds: 3600 //length of show in seconds
    }
}

export default config
