"use strict";
exports.__esModule = true;
var Errors_1 = require("./Errors");
var PubSub = /** @class */ (function () {
    function PubSub() {
        // Object containing events with corresponding handlers
        this.handlers = {};
        // Running index to be used as unique identifier for subscribed events
        this.ref = 0;
    }
    /**
     * on
     */
    PubSub.prototype.on = function (key, handler) {
        var ref = this.getRefAndIncrement();
        if (!this.handlers[key])
            this.handlers[key] = {};
        this.handlers[key][ref] = {
            handler: handler,
            once: false
        };
        return ref;
    };
    /**
     * off
     */
    PubSub.prototype.off = function (key, ref) {
        if (ref === null || ref === undefined) {
            this.validateKey(key);
            delete this.handlers[key];
        }
        else {
            this.validateKeyAndRef(key, ref);
            delete this.handlers[key][ref];
            if (Object.keys(this.handlers[key]).length === 0)
                delete this.handlers[key];
        }
    };
    /**
     * once
     */
    PubSub.prototype.once = function (key, handler) {
        var ref = this.getRefAndIncrement();
        if (!this.handlers[key])
            this.handlers[key] = {};
        this.handlers[key][ref] = {
            handler: handler,
            once: true
        };
        return ref;
    };
    /**
     * emit
     */
    PubSub.prototype.emit = function (key, data) {
        var _this = this;
        this.validateKey(key);
        // Loop through each handler, removing the ref if once === true
        var eventRefs = Object.keys(this.handlers[key]);
        eventRefs.forEach(function (refString) {
            var ref = parseInt(refString);
            _this.handlers[key][ref].handler(data);
            if (_this.handlers[key][ref].once)
                _this.off(key, ref);
        });
    };
    /**
     * reset to default state
     */
    PubSub.prototype.reset = function () {
        this.ref = 0;
        this.handlers = {};
    };
    // Gets the current index and increments it
    PubSub.prototype.getRefAndIncrement = function () {
        var ref = this.ref;
        this.ref++;
        return ref;
    };
    // Throw an error if key or ref is invalid
    PubSub.prototype.validateKeyAndRef = function (key, ref) {
        if (!this.handlers[key])
            throw new Errors_1.KeyNotFoundError;
        if (!this.handlers[key][ref])
            throw new Errors_1.RefNotFoundError;
    };
    // Throw an error if key is invalid
    PubSub.prototype.validateKey = function (key) {
        if (!this.handlers[key])
            throw new Errors_1.KeyNotFoundError;
    };
    return PubSub;
}());
exports["default"] = PubSub;
