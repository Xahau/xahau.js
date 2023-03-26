"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STArray = void 0;
const serialized_type_1 = require("./serialized-type");
const st_object_1 = require("./st-object");
const binary_parser_1 = require("../serdes/binary-parser");
const buffer_1 = require("buffer/");
const ARRAY_END_MARKER = buffer_1.Buffer.from([0xf1]);
const ARRAY_END_MARKER_NAME = 'ArrayEndMarker';
const OBJECT_END_MARKER = buffer_1.Buffer.from([0xe1]);
/**
 * TypeGuard for Array<JsonObject>
 */
function isObjects(args) {
    return (Array.isArray(args) && (args.length === 0 || typeof args[0] === 'object'));
}
/**
 * Class for serializing and deserializing Arrays of Objects
 */
class STArray extends serialized_type_1.SerializedType {
    /**
     * Construct an STArray from a BinaryParser
     *
     * @param parser BinaryParser to parse an STArray from
     * @returns An STArray Object
     */
    static fromParser(parser) {
        const bytes = [];
        while (!parser.end()) {
            const field = parser.readField();
            if (field.name === ARRAY_END_MARKER_NAME) {
                break;
            }
            bytes.push(field.header, parser.readFieldValue(field).toBytes(), OBJECT_END_MARKER);
        }
        bytes.push(ARRAY_END_MARKER);
        return new STArray(buffer_1.Buffer.concat(bytes));
    }
    /**
     * Construct an STArray from an Array of JSON Objects
     *
     * @param value STArray or Array of Objects to parse into an STArray
     * @returns An STArray object
     */
    static from(value) {
        if (value instanceof STArray) {
            return value;
        }
        if (isObjects(value)) {
            const bytes = [];
            value.forEach((obj) => {
                bytes.push(st_object_1.STObject.from(obj).toBytes());
            });
            bytes.push(ARRAY_END_MARKER);
            return new STArray(buffer_1.Buffer.concat(bytes));
        }
        throw new Error('Cannot construct STArray from value given');
    }
    /**
     * Return the JSON representation of this.bytes
     *
     * @returns An Array of JSON objects
     */
    toJSON() {
        const result = [];
        const arrayParser = new binary_parser_1.BinaryParser(this.toString());
        while (!arrayParser.end()) {
            const field = arrayParser.readField();
            if (field.name === ARRAY_END_MARKER_NAME) {
                break;
            }
            const outer = {};
            outer[field.name] = st_object_1.STObject.fromParser(arrayParser).toJSON();
            result.push(outer);
        }
        return result;
    }
}
exports.STArray = STArray;
//# sourceMappingURL=st-array.js.map