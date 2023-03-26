"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateURITokenMint = exports.URITokenMintFlags = void 0;
const errors_1 = require("../../errors");
const utils_1 = require("../utils");
const common_1 = require("./common");
var URITokenMintFlags;
(function (URITokenMintFlags) {
    URITokenMintFlags[URITokenMintFlags["tfBurnable"] = 1] = "tfBurnable";
})(URITokenMintFlags = exports.URITokenMintFlags || (exports.URITokenMintFlags = {}));
function validateURITokenMint(tx) {
    (0, common_1.validateBaseTransaction)(tx);
    if (typeof tx.URI === 'string' && !(0, utils_1.isHex)(tx.URI)) {
        throw new errors_1.ValidationError('URITokenMint: URI must be in hex format');
    }
}
exports.validateURITokenMint = validateURITokenMint;
//# sourceMappingURL=uriTokenMint.js.map