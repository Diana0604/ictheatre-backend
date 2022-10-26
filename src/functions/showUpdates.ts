import config from '../config/config.index'
import { addToTimerInSeconds, getAllCompanies, getShowStatus } from '../mysql/mysql.manager'
import { updateElement } from '../mysql/mysql.wrapper'
import { Company } from '../objects/Company'

/**
 * set an interval to update:
 * 1. Timer
 * 2. Companies according to new time
 */
export const startUpdates = async () => {
    try {
        //get companies list from database
        const allCompaniesList = await getAllCompanies()
        //set the interval for every second and store it in global variable
        return setInterval(async () => {
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

/**
 * Update timer in database
 */
const updateTimer = async () => {
    await addToTimerInSeconds(config.showConfig.updateIntervalInSeconds)
}

/**
 *  Update the company price following a linear aproximation from initial price to final price
 * @param company
 */
const updatePrice = async (company: Company) => {

    const secsSinceStartup = (await getShowStatus()).timeSinceStartup
    const linearPrice = (company.finalPricePerShare - company.initPricePerShare) / config.showConfig.lengthInSeconds * secsSinceStartup + company.initPricePerShare
    company.currentPricePerShare = linearPrice
    await updateElement(company, {key: 'name', value: company.name}, {value: linearPrice, name: 'currentPricePerShare'})
    console.log(`${company.name}'s stock price updated to: ${company.currentPricePerShare}`)
}
