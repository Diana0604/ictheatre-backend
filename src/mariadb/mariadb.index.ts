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
export const insertElement = (obj: any) => {
  let createCommand = createTableCommand(obj)

  execute(createCommand).then(() => {

    let insertCommand = insertElementCommand(obj)

    execute(insertCommand).then(() => {
      console.log('element inserted')
    }, () => {
      throw new Error('could not inser element')
    })

  }, () => {
    throw new Error('could not create table')
  })
}