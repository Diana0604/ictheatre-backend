//config
import config from "../../config/config.index";
//database
import { Connection, createConnection } from "mysql";
import { createTableCommand, insertElementCommand } from './mysql.helpers'

let connection: Connection;

/**
 * generates database connection to be used throughout the app, using configuration in src/config/config.index.ts
 */
export const init = () => {
    try {
        connection = createConnection(config.mysqlConfig);
        console.debug('MySql created connection succesfully');
        return true
    } catch (error) {
        console.error('[mysql.connector][init][Error]: ', error);
        throw new Error('failed to initialize connection');
    }
};

/**
 * Disconnect from MySql
 */
export const disconnect = () => {
    try {
        connection.end();
    } catch (error) {
        console.log('MySQL error when trying to disconnect')
        console.log(error)
    }
}

/**
 * executes SQL queries in MySQL db
 *
 * @param {string} query - provide a valid SQL query
 * in the query
 */
export const execute = <T>(query: string): Promise<T> => {
    try {
        return new Promise<T>((resolve, reject) => {
            connection.query(query, (error, results, _fields) => {
                if (error) reject(error);
                else {
                    resolve(results)
                }
            })
        })
    } catch (error) {
        console.error('[mysql.connector][execute][Error]: ', error);
        throw new Error('failed to execute MySQL query');
    }
}

/**
 * Insert object to database into type of it's class name
 * We transform:
 * 1. Class Name -> Table Name
 * 2. Class Properties -> Table Columns
 * 3. Add given object to class
 * WARNING: currently only accepting strings and numbers (which are set as double)
 * @param obj object to be inserted
 */
export const insertElement = async (obj: any) => {
    //create table if not exists
    const createCommand = createTableCommand(obj)
    try {
        await execute(createCommand)
    } catch (error) {
        throw error
    }

    //insert element
    const insertCommand = insertElementCommand(obj)
    try {
        await execute(insertCommand)
    } catch (error) {
        throw error
    }
}

/**
 * Delete database and create new empty database with same name
 */
export const cleanDB = async () => {
    //delete database
    await execute(`DROP DATABASE IF EXISTS ${config.mysqlConfig.database};`)
    //create new database with same name
    await execute(`CREATE DATABASE ${config.mysqlConfig.database};`)
    //set newly created database as database to be used for all queries
    await execute(`use ${config.mysqlConfig.database};`)
}
