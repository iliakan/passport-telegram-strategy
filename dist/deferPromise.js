"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = deferPromise;
function deferPromise() {
    var resolve;
    var reject;
    var promise = new Promise(function (_resolve, _reject) {
        resolve = _resolve;
        reject = _reject;
    });
    return {
        then: function (f) { return promise.then(f); },
        callback: function (err) {
            var data = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                data[_i - 1] = arguments[_i];
            }
            return (err ? reject(err) : resolve(data));
        },
        promise: promise,
    };
}
//# sourceMappingURL=deferPromise.js.map