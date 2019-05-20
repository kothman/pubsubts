export default class PubSub {
    private handlers;
    private ref;
    /**
     * Register handler for given key, returning reference
     */
    on(key: string, handler: Function): number;
    /**
     * Removes reference for given key, or removes all references if ref not provided
     */
    off(key: string, ref?: number): void;
    /**
     * Registers handler to be called only once, returning ref
     */
    once(key: string, handler: Function): number;
    /**
     * Calls all handlers for given key, passing data if provided
     */
    emit(key: string, data: any): void;
    /**
     * Reset to default state
     */
    reset(): void;
    private getRefAndIncrement;
    private validateKeyAndRef;
    private validateKey;
}
