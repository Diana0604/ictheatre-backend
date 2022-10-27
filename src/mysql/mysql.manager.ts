//database
import { insertElement, getAllTablesFromDB, getListOfTableEntries, deleteTableDB, getFirstTableElement } from './mysql.wrapper'
//classes
import { Company } from '../objects/Company'
//config and fixtures
import companies from '../fixtures/companies'
import { ShowStatus } from '../objects/ShowStatus'
import { ICompanyProperties, IShowStatus } from '../types/types.mysql'

/**
 * seed database with:
 * 1. ShowStatus -> create a new show status manager object and add it to database
 * 2. Companies -> the bot companies that represent other companeis
 * show tables at end
 */
export const seedDB = async () => {
    //setup show status
    const showStatus = new ShowStatus({ timeSinceStartup: 0, isPlaying: false })
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
* Get show status from database
* @returns show status as object
*/
export const getShowStatus = async () => {
    try {
        const showStatus = await getFirstTableElement(ShowStatus.name)
        if (!showStatus) {
            return new ShowStatus({ timeSinceStartup: 0, isPlaying: false })
        }
        return new ShowStatus(showStatus as IShowStatus)
    } catch (error) {
        console.log('error getting show status')
        throw error
    }
}

/**
 * Display name of all the tables that are set in our database
 * TODO: will eventually display all content of all tables
 */
const showAllTables = async () => {
    try {
        const tables = await getAllTablesFromDB()
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
 * get show object from db and set to started
 */
export const setShowStarted = async () => {
    try {
        const showStatus = await getShowStatus()
        showStatus.isPlaying = true

        //delete current table
        await deleteTableDB(ShowStatus.name)
        //insert new element
        await insertElement(showStatus)
    } catch (error) {
        throw error
    }
}

/**
 * get show object from db and set to started
 */
export const setShowPaused = async () => {
    try {
        const showStatus = await getShowStatus()
        showStatus.isPlaying = false

        //delete current table
        await deleteTableDB(ShowStatus.name)
        //insert new element
        await insertElement(showStatus)
    } catch (error) {
        throw error
    }
}


/**
 * Update timer in show status to +1
 */
export const addToTimerInSeconds = async (seconds: number) => {
    try {
        let showStatus = await getShowStatus()
        showStatus.timeSinceStartup = showStatus.timeSinceStartup + seconds

        //delete current table
        await deleteTableDB(ShowStatus.name)
        //insert new element
        await insertElement(showStatus)
    } catch (error) {
        throw error
    }

}

/**
 *
 * @returns list of all companies from database
 */
export const getAllCompanies = async () => {
    const companiesList = await getListOfTableEntries(Company.name)
    let allCompaniesList: Company[] = []
    //convert database objects into company objects
    for (const element of companiesList) {
        const newCompany = new Company(element as ICompanyProperties)
        allCompaniesList.push(newCompany)
    }
    return allCompaniesList
}
