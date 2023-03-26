"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertStringToHex = exports.convertHexToString = void 0;
function convertStringToHex(string) {
    return Buffer.from(string, 'utf8').toString('hex').toUpperCase();
}
exports.convertStringToHex = convertStringToHex;
function convertHexToString(hex, encoding = 'utf8') {
    return Buffer.from(hex, 'hex').toString(encoding);
}
exports.convertHexToString = convertHexToString;
//# sourceMappingURL=stringConversion.js.map