/**
 * Transform a javascript type name into MariaDB type name
 * @param type type extracted as typeof object instance
 * @returns mariaDB equivalent type
 */
export const javascriptTypeToMariaDBType = (type: string) => {
  switch (type) {
    case 'string': {
      return 'TEXT'
    }
    case 'number': {
      return 'INTEGER'
    }
  }
  throw new Error('unknown type')
}

/**
 * Create a create table command from a given object
 * @param obj any object -> must have constructor
 * @returns string of command
 */
export const createTableCommand = (obj: any) => {
  let createTableCommand = `CREATE TABLE IF NOT EXISTS ${obj.constructor.name} (`
  for (const key in obj) {
    createTableCommand = createTableCommand + `${key} ${javascriptTypeToMariaDBType(typeof (obj[key]))}, `
  }
  createTableCommand = createTableCommand.slice(0, -2)
  createTableCommand = createTableCommand + `);`
  return createTableCommand
}
/**
 * Insert element to table of the same name as its class
 * @param obj obj to be inserted
 * @returns string of command
 */
export const insertElementCommand = (obj: any) => {
  let insertElementCommand = `INSERT INTO ${obj.constructor.name} (`
  //first list all the table titles
  for (const key in obj) {
    insertElementCommand = insertElementCommand + `${key}, `
  }
  insertElementCommand = insertElementCommand.slice(0, -2)
  insertElementCommand = insertElementCommand + ') VALUES ('
  //then specify values
  for (const key in obj) {
    insertElementCommand = insertElementCommand + `'${obj[key]}', `
  }
  insertElementCommand = insertElementCommand.slice(0, -2)
  insertElementCommand = insertElementCommand + ');'
  return insertElementCommand
}