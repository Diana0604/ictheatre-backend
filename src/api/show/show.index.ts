import { Router } from 'express'

import { pauseShow, playShow } from './show.manager'

let router = Router()

router.post('/play', playShow)
router.post('/pause', pauseShow)

export default router