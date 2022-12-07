import { Router } from 'express'
import {exec} from 'child_process'

let router = Router()

router.post('/shutdown', () => {
  exec("sudo poweroff", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});
})

export default router
