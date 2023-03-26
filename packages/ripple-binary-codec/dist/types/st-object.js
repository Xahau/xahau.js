"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STObject = void 0;
const enums_1 = require("../enums");
const serialized_type_1 = require("./serialized-type");
const ripple_address_codec_1 = require("ripple-address-codec");
const binary_parser_1 = require("../serdes/binary-parser");
const binary_serializer_1 = require("../serdes/binary-serializer");
const buffer_1 = require("buffer/");
const OBJECT_END_MARKER_BYTE = buffer_1.Buffer.from([0xe1]);
const OBJECT_END_MARKER = 'ObjectEndMarker';
const ST_OBJECT = 'STObject';
const DESTINATION = 'Destination';
const ACCOUNT = 'Account';
const SOURCE_TAG = 'SourceTag';
const DEST_TAG = 'DestinationTag';
/**
 * Break down an X-Address into an account and a tag
 *
 * @param field Name of field
 * @param xAddress X-Address corresponding to the field
 */
function handleXAddress(field, xAddress) {
    const decoded = (0, ripple_address_codec_1.xAddressToClassicAddress)(xAddress);
    let tagName;
    if (field === DESTINATION)
        tagName = DEST_TAG;
    else if (field === ACCOUNT)
        tagName = SOURCE_TAG;
    else if (decoded.tag !== false)
        throw new Error(`${field} cannot have an associated tag`);
    return decoded.tag !== false
        ? { [field]: decoded.classicAddress, [tagName]: decoded.tag }
        : { [field]: decoded.classicAddress };
}
/**
 * Validate that two objects don't both have the same tag fields
 *
 * @param obj1 First object to check for tags
 * @param obj2 Second object to check for tags
 * @throws When both objects have SourceTag or DestinationTag
 */
function checkForDuplicateTags(obj1, obj2) {
    if (!(obj1[SOURCE_TAG] === undefined || obj2[SOURCE_TAG] === undefined))
        throw new Error('Cannot have Account X-Address and SourceTag');
    if (!(obj1[DEST_TAG] === undefined || obj2[DEST_TAG] === undefined))
        throw new Error('Cannot have Destination X-Address and DestinationTag');
}
/**
 * Class for Serializing/Deserializing objects
 */
class STObject extends serialized_type_1.SerializedType {
    /**
     * Construct a STObject from a BinaryParser
     *
     * @param parser BinaryParser to read STObject from
     * @returns A STObject object
     */
    static fromParser(parser) {
        const list = new binary_serializer_1.BytesList();
        const bytes = new binary_serializer_1.BinarySerializer(list);
        while (!parser.end()) {
            const field = parser.readField();
            if (field.name === OBJECT_END_MARKER) {
                break;
            }
            const associatedValue = parser.readFieldValue(field);
            bytes.writeFieldAndValue(field, associatedValue);
            if (field.type.name === ST_OBJECT) {
                bytes.put(OBJECT_END_MARKER_BYTE);
            }
        }
        return new STObject(list.toBytes());
    }
    /**
     * Construct a STObject from a JSON object
     *
     * @param value An object to include
     * @param filter optional, denote which field to include in serialized object
     * @returns a STObject object
     */
    static from(value, filter) {
        if (value instanceof STObject) {
            return value;
        }
        const list = new binary_serializer_1.BytesList();
        const bytes = new binary_serializer_1.BinarySerializer(list);
        let isUnlModify = false;
        const xAddressDecoded = Object.entries(value).reduce((acc, [key, val]) => {
            let handled = undefined;
            if (val && (0, ripple_address_codec_1.isValidXAddress)(val.toString())) {
                handled = handleXAddress(key, val.toString());
                checkForDuplicateTags(handled, value);
            }
            return Object.assign(acc, handled !== null && handled !== void 0 ? handled : { [key]: val });
        }, {});
        let sorted = Object.keys(xAddressDecoded)
            .map((f) => enums_1.Field[f])
            .filter((f) => f !== undefined &&
            xAddressDecoded[f.name] !== undefined &&
            f.isSerialized)
            .sort((a, b) => {
            return a.ordinal - b.ordinal;
        });
        if (filter !== undefined) {
            sorted = sorted.filter(filter);
        }
        sorted.forEach((field) => {
            const associatedValue = field.associatedType.from(xAddressDecoded[field.name]);
            if (associatedValue == undefined) {
                throw new TypeError(`Unable to interpret "${field.name}: ${xAddressDecoded[field.name]}".`);
            }
            if (associatedValue.name === 'UNLModify') {
                // triggered when the TransactionType field has a value of 'UNLModify'
                isUnlModify = true;
            }
            // true when in the UNLModify pseudotransaction (after the transaction type has been processed) and working with the
            // Account field
            // The Account field must not be a part of the UNLModify pseudotransaction encoding, due to a bug in rippled
            const isUnlModifyWorkaround = field.name == 'Account' && isUnlModify;
            bytes.writeFieldAndValue(field, associatedValue, isUnlModifyWorkaround);
            if (field.type.name === ST_OBJECT) {
                bytes.put(OBJECT_END_MARKER_BYTE);
            }
        });
        return new STObject(list.toBytes());
    }
    /**
     * Get the JSON interpretation of this.bytes
     *
     * @returns a JSON object
     */
    toJSON() {
        const objectParser = new binary_parser_1.BinaryParser(this.toString());
        const accumulator = {};
        while (!objectParser.end()) {
            const field = objectParser.readField();
            if (field.name === OBJECT_END_MARKER) {
                break;
            }
            accumulator[field.name] = objectParser.readFieldValue(field).toJSON();
        }
        return accumulator;
    }
}
exports.STObject = STObject;
//# sourceMappingURL=st-object.js.map