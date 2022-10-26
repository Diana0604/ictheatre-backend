//types
import { Request, Response } from 'express'
//database
import { cleanDB } from '../../mysql/mysql.wrapper'
import { getAllCompanies, getShowStatus, seedDB } from '../../mysql/mysql.manager'


/**
 * Restart database:
 * If show is running -> won't restart
 * 1. cleanDB -> create new empty database
 * 2. seedDB -> seedDB with fixtures
 */
export const restartDB = async (_req: Request, res: Response) => {
  try {
    const showStatus = await getShowStatus()
    if (showStatus.isPlaying) {
      res.status(401).json({ message: 'show is currently playing, cannot restart DB' })
      return
    }
    await cleanDB()
    //seed database
    await seedDB()
    res.status(200).json({ message: 'database seeded' })
  } catch (error) {
    res.status(500).json({ message: 'error restarting database - check server logs' })
    console.log('error creating database')
    console.log(error)
  }
}

/**
 * Get list of companies and their shares information
 * @param _req
 * @param res
 */
export const getCompaniesList = async (_req: Request, res: Response) => {
  try {
    const companiesList = await getAllCompanies()
    res.status(200).json(companiesList)
  } catch (error) {
    res.status(500).json({ message: 'error getting companies - check server logs' })
    console.log('error getting companies list')
    console.log(error)
  }
}
