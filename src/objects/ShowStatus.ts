import { IShowStatus } from "../types/types.mysql"

/**
 * Show manager class - only one per show
 */
export class ShowStatus {
    timeSinceStartup: number //in seconds
    isPlaying: boolean

    constructor({ timeSinceStartup, isPlaying }: IShowStatus) {
        this.isPlaying = isPlaying
        this.timeSinceStartup = timeSinceStartup
    }
}
