"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateURITokenCancelSellOffer = void 0;
const errors_1 = require("../../errors");
const common_1 = require("./common");
function validateURITokenCancelSellOffer(tx) {
    (0, common_1.validateBaseTransaction)(tx);
    if (tx.URITokenID == null) {
        throw new errors_1.ValidationError('URITokenCancelSellOffer: missing field URITokenID');
    }
}
exports.validateURITokenCancelSellOffer = validateURITokenCancelSellOffer;
//# sourceMappingURL=uriTokenCancelSellOffer.js.map