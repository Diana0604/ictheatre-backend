//types
import { Request, Response } from 'express'

//database
import { insertElement, execute, cleanDB } from './mysql.wrapper'
//classes
import { Company } from './objects/mysql.company'
//config and fixtures
import config from '../../config/config.index'
import companies from '../../fixtures/companies'
import { ShowStatus } from './objects/mysql.showStatus'

/**
 * seed database with:
 * 1. ShowStatus -> create a new show status manager object and add it to database
 * 2. Companies -> the bot companies that represent other companeis
 * show tables at end
 */
const seedDB = async () => {
  //setup show status
  const showStatus = new ShowStatus({ startTime: null, isPlaying: false })
  try {
    await (insertElement(showStatus))
  } catch (error) {
    throw error
  }

  //loop through fixtures and add to database
  for (const company of companies) {
    const newCompany = new Company(company)
    try {
      await insertElement(newCompany)
    } catch (error) {
      throw error
    }
  }
  console.log('database seeded')

  //display all tables that have been created
  try {
    showAllTables()
  } catch (error) {
    console.log('problem showing tables at end')
    console.log(error)
  }
}


/**
 * delete and create emtpy database
 */
export const restartDB = async (_req: Request, res: Response) => {
  try {
    const showStatus = await getShowStatus()
    if (showStatus.isPlaying) {
      res.status(401).json({ message: 'show is currently playing, cannot restart DB' })
      return
    }
    await cleanDB()
    //seed database
    await seedDB()
    res.status(200).json({ message: 'database seeded' })
  } catch (error) {
    res.status(500).json({ message: 'error restarting database - check server logs' })
    console.log('error creating database')
    console.log(error)
  }
}

/**
 * Display name of all the tables that are set in our database
 * TODO: will eventually display all content of all tables
 */
export const showAllTables = async () => {
  try {
    const tables = await execute(`SHOW TABLES FROM ${config.mysqlConfig.database}`) as Array<unknown> as Array<{ Tables_in_ictheatre: string }>;
    for (const table of tables) {
      console.log(`======================= TABLE ==========================`)
      console.log(`TableTitle: ${table.Tables_in_ictheatre}`)
      const listOfEntries = await getListOfTableEntries(table.Tables_in_ictheatre)
      for (const entry of listOfEntries) {
        console.log(`=== ENTRY: `)
        for (const key in entry) {
          console.log(`${key}: ${entry[key]}`)
        }
      }
    }
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
export const getListOfTableEntries = async (tableName: string) => {
  try {
    const tableArray = await execute(`SELECT * from ${tableName};`) as Array<unknown> as Array<any>
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
 * Get show status from database
 * @param tableName name of table
 * @returns list of objects obtained from table
 * @throw error if table name does not exist in database
 */
const getShowStatus = async () => {
  try {
    const tableArray = await execute(`SELECT * from ${ShowStatus.name};`) as Array<unknown> as Array<ShowStatus>
    return new ShowStatus(tableArray[0])
  } catch (error) {
    throw error
  }
}

/**
 * get show object from db and set to started
 */
export const setShowStartedDB = async () => {
  try {
    const showStatus = await getShowStatus()
    showStatus.isPlaying = true
    if (showStatus.startTime == '') {
      console.log('start time set as now')
      showStatus.startTime = Date()
    }

    //delete current table
    await execute(`DROP TABLE IF EXISTS ${ShowStatus.name};`)
    await insertElement(showStatus)
  } catch (error) {
    throw error
  }
}

/**
 * get show object from db and set to started
 */
export const setShowPausedDB = async () => {
  try {
    const showStatus = await getShowStatus()
    showStatus.isPlaying = false

    //delete current table
    await execute(`DROP TABLE IF EXISTS ${ShowStatus.name};`)
    await insertElement(showStatus)
  } catch (error) {
    throw error
  }
}