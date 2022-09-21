import { init, disconnect, execute } from './src/mariadb/mariadb.index'

if (init()) {
    console.log('project is running')

    execute('SELECT 1').then(() => {
        console.log('success!')
        disconnect()
    })
}



