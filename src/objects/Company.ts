import { ICompanyProperties } from '../types/types.mysql'
import { DatabaseObject } from './DatabaseObject'

let companyId = 0

/**
 * Company class
 */
export class Company extends DatabaseObject {
    name: string
    description: string
    initPricePerShare: number
    currentPricePerShare: number
    finalPricePerShare: number

    constructor(props: ICompanyProperties) {
        super(props.id)
        this.name = props.name
        this.description = props.description
        this.initPricePerShare = props.initPricePerShare
        if (!props.currentPricePerShare)
            this.currentPricePerShare = props.initPricePerShare
        else this.currentPricePerShare = props.currentPricePerShare
        this.finalPricePerShare = props.finalPricePerShare
    }
}

/**
 * Player company class. Not sure what more it will have from Player.
 */
class PlayerCompany extends Company {

    constructor(basicProps: ICompanyProperties) {
        super(basicProps)
    }
}
