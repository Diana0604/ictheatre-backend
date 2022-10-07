import { Company } from '../../mysql/objects/mysql.company'
import { Request, Response } from 'express'
import { getAllCompanies, getShowStatus, setShowPaused, setShowStarted, updateTimer } from '../../mysql/mysql.manager'
import config from '../../config/config.index'

//TODO -> time must come from database
let updateInterval: NodeJS.Timer

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
        await startUpdates()
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
    clearInterval(updateInterval)
    res.status(200).json({ message: 'OK' })
}


/**
 * set an interval to update price for companies every second
 */
const startUpdates = async () => {
    try {
        //get companies list from database
        const allCompaniesList = await getAllCompanies()
        //set the interval for every second and store it in global variable
        updateInterval = setInterval(async () => {
            console.log('========================= A SECOND HAS PASSED ============================')
            console.log('============================= UPDATING TIME ==============================')
            await updateTimer()
            console.log('========================= UPDATING COMPANIES =============================')
            for (const company of allCompaniesList) {
                updatePrice(company)
            }
        }, 1000)

    } catch (error) {
        throw error
    }
}

const updatePrice = async (company: Company) => {

    const secsSinceStartup = (await getShowStatus()).timeSinceStartup
    const linearPrice = (company.finalPricePerShare - company.initPricePerShare) / config.showConfig.lengthInSeconds * secsSinceStartup + company.initPricePerShare
    company.currentPricePerShare = linearPrice
    console.log(`updating price for: ${company.name}`)
    console.log(`price updated to: ${company.currentPricePerShare}`)
}
