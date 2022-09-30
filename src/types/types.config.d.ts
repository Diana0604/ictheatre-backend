/**
 * General configuration file
 * mysqlConfig -> see types.mysql.d.ts
 * seedDB -> will restart db if true, will not restart database if false. WARNING: must be false during show
 */
export interface IConfig {
    mysqlConfig: IDatabaseConfig,
    seedDB: boolean
}