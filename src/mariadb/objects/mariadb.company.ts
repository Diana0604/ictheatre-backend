let fakeId = 0

interface ICompanyProperties {
    name: string,
    description: string,
    pricePerShare: number,
    updatePrice: (seconds: number) => void
}

class Company {
    id: number
    name: string
    description: string
    pricePerShare: number
    updatePrice: (seconds: number) => void

    constructor(props: ICompanyProperties) {
        this.name = props.name
        this.description = props.description
        this.pricePerShare = props.pricePerShare
        this.updatePrice = props.updatePrice
        this.id = fakeId
        fakeId++
    }
}

class PlayerCompany extends Company {

    constructor(basicProps: ICompanyProperties) {
        super(basicProps)
    }
}