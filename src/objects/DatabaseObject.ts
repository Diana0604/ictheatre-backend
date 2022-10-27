let idGenerator = 0

/**
 * Object with id
 * All object that are going to be added in database should extend database object.
 */
export class DatabaseObject {
    id: number

    constructor() {
        this.id = idGenerator
        idGenerator++
    }

}
