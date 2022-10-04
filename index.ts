import { disconnect as disconnectDatabase } from './src/mysql/mysql.index'
import init from './src/functions/init'
import { playShow } from './src/functions/showManagement'

//init database
init().then(() => {
    console.log('init successful')
    //database is connected, show is ready to go
    //play will start it from whatever point we stopped it last
    playShow().then(null, (error) => {
        //something went wrong during the show -> report and go to finally
        console.log('something went wrong during the show')
        console.log(error)
    })
}, (error) => {
    //something when wrong at init -> report and go to finally
    console.log('init failure')
    console.log(error)
}).finally(() => {
    //no matter what, disconnect from database at end
    disconnectDatabase()
})
