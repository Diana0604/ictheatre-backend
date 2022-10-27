//config
import config from "../config/config.index"
//database
import { Connection, createConnection } from "mysql"
import { createDatabaseCommand, createTableCommand, dropDatabaseCommand, dropTableCommand, insertElementCommand, selectTableExistsCommand, showEntriesFromTableCommand, showTablesFromDatabaseCommand, updateElementCommand, useDatabaseCommand } from './mysql.helpers'
let connection: Connection

/**
 * generates database connection to be used throughout the app, using configuration in src/config/config.index.ts
 */
export const init = () => {
    try {
        connection = createConnection(config.mysqlConfig)
        console.debug('MySql created connection succesfully')
        return true
    } catch (error) {
        console.error('[mysql.connector][init][Error]: ', error)
        throw new Error('failed to initialize connection')
    }
}

/**
 * Disconnect from MySql
 */
export const disconnect = () => {
    try {
        connection.end()
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
const execute = <T>(query: string): Promise<T> => {
    try {
        return new Promise<T>((resolve, reject) => {
            connection.query(query, (error, results, _fields) => {
                if (error) reject(error)
                else {
                    resolve(results)
                }
            })
        })
    } catch (error) {
        console.error('[mysql.connector][execute][Error]: ', error)
        throw new Error('failed to execute MySQL query')
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
        console.log(`error creating table: ${obj}`)
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
 *  update element from database using object's properties
 * @param obj
 */
export const updateElement = async (obj: any) => {
    const updateCommand = updateElementCommand(obj)
    try {
        await execute(updateCommand)
    } catch (error) {
        console.log(`error updating object with id: ${obj.id}`)
        throw error
    }
}
/**
 * Delete database and create new empty database with same name
 */
export const cleanDB = async () => {
    //delete database
    const dropDatabase = dropDatabaseCommand(config.mysqlConfig.database)
    await execute(dropDatabase)
    //create new database with same name
    const createDatabase = createDatabaseCommand(config.mysqlConfig.database)
    await execute(createDatabase)
    //set newly created database as database to be used for all queries
    const useDatabase = useDatabaseCommand(config.mysqlConfig.database)
    await execute(useDatabase)
}

/**
 * get all tables that are currently stored in the database
 * @returns Array of tables
 */
export const getAllTablesFromDB = async () => {
    const showTables = showTablesFromDatabaseCommand(config.mysqlConfig.database)
    return await execute(showTables) as Array<unknown> as Array<{ Tables_in_ictheatre: string }>
}

/**
 * Given the name of a table, return all objects that are in the database
 * @param tableName name of table
 * @returns list of objects obtained from table
 * @throw error if table name does not exist in database
 */
export const getListOfTableEntries = async (tableName: string) => {
    try {
        const getListOfTables = showEntriesFromTableCommand(tableName)
        const tableArray = await execute(getListOfTables) as Array<unknown> as Array<any>
        let newArray = []
        for (const element of tableArray) {
            newArray.push(element)
        }
        return newArray
    } catch (error) {
        throw error
    }
}

/**
 * Get first element of given table
 * @param tableName name of table that we want first element of
 * @returns first element of array as arrayRow
 */
export const getFirstTableElement = async (tableName: string) => {
    //if table does not exists -> return null
    try {
        /**
         * select table exists returns an array with one object similar to:
         * { EXISTS ( SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_TYPE LIKE 'BASE TABLE' AND TABLE_NAME = 'Company') : 0 }
         * { EXISTS ( SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_TYPE LIKE 'BASE TABLE' AND TABLE_NAME = 'Company') : 1 }
         * For this reason we iterate on it through keys rather than write the whole key as it will only be one key which will be true or false
         */
        let selectTableExists = selectTableExistsCommand(tableName)
        const tableExists = await execute(selectTableExists) as Array<any>
        for (const key in tableExists[0]) if (!tableExists[0][key]) {
            console.log(`table ${tableName} does not exists in our database`)
            return null
        }
    } catch (error) {
        console.log(`error checking table exists from ${tableName}`)
        throw error
    }
    //if table exists -> return element
    try {
        const showEntriesFromTable = showEntriesFromTableCommand(tableName)
        const tableArray = await execute(showEntriesFromTable) as Array<unknown>
        return tableArray[0]
    } catch (error) {
        console.log(`error getting element from ${tableName}`)
        throw error
    }
}

/**
 *Delete table from database
 */
export const deleteTableDB = async (tableName: string) => {
    try {
        const dropTable = dropTableCommand(tableName)
        await execute(dropTable)
    } catch (error) {
        console.log(`error deleting table: ${tableName}`)
        throw error
    }
}
