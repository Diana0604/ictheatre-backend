import { Router } from 'express'

import { restartDB, getCompaniesList, getCompany } from './mysql.controller'

let router = Router()

router.post('/restart', restartDB)
router.get('/companies', getCompaniesList)
router.get(`/companies/:id`, getCompany)

export default router
