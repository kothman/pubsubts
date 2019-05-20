const PubSub = require('./dist/')
const assert = require('chai').assert
const Errors = require('./dist/lib/Errors')
const KeyNotFoundError = Errors.KeyNotFoundError
const RefNotFoundError = Errors.RefNotFoundError

describe('PubSub', function() {
    beforeEach('reset state', function() {
        PubSub.reset()
    })
    describe('default state', function() {
        it('should have a ref of 0', function() {
            assert.strictEqual(PubSub.ref, 0)
        })
        it('should not have any handlers', function() {
            assert.deepStrictEqual(PubSub.handlers, {})
        })
    })
    describe('on', function() {
        it('should add the appropriate handler', function() {
            function handler() {}
            let eventName = 'EVENT'
            let ref1 = PubSub.on(eventName, handler)
            assert.deepStrictEqual(PubSub.handlers[eventName][ref1], {
                once: false,
                handler: handler
            })
            let ref2 = PubSub.on(eventName, handler)
            assert.deepStrictEqual(PubSub.handlers, {
                [eventName]: {
                    [ref1]: { once: false, handler: handler },
                    [ref2]: { once: false, handler: handler }
                }
            })
        })
    })
    describe('once', function() {
        it('should add the appropriate handler (with "once" set to true)', function() {
            function handler() {}
            let eventName = 'EVENT'
            let ref1 = PubSub.once(eventName, handler)
            assert.deepStrictEqual(PubSub.handlers[eventName][ref1], {
                once: true,
                handler: handler
            })
            let ref2 = PubSub.once(eventName, handler)
            assert.deepStrictEqual(PubSub.handlers, {
                [eventName]: {
                    [ref1]: { once: true, handler: handler },
                    [ref2]: { once: true, handler: handler }
                }
            })
        })
    })
    describe('off', function() {
        it('should remove the appropriate handler when not given a ref', function() {
            function handler() {}
            let eventName = 'EVENT'
            let ref1 = PubSub.on(eventName, handler)
            let ref2 = PubSub.on(eventName, handler)
            PubSub.off(eventName)
            assert.deepStrictEqual(PubSub.handlers, {})
        })
        it('should remove the appropriate handler when given a ref', function() {
            function handler() {}
            let eventName = 'EVENT'
            let ref1 = PubSub.on(eventName, handler)
            let ref2 = PubSub.on(eventName, handler)
            PubSub.off(eventName, ref1)
            assert.deepStrictEqual(PubSub.handlers, {
                [eventName]: {
                    [ref2]: { once: false, handler: handler }
                }
            })
            PubSub.off(eventName, ref2)
            assert.deepStrictEqual(PubSub.handlers, {})
        })
        it('should throw KeyNotFoundError when given key is not found', function() {
            assert.throws(() => PubSub.off('invalidKey'), (new KeyNotFoundError).message)
        })
        it('should throw RefNotFoundError when given ref is not found', function() {
            function handler() {}
            let eventName = 'EVENT'
            let ref1 = PubSub.on(eventName, handler)
            assert.throws(() => PubSub.off(eventName, 123), (new RefNotFoundError).message)
        })
    })
    describe('emit', function() {
        it('should call the registered handler', function() {
            let handlerCalled = 'handler called'
            let x = 'handler not called'
            function handler() {
                x = handlerCalled
            }
            let eventName = 'EVENT'
            let ref1 = PubSub.on(eventName, handler)
            PubSub.emit(eventName)
            assert.strictEqual(x, handlerCalled)
        })
        it('should call all registered handlers if more than one exists', function() {
            let handlerCalled = 'handler called'
            let x1 = 'handler not called'
            let x2 = 'handler not called'
            let x3 = 'handler not called'
            function h1() { x1 = handlerCalled }
            function h2() { x2 = handlerCalled }
            function h3() { x3 = handlerCalled }
            let eventName = 'EVENT'
            let ref1 = PubSub.on(eventName, h1)
            let ref2 = PubSub.on(eventName, h2)
            let ref3 = PubSub.on(eventName, h3)
            PubSub.emit(eventName)
            assert.deepStrictEqual([x1, x2, x3], [handlerCalled, handlerCalled, handlerCalled])
            assert.deepStrictEqual(PubSub.handlers, {
                [eventName]: {
                    [ref1]: {once: false, handler: h1},
                    [ref2]: { once: false, handler: h2 },
                    [ref3]: { once: false, handler: h3 },
                }
            })
        })
        it('should remove the registered handler if only meant to be called once', function() {
            let handlerCalled = 'handler called'
            let x1 = 'handler not called'
            let x2 = 'handler not called'
            let x3 = 'handler not called'
            function h1() { x1 = handlerCalled }
            function h2() { x2 = handlerCalled }
            function h3() { x3 = handlerCalled }
            let eventName = 'EVENT'
            let ref1 = PubSub.once(eventName, h1)
            let ref2 = PubSub.once(eventName, h2)
            let ref3 = PubSub.once(eventName, h3)
            PubSub.emit(eventName)
            assert.deepStrictEqual([x1, x2, x3], [handlerCalled, handlerCalled, handlerCalled])
            assert.deepStrictEqual(PubSub.handlers, {})
            assert.throws(() => PubSub(emit(eventName)))
        })
        it('should pass data to the registered handler', function() {
            let data = { a: 1 }
            let x1 = undefined
            let x2 = undefined
            function h1(data) {
                x1 = data
            }
            function h2(data) {
                x2 = data
            }
            let eventName = 'EVENT'
            let ref1 = PubSub.on(eventName, h1)
            let ref2 = PubSub.once(eventName, h2)
            PubSub.emit(eventName, data)
            assert.deepStrictEqual([x1, x2], [data, data])
            assert.deepStrictEqual(PubSub.handlers, {
                [eventName]: { [ref1]: { once: false, handler: h1 }}
            })
        })
        it('should throw an error if key does not exist', function() {
            assert.throws(() => PubSub.emit('invalid key'), (new KeyNotFoundError).message)
        })
    })

    // Private functions
    describe('getRefAndIncrement', function() {
        it('should increment ref', function() {
            assert.strictEqual(PubSub.ref, 0)
            let r0 = PubSub.getRefAndIncrement()
            assert.strictEqual(r0, 0)
            assert.strictEqual(PubSub.ref, 1)
            let r1 = PubSub.getRefAndIncrement()
            assert.strictEqual(r1, 1)
            assert.strictEqual(PubSub.ref, 2)
        })
    })
    describe('validateKeyAndRef', function() {
        it('should throw an error on invalid key or ref', function() {
            let key = 'EVENT'
            let ref = PubSub.on(key, () => '')
            assert.throws(() => PubSub.validateKeyAndRef(key, 'invalid ref'), (new RefNotFoundError).message)
            assert.throws(() => PubSub.validateKeyAndRef('invalid key', ref), (new KeyNotFoundError).message)
        })
        it('should not throw an error on valid key and ref', function() {
            let key = 'EVENT'
            let ref = PubSub.on(key, () => '')
            assert.doesNotThrow(() => PubSub.validateKeyAndRef(key, ref))
        })
    })
    describe('validateKey', function() {
        it('should throw an error on invalid key', function() {
            let key = 'EVENT'
            let ref = PubSub.on(key, () => '')
            assert.throws(() => PubSub.validateKey('invalid key'), (new KeyNotFoundError).message)
        })
        it('should not throw an error on valid key', function() {
            let key = 'EVENT'
            let ref = PubSub.on(key, () => '')
            assert.doesNotThrow(() => PubSub.validateKey(key))
        })
    })
})