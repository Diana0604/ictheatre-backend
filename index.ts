import { init as initDatabase, disconnect as disconnectDatabase, execute as executeDBQuery } from './src/mariadb/mariadb.index'

if (!initDatabase()) throw new Error('Could not load database')

console.log('project is running')

executeDBQuery('SELECT 1').then(() => {
    console.log('success!')
    disconnectDatabase()
})