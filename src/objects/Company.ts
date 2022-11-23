import { ICompanyProperties } from '../types/types.objects'
import { DatabaseObject } from './DatabaseObject'

/**
 * Company class
 */
export class Company extends DatabaseObject {
    name: string
    description: string
    initPricePerShare: number
    currentPricePerShare: number
    finalPricePerShare: number
    floatingShares: number

    constructor(props: ICompanyProperties) {
        super(props.id)
        this.name = props.name
        this.description = props.description
        this.initPricePerShare = props.initPricePerShare
        if (!props.currentPricePerShare)
            this.currentPricePerShare = props.initPricePerShare
        else this.currentPricePerShare = props.currentPricePerShare
        this.finalPricePerShare = props.finalPricePerShare
        this.floatingShares = props.floatingShares
    }
}