import { Connection, createConnection } from 'mysql';
import config from '../config/config.index';
import { createTableCommand, insertElementCommand } from './mysql.helpers';

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
 * executes SQL queries in MySQL db
 *
 * @param {string} query - provide a valid SQL query
 * in the query
 */
const execute = <T>(query: string): Promise<T> => {
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
 * delete and create emtpy database
 */
export const restartDB = async () => {
  try {
    //delete database
    await execute(`DROP DATABASE ${config.mysqlConfig.database};`)
    //create new database with same name
    await execute(`CREATE DATABASE ${config.mysqlConfig.database};`)
    //set newly created database as database to be used for all queries
    await execute(`use ${config.mysqlConfig.database};`)
  } catch (error) {
    throw error
  }
}

/**
 * Display name of all the tables that are set in our database
 * TODO: will eventually display all content of all tables
 */
export const showAllTables = async () => {
  try {
    console.log(await execute(`SHOW TABLES FROM ${config.mysqlConfig.database};`))
  } catch (error) {
    throw error
  }
}

/**
 * Given the name of a table, return all objects that are in the database
 * @param tableName name of table
 * @returns list of objects obtained from table
 * @throw error if table name does not exist in database
 */
export const getListOfTableEntries = async(tableName: string) => {
  try {
    const tableArray = await execute(`SELECT * from ${tableName};`) as Array<unknown>
    let newArray = []
    for(const element of tableArray) {
      newArray.push(element)
    }
    return newArray
  } catch(error) {
    throw error
  }
}