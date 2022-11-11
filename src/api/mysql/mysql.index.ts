import { Router } from 'express'

import { restartDB, getCompaniesList, getCompany, getPlayerCompany, editCompany } from './mysql.controller'

let router = Router()

router.post('/restart', restartDB)
router.get('/companies', getCompaniesList)
router.get(`/companies/:id`, getCompany)
router.get(`/playercompany`, getPlayerCompany)
router.put(`/company/:id`, editCompany)
//router.

export default router
