import { disconnect as disconnectDatabase } from './src/mariadb/mariadb.index'
import init from './src/functions/init'

//init database
init().then(() => {
    console.log('project is running')
    disconnectDatabase()
}, (error) => {
    console.log('project did not start up correctly')
    console.log(error)
    disconnectDatabase()
})
