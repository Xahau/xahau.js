"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateInvoke = void 0;
const errors_1 = require("../../errors");
const common_1 = require("./common");
function validateInvoke(tx) {
    (0, common_1.validateBaseTransaction)(tx);
    if (tx.Account === tx.Destination) {
        throw new errors_1.ValidationError('Invoke: Destination and Account must not be equal');
    }
}
exports.validateInvoke = validateInvoke;
//# sourceMappingURL=invoke.js.map