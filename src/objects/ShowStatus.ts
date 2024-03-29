import { IShowStatus } from "../types/types.objects"
import { DatabaseObject } from './DatabaseObject'

/**
 * Show manager class - only one per show
 */
export class ShowStatus extends DatabaseObject {
    timeSinceStartup: number //in seconds
    isPlaying: boolean

    constructor({ timeSinceStartup, isPlaying, id }: IShowStatus) {
        super(id)
        this.isPlaying = isPlaying
        this.timeSinceStartup = timeSinceStartup
    }
}
