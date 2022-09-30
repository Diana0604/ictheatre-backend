import { Connection, createConnection } from 'mysql';
import config from '../config/config.index';
import { createTableCommand, insertElementCommand } from './mariadb.helpers';

let connection: Connection;

/**
 * generates pool connection to be used throughout the app
 */
export const init = () => {
  try {
    connection = createConnection(config.mariadbConfig);
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
 * Disconnect from the database
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
 * @param obj object to be inserted
 */
export const insertElement = async (obj: any) => {
  //1st make sure table exists
  const createCommand = createTableCommand(obj)

  try {
    await execute(createCommand)
  } catch (error) {
    throw error
  }
  //2nd insert element
  const insertCommand = insertElementCommand(obj)

  try {
    await execute(insertCommand)
  } catch (error) {
    throw error
  }
}

/**
 * delete and rescreate database - to be executed at beginning of show
 */
export const restartDB = async () => {
  try {
    await execute(`DROP DATABASE ${config.mariadbConfig.database}`)
  } catch (error) {
    throw error
  }

  try {
    await execute(`CREATE DATABASE ${config.mariadbConfig.database}`)
  } catch (error) {
    throw error
  }
  try {
    await execute(`use ${config.mariadbConfig.database};`)
  } catch (error) {
    throw error
  }
}

export const showAllTables = async () => {
  try {
    console.log(await execute(`SHOW TABLES FROM ${config.mariadbConfig.database};`))
  } catch (error) {
    throw error
  }
}

export const showAllDB = async () => {
  try {
    console.log(await execute(`SHOW DATABASES;`))
  } catch (error) {
    throw error
  }
}