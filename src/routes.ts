//types
import { Express } from 'express-serve-static-core'
//app routs
import mysql from './mysql/mysql.index'

/**
 * Add all routes for express server
 * @param app created with express()
 */
export default function (app : Express) {
    //Insert routes according to path
    app.use(`/mysql`, mysql)
}