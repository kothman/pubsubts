import { KeyNotFoundError, RefNotFoundError } from './Errors';

interface Handlers {
    [key: string]: {
        [ref: number]: {
            handler: Function,
            once: boolean
        }
    }
}

export default class PubSub {
    // Object containing events with corresponding handlers
    private handlers: Handlers = {}

    // Running index to be used as unique identifier for subscribed events
    private ref: number = 0

    /**
     * Register handler for given key, returning reference
     */
    public on(key: string, handler: Function): number {
        let ref: number = this.getRefAndIncrement()
        if (!this.handlers[key])
            this.handlers[key] = {}
        this.handlers[key][ref] = {
            handler: handler,
            once: false
        }
        return ref
    }

    /**
     * Removes reference for given key, or removes all references if ref not provided
     */
    public off(key: string, ref?: number) {
        if (ref === null || ref === undefined) {
            this.validateKey(key)
            delete this.handlers[key]
        } else {
            this.validateKeyAndRef(key, ref)
            delete this.handlers[key][ref]
            if (Object.keys(this.handlers[key]).length === 0)
                delete this.handlers[key]
        }
    }

    /**
     * Registers handler to be called only once, returning ref
     */
    public once(key: string, handler: Function): number {
        let ref: number = this.getRefAndIncrement()
        if (!this.handlers[key])
            this.handlers[key] = {}
        this.handlers[key][ref] = {
            handler: handler,
            once: true
        }
        return ref
    }

    /**
     * Calls all handlers for given key, passing data if provided
     */
    public emit(key: string, data: any) {
        this.validateKey(key)
        // Loop through each handler, removing the ref if once === true
        let eventRefs: string[] = Object.keys(this.handlers[key])
        eventRefs.forEach((refString: string) => {
            let ref: number = parseInt(refString)
            this.handlers[key][ref].handler(data)
            if (this.handlers[key][ref].once)
                this.off(key, ref)
        })
    }

    /**
     * Reset to default state
     */
    public reset() {
        this.ref = 0;
        this.handlers = {}
    }

    // Gets the current index and increments it
    private getRefAndIncrement(): number {
        let ref: number = this.ref
        this.ref++
        return ref
    }

    // Throw an error if key or ref is invalid
    private validateKeyAndRef(key: string, ref: number) {
        if (!this.handlers[key])
            throw new KeyNotFoundError
        if (!this.handlers[key][ref])
            throw new RefNotFoundError
    }

    // Throw an error if key is invalid
    private validateKey(key: string) {
        if (!this.handlers[key])
            throw new KeyNotFoundError
    }
}