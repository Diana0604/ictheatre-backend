import { insertElement, init as initDB, restartDB, showAllTables } from '../mysql/mysql.manager'
import config from '../../config/config.index'


/**
 * Init all processes:
 * 1. Init Database and seed if necessary
 */
export default async () => {
    if (!initDB()) throw Error('Could not load database')
}