import init from './init'
import express from 'express'
import routes from './src/routes'

const app = express()

//init database
init().then(() => {
    console.log('database is connected, show is ready to go')
}, (error) => {
    //something went wrong at init
    console.log('init failure')
    console.log(error)
})

//set up routes
routes(app)

//hello world
app.get('/', function (req, res) {
    res.send('Hello World')
})

//to make requests from local network -> raspberrypi:3000
app.listen(3000, () => {
    console.log('listening on port 3000')
})