"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comparable = exports.SerializedType = void 0;
const binary_serializer_1 = require("../serdes/binary-serializer");
const buffer_1 = require("buffer/");
/**
 * The base class for all binary-codec types
 */
class SerializedType {
    constructor(bytes) {
        this.bytes = buffer_1.Buffer.alloc(0);
        this.bytes = bytes !== null && bytes !== void 0 ? bytes : buffer_1.Buffer.alloc(0);
    }
    static fromParser(parser, hint) {
        throw new Error('fromParser not implemented');
        return this.fromParser(parser, hint);
    }
    static from(value) {
        throw new Error('from not implemented');
        return this.from(value);
    }
    /**
     * Write the bytes representation of a SerializedType to a BytesList
     *
     * @param list The BytesList to write SerializedType bytes to
     */
    toBytesSink(list) {
        list.put(this.bytes);
    }
    /**
     * Get the hex representation of a SerializedType's bytes
     *
     * @returns hex String of this.bytes
     */
    toHex() {
        return this.toBytes().toString('hex').toUpperCase();
    }
    /**
     * Get the bytes representation of a SerializedType
     *
     * @returns A buffer of the bytes
     */
    toBytes() {
        if (this.bytes) {
            return this.bytes;
        }
        const bytes = new binary_serializer_1.BytesList();
        this.toBytesSink(bytes);
        return bytes.toBytes();
    }
    /**
     * Return the JSON representation of a SerializedType
     *
     * @returns any type, if not overloaded returns hexString representation of bytes
     */
    toJSON() {
        return this.toHex();
    }
    /**
     * @returns hexString representation of this.bytes
     */
    toString() {
        return this.toHex();
    }
}
exports.SerializedType = SerializedType;
/**
 * Base class for SerializedTypes that are comparable
 */
class Comparable extends SerializedType {
    lt(other) {
        return this.compareTo(other) < 0;
    }
    eq(other) {
        return this.compareTo(other) === 0;
    }
    gt(other) {
        return this.compareTo(other) > 0;
    }
    gte(other) {
        return this.compareTo(other) > -1;
    }
    lte(other) {
        return this.compareTo(other) < 1;
    }
    /**
     * Overload this method to define how two Comparable SerializedTypes are compared
     *
     * @param other The comparable object to compare this to
     * @returns A number denoting the relationship of this and other
     */
    compareTo(other) {
        throw new Error(`cannot compare ${this.toString()} and ${other.toString()}`);
    }
}
exports.Comparable = Comparable;
//# sourceMappingURL=serialized-type.js.map