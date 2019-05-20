"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var KeyNotFoundError = /** @class */ (function (_super) {
    __extends(KeyNotFoundError, _super);
    function KeyNotFoundError() {
        return _super.call(this, 'No event found for given key') || this;
    }
    return KeyNotFoundError;
}(Error));
exports.KeyNotFoundError = KeyNotFoundError;
var RefNotFoundError = /** @class */ (function (_super) {
    __extends(RefNotFoundError, _super);
    function RefNotFoundError() {
        return _super.call(this, 'No event found for given ref') || this;
    }
    return RefNotFoundError;
}(Error));
exports.RefNotFoundError = RefNotFoundError;
