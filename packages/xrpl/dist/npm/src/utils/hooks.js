"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hexHookParameters = exports.hexNamespace = exports.sha256 = exports.calculateHookOn = exports.tts = void 0;
const createHash = require("create-hash");
const ripple_binary_codec_1 = require("ripple-binary-codec");
const errors_1 = require("../errors");
exports.tts = ripple_binary_codec_1.TRANSACTION_TYPE_MAP;
function calculateHookOn(arr) {
    let hash = '0x3e3ff5bf';
    arr.forEach((nth) => {
        if (typeof nth !== 'string') {
            throw new errors_1.XrplError(`HookOn transaction type must be string`);
        }
        if (!ripple_binary_codec_1.TRANSACTION_TYPES.includes(String(nth))) {
            throw new errors_1.XrplError(`invalid transaction type '${String(nth)}' in HookOn array`);
        }
        let value = BigInt(hash);
        value ^= BigInt(1) << BigInt(exports.tts[nth]);
        hash = `0x${value.toString(16)}`;
    });
    hash = hash.replace('0x', '');
    hash = hash.padStart(64, '0');
    return hash.toUpperCase();
}
exports.calculateHookOn = calculateHookOn;
function sha256(string) {
    return __awaiter(this, void 0, void 0, function* () {
        const hash = createHash('sha256');
        hash.update(string);
        const hashBuffer = hash.digest();
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray
            .map((bytes) => bytes.toString(16).padStart(2, '0'))
            .join('');
        return hashHex;
    });
}
exports.sha256 = sha256;
function hexNamespace(namespace) {
    return __awaiter(this, void 0, void 0, function* () {
        return (yield sha256(namespace)).toUpperCase();
    });
}
exports.hexNamespace = hexNamespace;
function hexHookParameters(data) {
    const hookParameters = [];
    for (const parameter of data) {
        hookParameters.push({
            HookParameter: {
                HookParameterName: Buffer.from(parameter.HookParameter.HookParameterName, 'utf8')
                    .toString('hex')
                    .toUpperCase(),
                HookParameterValue: Buffer.from(parameter.HookParameter.HookParameterValue, 'utf8')
                    .toString('hex')
                    .toUpperCase(),
            },
        });
    }
    return hookParameters;
}
exports.hexHookParameters = hexHookParameters;
//# sourceMappingURL=hooks.js.map