"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateURITokenCreateSellOffer = void 0;
const errors_1 = require("../../errors");
const common_1 = require("./common");
function validateURITokenCreateSellOffer(tx) {
    (0, common_1.validateBaseTransaction)(tx);
    if (tx.Account === tx.Destination) {
        throw new errors_1.ValidationError('URITokenCreateSellOffer: Destination and Account must not be equal');
    }
    if (tx.URITokenID == null) {
        throw new errors_1.ValidationError('URITokenCreateSellOffer: missing field URITokenID');
    }
    if (!(0, common_1.isAmount)(tx.Amount)) {
        throw new errors_1.ValidationError('URITokenCreateSellOffer: invalid Amount');
    }
}
exports.validateURITokenCreateSellOffer = validateURITokenCreateSellOffer;
//# sourceMappingURL=uriTokenCreateSellOffer.js.map