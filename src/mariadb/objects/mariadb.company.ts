let fakeId = 0

interface ICompanyProperties {
    name: string,
    description: string,
    initPricePerShare: number,
    finalPricePerShare: number
}

export default class Company {
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

class PlayerCompany extends Company {

    constructor(basicProps: ICompanyProperties) {
        super(basicProps)
    }
}