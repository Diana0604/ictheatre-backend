import { IShowStatus } from "../types/types.mysql"
import { DatabaseObject } from './DatabaseObject'

/**
 * Show manager class - only one per show
 */
export class ShowStatus extends DatabaseObject {
    timeSinceStartup: number //in seconds
    isPlaying: boolean

    constructor({ timeSinceStartup, isPlaying }: IShowStatus) {
        super()
        this.isPlaying = isPlaying
        this.timeSinceStartup = timeSinceStartup
    }
}
