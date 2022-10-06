import { Router } from 'express'

import { restartDB } from './mysql.controller'

let router = Router()

router.post('/restart', restartDB)

export default router
