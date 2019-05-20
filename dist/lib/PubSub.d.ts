export default class PubSub {
    private handlers;
    private ref;
    /**
     * on
     */
    on(key: string, handler: Function): number;
    /**
     * off
     */
    off(key: string, ref?: number): void;
    /**
     * once
     */
    once(key: string, handler: Function): number;
    /**
     * emit
     */
    emit(key: string, data: any): void;
    /**
     * reset to default state
     */
    reset(): void;
    private getRefAndIncrement;
    private validateKeyAndRef;
    private validateKey;
}
