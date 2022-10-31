let idGenerator = 0

/**
 * Object with id
 * All object that are going to be added in database should extend database object.
 */
export class DatabaseObject {
    id: number

    constructor( currentId: number | undefined ) {
        if (currentId != undefined) this.id = currentId
        else {
            this.id = idGenerator
            idGenerator++
        }
    }

}
