import { Router } from 'express'

import { restartDB, getCompaniesList } from './mysql.controller'

let router = Router()

router.post('/restart', restartDB)
router.get('/companies', getCompaniesList)

export default router
