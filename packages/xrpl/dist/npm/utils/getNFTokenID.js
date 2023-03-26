"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const flatMap_1 = __importDefault(require("lodash/flatMap"));
const metadata_1 = require("../models/transactions/metadata");
function getNFTokenID(meta) {
    if (meta.AffectedNodes === undefined) {
        throw new TypeError(`Unable to parse the parameter given to getNFTokenID. 
    'meta' must be the metadata from an NFTokenMint transaction. Received ${JSON.stringify(meta)} instead.`);
    }
    const affectedNodes = meta.AffectedNodes.filter((node) => {
        var _a;
        if ((0, metadata_1.isCreatedNode)(node)) {
            return node.CreatedNode.LedgerEntryType === 'NFTokenPage';
        }
        if ((0, metadata_1.isModifiedNode)(node)) {
            return (node.ModifiedNode.LedgerEntryType === 'NFTokenPage' &&
                Boolean((_a = node.ModifiedNode.PreviousFields) === null || _a === void 0 ? void 0 : _a.NFTokens));
        }
        return false;
    });
    const previousTokenIDSet = new Set((0, flatMap_1.default)(affectedNodes, (node) => {
        var _a;
        const nftokens = (0, metadata_1.isModifiedNode)(node)
            ? (_a = node.ModifiedNode.PreviousFields) === null || _a === void 0 ? void 0 : _a.NFTokens
            : [];
        return nftokens.map((token) => token.NFToken.NFTokenID);
    }).filter((id) => Boolean(id)));
    const finalTokenIDs = (0, flatMap_1.default)(affectedNodes, (node) => {
        var _a, _b, _c, _d, _e, _f;
        return ((_f = ((_c = (_b = (_a = node.ModifiedNode) === null || _a === void 0 ? void 0 : _a.FinalFields) === null || _b === void 0 ? void 0 : _b.NFTokens) !== null && _c !== void 0 ? _c : (_e = (_d = node.CreatedNode) === null || _d === void 0 ? void 0 : _d.NewFields) === null || _e === void 0 ? void 0 : _e.NFTokens)) !== null && _f !== void 0 ? _f : []).map((token) => token.NFToken.NFTokenID);
    }).filter((nftokenID) => Boolean(nftokenID));
    const nftokenID = finalTokenIDs.find((id) => !previousTokenIDSet.has(id));
    return nftokenID;
}
exports.default = getNFTokenID;
//# sourceMappingURL=getNFTokenID.js.map