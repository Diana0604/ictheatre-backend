/**
 * Transform a javascript type name into mysql type name
 * @param type type extracted as typeof object instance
 * @returns mysql equivalent type
 * WARNING: currently only transforms:
 *   string -> TEXT
 *   number -> DOUBLE
 *   boolean -> BOOLEAN
 * anything else will trigger an error
 */
const javascriptTypeToMySqlType = (type: string) => {
  console.log(type)
  switch (type) {
    case 'string': {
      return 'TEXT'
    }
    case 'number': {
      return 'DOUBLE'
    }
    case 'boolean': {
      return 'BOOLEAN'
    }
  }
  throw new Error('unknown type')
}

/**
 * Check if javascript type can be translated to mysql type
 * @param type
 * @returns true or false
 */
export const canBecomeMysqlType = (type: string) => {
  if (type != 'string' && type != 'number' && type != 'boolean') return false
  return true
}

/**
 * Given a javascript element, transform to sql element
 * IF string || number -> only needs to add '' surrounding it
 * IF boolean -> needs to be transformed to mayus TRUE / FALSE
 * @param element to be transformed
 * @returns string with element transformed
 * @throws error if element given is of type that cannot be transformed
 */
const javascriptValueToMySqlValue = (element: any) => {
  switch (typeof element) {
    case 'string': {
      return `'${element}'`
    }
    case 'number': {
      return `'${element}'`
    }
    case 'boolean': {
      return element ? `TRUE` : `FALSE`
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
    if (canBecomeMysqlType(typeof (obj[key])))
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
    if(canBecomeMysqlType(typeof obj[key] ))
      insertElementCommand = insertElementCommand + `${key}, `
  }
  insertElementCommand = insertElementCommand.slice(0, -2)
  //then specify values
  insertElementCommand = insertElementCommand + ') VALUES ('
  for (const key in obj) {
    if(canBecomeMysqlType(typeof obj[key] ))
    insertElementCommand = insertElementCommand + `${javascriptValueToMySqlValue(obj[key])}, `
  }
  insertElementCommand = insertElementCommand.slice(0, -2)
  insertElementCommand = insertElementCommand + ');'
  return insertElementCommand
}

/**
 * Update an element
 * @param obj -> object linked to table that we want to update
 * @returns
 */
export const updateElementCommand = (obj: any) => {

  let updateElementCommand = `UPDATE ${obj.constructor.name} set `
  for (const key in obj) {
    if(canBecomeMysqlType(typeof obj[key]))
      updateElementCommand = updateElementCommand + `${key}=${javascriptValueToMySqlValue(obj[key])}, `
  }
  updateElementCommand = updateElementCommand.slice(0, -2)

  updateElementCommand = updateElementCommand + `where id=${obj.id}`
  return updateElementCommand
}

/**
 * Returns string for Mysql command to drop a database
 * @param database
 * @returns
 */
export const dropDatabaseCommand = (database: string) => {
  return `DROP DATABASE IF EXISTS ${database};`
}

/**
 * Returns string for Mysql command to create a database
 * @param database
 * @returns
 */
export const createDatabaseCommand = (database: string) => {
  return `CREATE DATABASE ${database};`
}

/**
 * Returns string for Mysql command to use a database
 * @param database
 * @returns
 */
export const useDatabaseCommand = (database: string) => {
  return `use ${database};`
}

/**
 * Returns string for Mysql command to show all the tables from a database
 * @param database
 * @returns
 */
export const showTablesFromDatabaseCommand = (database: string) => {
  return `SHOW TABLES FROM ${database}`
}

/**
 * Returns string for Mysql command to show all entries in one table
 * @param table
 * @returns
 */
export const showEntriesFromTableCommand = (table: string) => {
  return `SELECT * from ${table};`
}

/**
 * Returns string for Mysql command to check if table exists
 * @param table
 * @returns
 */
export const selectTableExistsCommand = (table: string) => {
  return `SELECT EXISTS ( SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_TYPE LIKE 'BASE TABLE' AND TABLE_NAME = '${table}');`
}

/**
 * Returns string for Mysql command to drop table from databas
 * @param table
 * @returns
 */
export const dropTableCommand = (table: string) => {
  return `DROP TABLE IF EXISTS ${table};`
}
