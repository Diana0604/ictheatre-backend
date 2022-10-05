import { IShowStatus } from "../../../types/types.mysql"

/**
 * Show manager class - only one per show
 */
export class ShowStatus {
    startTime: string //in seconds
    isPlaying: boolean

    constructor({ startTime, isPlaying }: IShowStatus) {
        this.isPlaying = isPlaying
        this.startTime = startTime || ""
    }
}