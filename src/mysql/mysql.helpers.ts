/**
 * Transform a javascript type name into mysql type name
 * @param type type extracted as typeof object instance
 * @returns mysql equivalent type
 * WARNING: currently only transforms:
 *   string -> TEXT
 *   number -> DOUBLE
 * anything else will trigger an error
 */
export const javascriptTypeToMySqlType = (type: string) => {
  switch (type) {
    case 'string': {
      return 'TEXT'
    }
    case 'number': {
      return 'DOUBLE'
    }
  }
  throw new Error('unknown type')
}

/**
 * Create a create table command from a given object.
 * Command is created the IF NOT EXISTS flag which means table will not be created if it already exists (otherwise we would see an error)
 * @param obj any object -> must have constructor
 * @returns string of command
 */
export const createTableCommand = (obj: any) => {
  let createTableCommand = `CREATE TABLE IF NOT EXISTS ${obj.constructor.name} (`
  for (const key in obj) {
    createTableCommand = createTableCommand + `${key} ${javascriptTypeToMySqlType(typeof (obj[key]))}, `
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
  //then specify values
  insertElementCommand = insertElementCommand + ') VALUES ('
  for (const key in obj) {
    insertElementCommand = insertElementCommand + `'${obj[key]}', `
  }
  insertElementCommand = insertElementCommand.slice(0, -2)
  insertElementCommand = insertElementCommand + ');'
  return insertElementCommand
}