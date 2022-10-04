import { Router } from 'express'

import { restartDB } from './mysql.manager'

let router = Router()

router.post('/restart', restartDB)

export default router