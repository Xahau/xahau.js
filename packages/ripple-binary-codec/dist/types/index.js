"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coreTypes = void 0;
const enums_1 = require("../enums");
const account_id_1 = require("./account-id");
const amount_1 = require("./amount");
const blob_1 = require("./blob");
const currency_1 = require("./currency");
const hash_128_1 = require("./hash-128");
const hash_160_1 = require("./hash-160");
const hash_256_1 = require("./hash-256");
const path_set_1 = require("./path-set");
const st_array_1 = require("./st-array");
const st_object_1 = require("./st-object");
const uint_16_1 = require("./uint-16");
const uint_32_1 = require("./uint-32");
const uint_64_1 = require("./uint-64");
const uint_8_1 = require("./uint-8");
const vector_256_1 = require("./vector-256");
const coreTypes = {
    AccountID: account_id_1.AccountID,
    Amount: amount_1.Amount,
    Blob: blob_1.Blob,
    Currency: currency_1.Currency,
    Hash128: hash_128_1.Hash128,
    Hash160: hash_160_1.Hash160,
    Hash256: hash_256_1.Hash256,
    PathSet: path_set_1.PathSet,
    STArray: st_array_1.STArray,
    STObject: st_object_1.STObject,
    UInt8: uint_8_1.UInt8,
    UInt16: uint_16_1.UInt16,
    UInt32: uint_32_1.UInt32,
    UInt64: uint_64_1.UInt64,
    Vector256: vector_256_1.Vector256,
};
exports.coreTypes = coreTypes;
Object.values(enums_1.Field).forEach((field) => {
    field.associatedType = coreTypes[field.type.name];
});
enums_1.Field['TransactionType'].associatedType = enums_1.TransactionType;
enums_1.Field['TransactionResult'].associatedType = enums_1.TransactionResult;
enums_1.Field['LedgerEntryType'].associatedType = enums_1.LedgerEntryType;
//# sourceMappingURL=index.js.map