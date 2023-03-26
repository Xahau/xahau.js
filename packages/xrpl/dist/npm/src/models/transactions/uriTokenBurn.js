"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateURITokenBurn = void 0;
const errors_1 = require("../../errors");
const common_1 = require("./common");
function validateURITokenBurn(tx) {
    (0, common_1.validateBaseTransaction)(tx);
    if (tx.URITokenID == null) {
        throw new errors_1.ValidationError('NFTokenBurn: missing field URITokenID');
    }
}
exports.validateURITokenBurn = validateURITokenBurn;
//# sourceMappingURL=uriTokenBurn.js.map