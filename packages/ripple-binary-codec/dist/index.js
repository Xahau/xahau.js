"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRANSACTION_TYPE_MAP = exports.TRANSACTION_TYPES = exports.decodeLedgerData = exports.decodeQuality = exports.encodeQuality = exports.encodeForMultisigning = exports.encodeForSigningClaim = exports.encodeForSigning = exports.encode = exports.decode = void 0;
const assert = __importStar(require("assert"));
const coretypes_1 = require("./coretypes");
const ledger_hashes_1 = require("./ledger-hashes");
Object.defineProperty(exports, "decodeLedgerData", { enumerable: true, get: function () { return ledger_hashes_1.decodeLedgerData; } });
const enums_1 = require("./enums");
Object.defineProperty(exports, "TRANSACTION_TYPES", { enumerable: true, get: function () { return enums_1.TRANSACTION_TYPES; } });
Object.defineProperty(exports, "TRANSACTION_TYPE_MAP", { enumerable: true, get: function () { return enums_1.TRANSACTION_TYPE_MAP; } });
const { signingData, signingClaimData, multiSigningData, binaryToJSON, serializeObject, } = coretypes_1.binary;
/**
 * Decode a transaction
 *
 * @param binary hex-string of the encoded transaction
 * @returns the JSON representation of the transaction
 */
function decode(binary) {
    assert.ok(typeof binary === 'string', 'binary must be a hex string');
    return binaryToJSON(binary);
}
exports.decode = decode;
/**
 * Encode a transaction
 *
 * @param json The JSON representation of a transaction
 * @returns A hex-string of the encoded transaction
 */
function encode(json) {
    assert.ok(typeof json === 'object');
    return serializeObject(json)
        .toString('hex')
        .toUpperCase();
}
exports.encode = encode;
/**
 * Encode a transaction and prepare for signing
 *
 * @param json JSON object representing the transaction
 * @param signer string representing the account to sign the transaction with
 * @returns a hex string of the encoded transaction
 */
function encodeForSigning(json) {
    assert.ok(typeof json === 'object');
    return signingData(json)
        .toString('hex')
        .toUpperCase();
}
exports.encodeForSigning = encodeForSigning;
/**
 * Encode a transaction and prepare for signing with a claim
 *
 * @param json JSON object representing the transaction
 * @param signer string representing the account to sign the transaction with
 * @returns a hex string of the encoded transaction
 */
function encodeForSigningClaim(json) {
    assert.ok(typeof json === 'object');
    return signingClaimData(json)
        .toString('hex')
        .toUpperCase();
}
exports.encodeForSigningClaim = encodeForSigningClaim;
/**
 * Encode a transaction and prepare for multi-signing
 *
 * @param json JSON object representing the transaction
 * @param signer string representing the account to sign the transaction with
 * @returns a hex string of the encoded transaction
 */
function encodeForMultisigning(json, signer) {
    assert.ok(typeof json === 'object');
    assert.equal(json['SigningPubKey'], '');
    return multiSigningData(json, signer)
        .toString('hex')
        .toUpperCase();
}
exports.encodeForMultisigning = encodeForMultisigning;
/**
 * Encode a quality value
 *
 * @param value string representation of a number
 * @returns a hex-string representing the quality
 */
function encodeQuality(value) {
    assert.ok(typeof value === 'string');
    return coretypes_1.quality.encode(value).toString('hex').toUpperCase();
}
exports.encodeQuality = encodeQuality;
/**
 * Decode a quality value
 *
 * @param value hex-string of a quality
 * @returns a string representing the quality
 */
function decodeQuality(value) {
    assert.ok(typeof value === 'string');
    return coretypes_1.quality.decode(value).toString();
}
exports.decodeQuality = decodeQuality;
//# sourceMappingURL=index.js.map