"use strict";
/* eslint-disable func-style */
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionID = exports.sha512Half = exports.binaryToJSON = exports.signingClaimData = exports.signingData = exports.multiSigningData = exports.readJSON = exports.serializeObject = exports.makeParser = exports.BytesList = exports.BinarySerializer = exports.BinaryParser = void 0;
const types_1 = require("./types");
const binary_parser_1 = require("./serdes/binary-parser");
Object.defineProperty(exports, "BinaryParser", { enumerable: true, get: function () { return binary_parser_1.BinaryParser; } });
const hash_prefixes_1 = require("./hash-prefixes");
const binary_serializer_1 = require("./serdes/binary-serializer");
Object.defineProperty(exports, "BinarySerializer", { enumerable: true, get: function () { return binary_serializer_1.BinarySerializer; } });
Object.defineProperty(exports, "BytesList", { enumerable: true, get: function () { return binary_serializer_1.BytesList; } });
const hashes_1 = require("./hashes");
Object.defineProperty(exports, "sha512Half", { enumerable: true, get: function () { return hashes_1.sha512Half; } });
Object.defineProperty(exports, "transactionID", { enumerable: true, get: function () { return hashes_1.transactionID; } });
const bigInt = require("big-integer");
/**
 * Construct a BinaryParser
 *
 * @param bytes hex-string to construct BinaryParser from
 * @returns A BinaryParser
 */
const makeParser = (bytes) => new binary_parser_1.BinaryParser(bytes);
exports.makeParser = makeParser;
/**
 * Parse BinaryParser into JSON
 *
 * @param parser BinaryParser object
 * @returns JSON for the bytes in the BinaryParser
 */
const readJSON = (parser) => parser.readType(types_1.coreTypes.STObject).toJSON();
exports.readJSON = readJSON;
/**
 * Parse a hex-string into its JSON interpretation
 *
 * @param bytes hex-string to parse into JSON
 * @returns JSON
 */
const binaryToJSON = (bytes) => readJSON(makeParser(bytes));
exports.binaryToJSON = binaryToJSON;
/**
 * Function to serialize JSON object representing a transaction
 *
 * @param object JSON object to serialize
 * @param opts options for serializing, including optional prefix, suffix, and signingFieldOnly
 * @returns A Buffer containing the serialized object
 */
function serializeObject(object, opts = {}) {
    const { prefix, suffix, signingFieldsOnly = false } = opts;
    const bytesList = new binary_serializer_1.BytesList();
    if (prefix) {
        bytesList.put(prefix);
    }
    const filter = signingFieldsOnly
        ? (f) => f.isSigningField
        : undefined;
    types_1.coreTypes.STObject.from(object, filter).toBytesSink(bytesList);
    if (suffix) {
        bytesList.put(suffix);
    }
    return bytesList.toBytes();
}
exports.serializeObject = serializeObject;
/**
 * Serialize an object for signing
 *
 * @param transaction Transaction to serialize
 * @param prefix Prefix bytes to put before the serialized object
 * @returns A Buffer with the serialized object
 */
function signingData(transaction, prefix = hash_prefixes_1.HashPrefix.transactionSig) {
    return serializeObject(transaction, { prefix, signingFieldsOnly: true });
}
exports.signingData = signingData;
/**
 * Serialize a signingClaim
 *
 * @param claim A claim object to serialize
 * @returns the serialized object with appropriate prefix
 */
function signingClaimData(claim) {
    const num = bigInt(String(claim.amount));
    const prefix = hash_prefixes_1.HashPrefix.paymentChannelClaim;
    const channel = types_1.coreTypes.Hash256.from(claim.channel).toBytes();
    const amount = types_1.coreTypes.UInt64.from(num).toBytes();
    const bytesList = new binary_serializer_1.BytesList();
    bytesList.put(prefix);
    bytesList.put(channel);
    bytesList.put(amount);
    return bytesList.toBytes();
}
exports.signingClaimData = signingClaimData;
/**
 * Serialize a transaction object for multiSigning
 *
 * @param transaction transaction to serialize
 * @param signingAccount Account to sign the transaction with
 * @returns serialized transaction with appropriate prefix and suffix
 */
function multiSigningData(transaction, signingAccount) {
    const prefix = hash_prefixes_1.HashPrefix.transactionMultiSig;
    const suffix = types_1.coreTypes.AccountID.from(signingAccount).toBytes();
    return serializeObject(transaction, {
        prefix,
        suffix,
        signingFieldsOnly: true,
    });
}
exports.multiSigningData = multiSigningData;
//# sourceMappingURL=binary.js.map