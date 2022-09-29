import { init as initDatabase, disconnect as disconnectDatabase, insertElement } from './src/mariadb/mariadb.index'

if (!initDatabase()) throw new Error('Could not load database')

console.log('project is running')
    
disconnectDatabase()