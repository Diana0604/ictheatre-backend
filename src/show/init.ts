import companies from '../fixtures/companies'
import { insertElement, init as initDB, restartDB, showAllTables } from '../mysql/mysql.manager'
import config from '../config/config.index'

import { Company } from '../mysql/objects/mysql.company'

/**
 * Init all processes:
 * 1. Init Database and seed if necessary
 */
export default async () => {
    if (!initDB()) throw Error('Could not load database')
}

/**
 * seed database with:
 * 1. Companies -> the bot companies that represent other companeis
 */
const seedDB = async () => {
    //first restarrt DB -> Drop database and create a new empty one
    try {
        await restartDB()
    } catch (error) {
        console.log('could not seed database')
        throw error
    }
    //loop through fixtures and add to database
    for (const company of companies) {
        const newCompany = new Company(company)
        try {
            await insertElement(newCompany)
        } catch (error) {
            console.log('could not create dataabases')
            throw (error)
        }
    }
    console.log('created databases')
    
    //display all tables that have been created
    try {
        await showAllTables()
    } catch (error) {
        console.log('could not show all but db should be there')
        throw (error)
    }
}
