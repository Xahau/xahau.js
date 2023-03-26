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
exports.decodeLedgerData = exports.ledgerHash = exports.transactionTreeHash = exports.accountStateHash = void 0;
const assert = __importStar(require("assert"));
const shamap_1 = require("./shamap");
const hash_prefixes_1 = require("./hash-prefixes");
const hashes_1 = require("./hashes");
const binary_1 = require("./binary");
const hash_256_1 = require("./types/hash-256");
const st_object_1 = require("./types/st-object");
const uint_64_1 = require("./types/uint-64");
const uint_32_1 = require("./types/uint-32");
const uint_8_1 = require("./types/uint-8");
const binary_parser_1 = require("./serdes/binary-parser");
const bigInt = require("big-integer");
/**
 * Computes the hash of a list of objects
 *
 * @param itemizer Converts an item into a format that can be added to SHAMap
 * @param itemsJson Array of items to add to a SHAMap
 * @returns the hash of the SHAMap
 */
function computeHash(itemizer, itemsJson) {
    const map = new shamap_1.ShaMap();
    itemsJson.forEach((item) => map.addItem(...itemizer(item)));
    return map.hash();
}
/**
 * Convert a transaction into an index and an item
 *
 * @param json transaction with metadata
 * @returns a tuple of index and item to be added to SHAMap
 */
function transactionItemizer(json) {
    assert.ok(json.hash);
    const index = hash_256_1.Hash256.from(json.hash);
    const item = {
        hashPrefix() {
            return hash_prefixes_1.HashPrefix.transaction;
        },
        toBytesSink(sink) {
            const serializer = new binary_1.BinarySerializer(sink);
            serializer.writeLengthEncoded(st_object_1.STObject.from(json));
            serializer.writeLengthEncoded(st_object_1.STObject.from(json.metaData));
        },
    };
    return [index, item, undefined];
}
/**
 * Convert an entry to a pair Hash256 and ShaMapNode
 *
 * @param json JSON describing a ledger entry item
 * @returns a tuple of index and item to be added to SHAMap
 */
function entryItemizer(json) {
    const index = hash_256_1.Hash256.from(json.index);
    const bytes = (0, binary_1.serializeObject)(json);
    const item = {
        hashPrefix() {
            return hash_prefixes_1.HashPrefix.accountStateEntry;
        },
        toBytesSink(sink) {
            sink.put(bytes);
        },
    };
    return [index, item, undefined];
}
/**
 * Function computing the hash of a transaction tree
 *
 * @param param An array of transaction objects to hash
 * @returns A Hash256 object
 */
function transactionTreeHash(param) {
    const itemizer = transactionItemizer;
    return computeHash(itemizer, param);
}
exports.transactionTreeHash = transactionTreeHash;
/**
 * Function computing the hash of accountState
 *
 * @param param A list of accountStates hash
 * @returns A Hash256 object
 */
function accountStateHash(param) {
    const itemizer = entryItemizer;
    return computeHash(itemizer, param);
}
exports.accountStateHash = accountStateHash;
/**
 * Serialize and hash a ledger header
 *
 * @param header a ledger header
 * @returns the hash of header
 */
function ledgerHash(header) {
    const hash = new hashes_1.Sha512Half();
    hash.put(hash_prefixes_1.HashPrefix.ledgerHeader);
    assert.ok(header.parent_close_time !== undefined);
    assert.ok(header.close_flags !== undefined);
    uint_32_1.UInt32.from(header.ledger_index).toBytesSink(hash);
    uint_64_1.UInt64.from(bigInt(String(header.total_coins))).toBytesSink(hash);
    hash_256_1.Hash256.from(header.parent_hash).toBytesSink(hash);
    hash_256_1.Hash256.from(header.transaction_hash).toBytesSink(hash);
    hash_256_1.Hash256.from(header.account_hash).toBytesSink(hash);
    uint_32_1.UInt32.from(header.parent_close_time).toBytesSink(hash);
    uint_32_1.UInt32.from(header.close_time).toBytesSink(hash);
    uint_8_1.UInt8.from(header.close_time_resolution).toBytesSink(hash);
    uint_8_1.UInt8.from(header.close_flags).toBytesSink(hash);
    return hash.finish();
}
exports.ledgerHash = ledgerHash;
/**
 * Decodes a serialized ledger header
 *
 * @param binary A serialized ledger header
 * @returns A JSON object describing a ledger header
 */
function decodeLedgerData(binary) {
    assert.ok(typeof binary === 'string', 'binary must be a hex string');
    const parser = new binary_parser_1.BinaryParser(binary);
    return {
        ledger_index: parser.readUInt32(),
        total_coins: parser.readType(uint_64_1.UInt64).valueOf().toString(),
        parent_hash: parser.readType(hash_256_1.Hash256).toHex(),
        transaction_hash: parser.readType(hash_256_1.Hash256).toHex(),
        account_hash: parser.readType(hash_256_1.Hash256).toHex(),
        parent_close_time: parser.readUInt32(),
        close_time: parser.readUInt32(),
        close_time_resolution: parser.readUInt8(),
        close_flags: parser.readUInt8(),
    };
}
exports.decodeLedgerData = decodeLedgerData;
//# sourceMappingURL=ledger-hashes.js.map