import { disconnect as disconnectDatabase } from './src/mysql/mysql.index'
import init from './src/functions/init'

//init database
init().then(() => {
    //at end of project disconnect from mysql
    console.log('project is running')
    disconnectDatabase()
}, (error) => {
    //if can't innit disconnect from mysql and finish
    console.log('project did not start up correctly')
    console.log(error)
    disconnectDatabase()
})
