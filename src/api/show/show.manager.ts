import { setShowPausedDB, setShowStartedDB } from '../mysql/mysql.manager'
import { getListOfTableEntries } from '../mysql/mysql.wrapper'
import { Company } from '../mysql/objects/mysql.company'
import { ICompanyProperties } from '../../types/types.mysql'
import { Request, Response } from 'express'

//TODO -> time must come from database
let companiesUpdateInterval: NodeJS.Timer

/**
 * play show from current point
 */
export const playShow = async (_req: Request, res: Response) => {
    try {
        await setShowStartedDB()
    } catch (error) {
        console.log('could not set show to playing')
        console.log(error)
        res.status(500).json({ message: 'error starting show - check server logs ' })
        return
    }

    try {
        await startCompaniesUpdates()
    } catch (error) {
        console.log('could not load list of companies for current show')
        console.log(error)
        res.status(500).json({ message: 'error starting show - check server logs' })
        return
    }
    res.status(200).json({ message: 'OK' })
}

/**
 * pause show from current point
 */
export const pauseShow = async (_req: Request, res: Response) => {
    try {
        await setShowPausedDB()
    } catch (error) {
        console.log('could not set show to paused')
        console.log(error)
        res.status(500).json({ message: 'error pausing show - check server logs ' })
        return
    }
    clearInterval(companiesUpdateInterval)
    res.status(200).json({ message: 'OK' })
}

/**
 * set an interval to update price for companies every second
 */
const startCompaniesUpdates = async () => {
    try {
        //get companies list from database
        const companiesList = await getListOfTableEntries(Company.name)
        let allCompaniesList: Company[] = []
        //convert database objects into company objects
        for (const element of companiesList) {
            const newCompany = new Company(element as ICompanyProperties)
            allCompaniesList.push(newCompany)
        }
        //set the interval for every second and store it in global variable
        companiesUpdateInterval = setInterval(() => {
            for (const company of allCompaniesList) {
                updatePrice(company)
            }
        }, 1000)

    } catch (error) {
        throw error
    }
}

const updatePrice = (company: Company) => {
    //console.log(`updating price for: ${company.name}`)
    //console.log(`price updated to: ${company.currentPricePerShare}`)
}
