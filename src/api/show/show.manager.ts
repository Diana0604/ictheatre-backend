import { Company } from '../../mysql/objects/mysql.company'
import { Request, Response } from 'express'
import { getAllCompanies, setShowPaused, setShowStarted } from '../../mysql/mysql.manager'

//TODO -> time must come from database
let companiesUpdateInterval: NodeJS.Timer

/**
 * play show from current point
 */
export const playShow = async (_req: Request, res: Response) => {
    try {
        await setShowStarted()
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
        await setShowPaused()
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
        const allCompaniesList = await getAllCompanies()
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
