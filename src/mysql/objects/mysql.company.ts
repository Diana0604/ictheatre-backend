let fakeId = 0

/**
 * Properties to be passed in company constructor
 */
interface ICompanyProperties {
    name: string,
    description: string,
    initPricePerShare: number, //price at init of show
    finalPricePerShare: number //price at end of show
}

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