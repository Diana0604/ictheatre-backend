import { ICompanyProperties } from "../../types/types.mysql"

let fakeId = 0

/**
 * Company class
 */
export class Company {
    id: number
    name: string
    description: string
    initPricePerShare: number
    currentPricePerShare: number
    finalPricePerShare: number

    constructor(props: ICompanyProperties) {
        this.name = props.name
        this.description = props.description
        this.initPricePerShare = props.initPricePerShare
        this.currentPricePerShare = props.initPricePerShare
        this.finalPricePerShare = props.finalPricePerShare
        this.id = fakeId
        fakeId++
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