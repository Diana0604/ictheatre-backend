import { disconnect as disconnectDatabase } from './src/mysql/mysql.index'
import init from './src/functions/init'
import { playShow } from './src/functions/showManagement'
import express from 'express'

const app = express()

//init database
init().then(() => {
    console.log('database is connected, show is ready to go')
}, (error) => {
    //something went wrong at init
    console.log('init failure')
    console.log(error)
})

app.get('/', function (req, res) {
    res.send('Hello World')
})

//to make requests from local network -> raspberrypi:3000
app.listen(3000, () => {
    console.log('listening on port 3000')
})