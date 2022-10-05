//config
import config from "../../config/config.index";
//database
import { Connection, createConnection } from "mysql";

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