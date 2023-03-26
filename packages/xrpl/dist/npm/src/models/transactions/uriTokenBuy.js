"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateURITokenBuy = void 0;
const errors_1 = require("../../errors");
const common_1 = require("./common");
function validateURITokenBuy(tx) {
    (0, common_1.validateBaseTransaction)(tx);
    if (tx.Account === tx.Destination) {
        throw new errors_1.ValidationError('URITokenBuy: Destination and Account must not be equal');
    }
    if (tx.URITokenID == null) {
        throw new errors_1.ValidationError('URITokenBuy: missing field URITokenID');
    }
    if (!(0, common_1.isAmount)(tx.Amount)) {
        throw new errors_1.ValidationError('URITokenBuy: invalid Amount');
    }
}
exports.validateURITokenBuy = validateURITokenBuy;
//# sourceMappingURL=uriTokenBuy.js.map