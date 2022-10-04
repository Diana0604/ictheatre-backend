import { getListOfTableEntries } from '../mysql/mysql.manager'
import { Company } from '../mysql/objects/mysql.company'
import { ICompanyProperties } from '../../types/types.mysql'
import { Request, Response } from 'express'

//TODO -> time must come from database
let time = 0
let companiesUpdateInterval: NodeJS.Timer

/**
 * play show from current point
 */
export const playShow = async (_req: Request, res: Response) => {
    try {
        await startCompaniesUpdates()
        res.status(200).json({ message: 'OK' })
    } catch (error) {
        console.log('could not load list of companies for current show')
        console.log(error)
        res.status(500).json({ message: 'error starting show - check server logs' })
    }
}

/**
 * pause show from current point
 */
export const pauseShow = async (_req: Request, res: Response) => {
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
    console.log(`updating price for: ${company.name}`)
    console.log(`price updated to: ${company.currentPricePerShare}`)
}