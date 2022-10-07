import config from '../config/config.index'
import { addToTimerInSeconds, getAllCompanies, getShowStatus } from '../mysql/mysql.manager'
import { Company } from '../mysql/objects/mysql.company'

/**
 * set an interval to update price for companies every second
 */
export const startUpdates = async () => {
    try {
        //get companies list from database
        const allCompaniesList = await getAllCompanies()
        //set the interval for every second and store it in global variable
        const updateInterval = setInterval(async () => {
            console.log('========================= A SECOND HAS PASSED ============================')
            console.log('============================= UPDATING TIME ==============================')
            await updateTimer()
            console.log('========================= UPDATING COMPANIES =============================')
            for (const company of allCompaniesList) {
                updatePrice(company)
            }
        }, config.showConfig.updateIntervalInSeconds*1000)

    } catch (error) {
        throw error
    }
}

const updateTimer = async () => {
    await addToTimerInSeconds(config.showConfig.updateIntervalInSeconds)
}

const updatePrice = async (company: Company) => {

    const secsSinceStartup = (await getShowStatus()).timeSinceStartup
    const linearPrice = (company.finalPricePerShare - company.initPricePerShare) / config.showConfig.lengthInSeconds * secsSinceStartup + company.initPricePerShare
    company.currentPricePerShare = linearPrice
    console.log(`updating price for: ${company.name}`)
    console.log(`price updated to: ${company.currentPricePerShare}`)
}
