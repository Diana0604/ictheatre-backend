import companies from './fixtures/companies'
import { insertElement } from './mariadb/mariadb.index'
/**
 * seed database with:
 * 1. Companies -> the bot companies that represent other companeis
 */
export const seedDB = () => {
    for (const company of companies) {
        const newCompany = new Company(company)
        insertElement(newCompany)
    }
}