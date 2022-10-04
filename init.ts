import { init as initDB} from './src/api/mysql/mysql.manager'

/**
 * Init all processes:
 * 1. Init Database and seed if necessary
 */
export default async () => {
    if (!initDB()) throw Error('Could not load database')
}