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
exports.TransactionType = exports.TransactionResult = exports.LedgerEntryType = exports.Type = exports.Field = exports.Bytes = exports.TRANSACTION_TYPE_MAP = exports.TRANSACTION_TYPES = void 0;
const enums = __importStar(require("./definitions.json"));
const serialized_type_1 = require("../types/serialized-type");
const buffer_1 = require("buffer/");
/*
 * @brief: All valid transaction types
 */
exports.TRANSACTION_TYPES = Object.entries(enums.TRANSACTION_TYPES)
    .filter(([_key, value]) => value >= 0)
    .map(([key, _value]) => key);
exports.TRANSACTION_TYPE_MAP = Object.assign({}, ...Object.entries(enums.TRANSACTION_TYPES)
    .filter(([_, v]) => v >= 0)
    .map(([k, v]) => ({ [k]: v })));
const TYPE_WIDTH = 2;
const LEDGER_ENTRY_WIDTH = 2;
const TRANSACTION_TYPE_WIDTH = 2;
const TRANSACTION_RESULT_WIDTH = 1;
/*
 * @brief: Serialize a field based on type_code and Field.nth
 */
function fieldHeader(type, nth) {
    const header = [];
    if (type < 16) {
        if (nth < 16) {
            header.push((type << 4) | nth);
        }
        else {
            header.push(type << 4, nth);
        }
    }
    else if (nth < 16) {
        header.push(nth, type);
    }
    else {
        header.push(0, type, nth);
    }
    return buffer_1.Buffer.from(header);
}
/*
 * @brief: Bytes, name, and ordinal representing one type, ledger_type, transaction type, or result
 */
class Bytes {
    constructor(name, ordinal, ordinalWidth) {
        this.name = name;
        this.ordinal = ordinal;
        this.ordinalWidth = ordinalWidth;
        this.bytes = buffer_1.Buffer.alloc(ordinalWidth);
        for (let i = 0; i < ordinalWidth; i++) {
            this.bytes[ordinalWidth - i - 1] = (ordinal >>> (i * 8)) & 0xff;
        }
    }
    toJSON() {
        return this.name;
    }
    toBytesSink(sink) {
        sink.put(this.bytes);
    }
    toBytes() {
        return this.bytes;
    }
}
exports.Bytes = Bytes;
/*
 * @brief: Collection of Bytes objects, mapping bidirectionally
 */
class BytesLookup {
    constructor(types, ordinalWidth) {
        this.ordinalWidth = ordinalWidth;
        Object.entries(types).forEach(([k, v]) => {
            this[k] = new Bytes(k, v, ordinalWidth);
            this[v.toString()] = this[k];
        });
    }
    from(value) {
        return value instanceof Bytes ? value : this[value];
    }
    fromParser(parser) {
        return this.from(parser.readUIntN(this.ordinalWidth).toString());
    }
}
function buildField([name, info]) {
    const typeOrdinal = enums.TYPES[info.type];
    const field = fieldHeader(typeOrdinal, info.nth);
    return {
        name: name,
        nth: info.nth,
        isVariableLengthEncoded: info.isVLEncoded,
        isSerialized: info.isSerialized,
        isSigningField: info.isSigningField,
        ordinal: (typeOrdinal << 16) | info.nth,
        type: new Bytes(info.type, typeOrdinal, TYPE_WIDTH),
        header: field,
        associatedType: serialized_type_1.SerializedType, // For later assignment in ./types/index.js
    };
}
/*
 * @brief: The collection of all fields as defined in definitions.json
 */
class FieldLookup {
    constructor(fields) {
        fields.forEach(([k, v]) => {
            this[k] = buildField([k, v]);
            this[this[k].ordinal.toString()] = this[k];
        });
    }
    fromString(value) {
        return this[value];
    }
}
const Type = new BytesLookup(enums.TYPES, TYPE_WIDTH);
exports.Type = Type;
const LedgerEntryType = new BytesLookup(enums.LEDGER_ENTRY_TYPES, LEDGER_ENTRY_WIDTH);
exports.LedgerEntryType = LedgerEntryType;
const TransactionType = new BytesLookup(enums.TRANSACTION_TYPES, TRANSACTION_TYPE_WIDTH);
exports.TransactionType = TransactionType;
const TransactionResult = new BytesLookup(enums.TRANSACTION_RESULTS, TRANSACTION_RESULT_WIDTH);
exports.TransactionResult = TransactionResult;
const Field = new FieldLookup(enums.FIELDS);
exports.Field = Field;
//# sourceMappingURL=index.js.map