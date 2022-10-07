import { setShowPaused } from './src/mysql/mysql.manager'
import { init as initDB } from './src/mysql/mysql.wrapper'

/**
 * Init all processes:
 * 1. Init Database and seed if necessary
 */
export default async () => {
    if (!initDB()) throw Error('Could not load database')
    try {
        await setShowPaused()
    } catch (error) {
        console.log('show could not be set to paused')
        console.log(error)
    }
}
