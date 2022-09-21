import { init, disconnect } from './src/mariadb/mariadb.index'

init()

console.log('project is running')

setTimeout(() => {
    console.log('on timeout')
    disconnect()
}, 20000)