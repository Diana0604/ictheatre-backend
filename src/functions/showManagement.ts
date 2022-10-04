import { getListOfTableEntries } from '../mysql/mysql.index'
import { Company } from '../mysql/objects/mysql.company'
import { ICompanyProperties } from '../types/types.mysql'

//TODO -> time must come from database
let time = 0

/**
 * play show from current point
 */
export const playShow = async () => {
    await startCompaniesUpdates()
}

const startCompaniesUpdates = async () => {
    try {
        const companiesList = await getListOfTableEntries(Company.name)
        console.log('list of companies is: ')
        let allCompaniesList: Company[] = []
        for (const element of companiesList) {
            const newCompany = new Company(element as ICompanyProperties)
            allCompaniesList.push(newCompany)
        }

        const companiesUpdateInterval = setInterval(() => {
            console.log('updating companies price')
            for (const company of allCompaniesList) {
                updatePrice(company)
            }
        }, 1000)

    } catch (error) {
        console.log('could not load list of companies for current show')
        throw error
    }
}

const updatePrice = (company: Company) => {
    console.log(`updating price for: ${company.name}`)
    console.log(`price updated to: ${company.currentPricePerShare}`)
}