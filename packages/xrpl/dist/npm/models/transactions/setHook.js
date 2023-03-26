"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSetHook = void 0;
const errors_1 = require("../../errors");
const common_1 = require("./common");
const MAX_HOOKS = 4;
const HEX_REGEX = /^[0-9A-Fa-f]{64}$/u;
function validateSetHook(tx) {
    (0, common_1.validateBaseTransaction)(tx);
    if (!Array.isArray(tx.Hooks)) {
        throw new errors_1.ValidationError('SetHook: invalid Hooks');
    }
    if (tx.Hooks.length > MAX_HOOKS) {
        throw new errors_1.ValidationError(`SetHook: maximum of ${MAX_HOOKS} hooks allowed in Hooks`);
    }
    for (const hook of tx.Hooks) {
        const hookObject = hook;
        const { HookOn, HookNamespace } = hookObject.Hook;
        if (HookOn !== undefined && !HEX_REGEX.test(HookOn)) {
            throw new errors_1.ValidationError(`SetHook: HookOn in Hook must be a 256-bit (32-byte) hexadecimal value`);
        }
        if (HookNamespace !== undefined && !HEX_REGEX.test(HookNamespace)) {
            throw new errors_1.ValidationError(`SetHook: HookNamespace in Hook must be a 256-bit (32-byte) hexadecimal value`);
        }
    }
}
exports.validateSetHook = validateSetHook;
//# sourceMappingURL=setHook.js.map