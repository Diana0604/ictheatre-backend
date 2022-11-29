import { IConfig } from "../types/types.config"

const config: IConfig = {
    mysqlConfig: {
        connectionLimit: 5,
        user: "user", //default is sa
        password: "mypassword",
        host: "127.0.0.1", // for local machine
        database: "ictheatre", // name of database
	//port: 3306,
        options: {
            encrypt: true
        }
    },
    seedDB: true, //set to false if you don't want to seed the dab
    showConfig: {
        lengthInSeconds: 300, //length of show in seconds
        updateIntervalInSeconds: 60 //how often do we update companies prices
    }
}

export default config
