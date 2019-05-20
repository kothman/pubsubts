export class KeyNotFoundError extends Error {
    constructor() {
        super('No event found for given key')
    }
}

export class RefNotFoundError extends Error {
    constructor() {
        super('No event found for given ref')
    }
}