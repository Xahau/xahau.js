"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
const stringConversion_1 = require("./stringConversion");
function createCrossChainPayment(payment, destAccount) {
    var _a;
    const destAccountHex = (0, stringConversion_1.convertStringToHex)(destAccount);
    const destAccountMemo = { Memo: { MemoData: destAccountHex } };
    const memos = (_a = payment.Memos) !== null && _a !== void 0 ? _a : [];
    if (memos.length > 2) {
        throw new errors_1.XrplError('Cannot have more than 2 memos in a cross-chain transaction.');
    }
    const newMemos = [destAccountMemo, ...memos];
    const newPayment = Object.assign(Object.assign({}, payment), { Memos: newMemos });
    delete newPayment.TxnSignature;
    return newPayment;
}
exports.default = createCrossChainPayment;
//# sourceMappingURL=createCrossChainPayment.js.map