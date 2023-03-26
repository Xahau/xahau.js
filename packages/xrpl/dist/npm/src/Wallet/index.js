"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const bip32_1 = require("bip32");
const bip39_1 = require("bip39");
const isEqual_1 = __importDefault(require("lodash/isEqual"));
const ripple_address_codec_1 = require("ripple-address-codec");
const ripple_binary_codec_1 = require("ripple-binary-codec");
const ripple_keypairs_1 = require("ripple-keypairs");
const ECDSA_1 = __importDefault(require("../ECDSA"));
const errors_1 = require("../errors");
const common_1 = require("../models/transactions/common");
const utils_1 = require("../models/utils");
const utils_2 = require("../sugar/utils");
const hashLedger_1 = require("../utils/hashes/hashLedger");
const rfc1751_1 = require("./rfc1751");
const DEFAULT_ALGORITHM = ECDSA_1.default.ed25519;
const DEFAULT_DERIVATION_PATH = "m/44'/144'/0'/0/0";
function hexFromBuffer(buffer) {
    return buffer.toString('hex').toUpperCase();
}
class Wallet {
    constructor(publicKey, privateKey, opts = {}) {
        this.publicKey = publicKey;
        this.privateKey = privateKey;
        this.classicAddress = opts.masterAddress
            ? (0, utils_2.ensureClassicAddress)(opts.masterAddress)
            : (0, ripple_keypairs_1.deriveAddress)(publicKey);
        this.seed = opts.seed;
    }
    get address() {
        return this.classicAddress;
    }
    static generate(algorithm = DEFAULT_ALGORITHM) {
        const seed = (0, ripple_keypairs_1.generateSeed)({ algorithm });
        return Wallet.fromSeed(seed);
    }
    static fromSeed(seed, opts = {}) {
        return Wallet.deriveWallet(seed, {
            algorithm: opts.algorithm,
            masterAddress: opts.masterAddress,
        });
    }
    static fromEntropy(entropy, opts = {}) {
        var _a;
        const algorithm = (_a = opts.algorithm) !== null && _a !== void 0 ? _a : DEFAULT_ALGORITHM;
        const options = {
            entropy: Uint8Array.from(entropy),
            algorithm,
        };
        const seed = (0, ripple_keypairs_1.generateSeed)(options);
        return Wallet.deriveWallet(seed, {
            algorithm,
            masterAddress: opts.masterAddress,
        });
    }
    static fromMnemonic(mnemonic, opts = {}) {
        var _a;
        if (opts.mnemonicEncoding === 'rfc1751') {
            return Wallet.fromRFC1751Mnemonic(mnemonic, {
                masterAddress: opts.masterAddress,
                algorithm: opts.algorithm,
            });
        }
        if (!(0, bip39_1.validateMnemonic)(mnemonic)) {
            throw new errors_1.ValidationError('Unable to parse the given mnemonic using bip39 encoding');
        }
        const seed = (0, bip39_1.mnemonicToSeedSync)(mnemonic);
        const masterNode = (0, bip32_1.fromSeed)(seed);
        const node = masterNode.derivePath((_a = opts.derivationPath) !== null && _a !== void 0 ? _a : DEFAULT_DERIVATION_PATH);
        if (node.privateKey === undefined) {
            throw new errors_1.ValidationError('Unable to derive privateKey from mnemonic input');
        }
        const publicKey = hexFromBuffer(node.publicKey);
        const privateKey = hexFromBuffer(node.privateKey);
        return new Wallet(publicKey, `00${privateKey}`, {
            masterAddress: opts.masterAddress,
        });
    }
    static fromRFC1751Mnemonic(mnemonic, opts) {
        const seed = (0, rfc1751_1.rfc1751MnemonicToKey)(mnemonic);
        let encodeAlgorithm;
        if (opts.algorithm === ECDSA_1.default.ed25519) {
            encodeAlgorithm = 'ed25519';
        }
        else {
            encodeAlgorithm = 'secp256k1';
        }
        const encodedSeed = (0, ripple_address_codec_1.encodeSeed)(seed, encodeAlgorithm);
        return Wallet.fromSeed(encodedSeed, {
            masterAddress: opts.masterAddress,
            algorithm: opts.algorithm,
        });
    }
    static deriveWallet(seed, opts = {}) {
        var _a;
        const { publicKey, privateKey } = (0, ripple_keypairs_1.deriveKeypair)(seed, {
            algorithm: (_a = opts.algorithm) !== null && _a !== void 0 ? _a : DEFAULT_ALGORITHM,
        });
        return new Wallet(publicKey, privateKey, {
            seed,
            masterAddress: opts.masterAddress,
        });
    }
    sign(transaction, multisign) {
        let multisignAddress = false;
        if (typeof multisign === 'string' && multisign.startsWith('X')) {
            multisignAddress = multisign;
        }
        else if (multisign) {
            multisignAddress = this.classicAddress;
        }
        const tx = Object.assign({}, transaction);
        if (tx.TxnSignature || tx.Signers) {
            throw new errors_1.ValidationError('txJSON must not contain "TxnSignature" or "Signers" properties');
        }
        removeTrailingZeros(tx);
        const txToSignAndEncode = Object.assign({}, tx);
        txToSignAndEncode.SigningPubKey = multisignAddress ? '' : this.publicKey;
        if (multisignAddress) {
            const signer = {
                Account: multisignAddress,
                SigningPubKey: this.publicKey,
                TxnSignature: computeSignature(txToSignAndEncode, this.privateKey, multisignAddress),
            };
            txToSignAndEncode.Signers = [{ Signer: signer }];
        }
        else {
            txToSignAndEncode.TxnSignature = computeSignature(txToSignAndEncode, this.privateKey);
        }
        const serialized = (0, ripple_binary_codec_1.encode)(txToSignAndEncode);
        this.checkTxSerialization(serialized, tx);
        return {
            tx_blob: serialized,
            hash: (0, hashLedger_1.hashSignedTx)(serialized),
        };
    }
    verifyTransaction(signedTransaction) {
        const tx = typeof signedTransaction === 'string'
            ? (0, ripple_binary_codec_1.decode)(signedTransaction)
            : signedTransaction;
        const messageHex = (0, ripple_binary_codec_1.encodeForSigning)(tx);
        const signature = tx.TxnSignature;
        return (0, ripple_keypairs_1.verify)(messageHex, signature, this.publicKey);
    }
    getXAddress(tag = false, isTestnet = false) {
        return (0, ripple_address_codec_1.classicAddressToXAddress)(this.classicAddress, tag, isTestnet);
    }
    checkTxSerialization(serialized, tx) {
        var _a;
        const decoded = (0, ripple_binary_codec_1.decode)(serialized);
        const txCopy = Object.assign({}, tx);
        if (!decoded.TxnSignature && !decoded.Signers) {
            throw new errors_1.ValidationError('Serialized transaction must have a TxnSignature or Signers property');
        }
        delete decoded.TxnSignature;
        delete decoded.Signers;
        if (!tx.SigningPubKey) {
            delete decoded.SigningPubKey;
        }
        (_a = txCopy.Memos) === null || _a === void 0 ? void 0 : _a.map((memo) => {
            const memoCopy = Object.assign({}, memo);
            if (memo.Memo.MemoData) {
                if (!(0, utils_1.isHex)(memo.Memo.MemoData)) {
                    throw new errors_1.ValidationError('MemoData field must be a hex value');
                }
                memoCopy.Memo.MemoData = memo.Memo.MemoData.toUpperCase();
            }
            if (memo.Memo.MemoType) {
                if (!(0, utils_1.isHex)(memo.Memo.MemoType)) {
                    throw new errors_1.ValidationError('MemoType field must be a hex value');
                }
                memoCopy.Memo.MemoType = memo.Memo.MemoType.toUpperCase();
            }
            if (memo.Memo.MemoFormat) {
                if (!(0, utils_1.isHex)(memo.Memo.MemoFormat)) {
                    throw new errors_1.ValidationError('MemoFormat field must be a hex value');
                }
                memoCopy.Memo.MemoFormat = memo.Memo.MemoFormat.toUpperCase();
            }
            return memo;
        });
        if (txCopy.TransactionType === 'NFTokenMint' && txCopy.URI) {
            if (!(0, utils_1.isHex)(txCopy.URI)) {
                throw new errors_1.ValidationError('URI must be a hex value');
            }
            txCopy.URI = txCopy.URI.toUpperCase();
        }
        Object.keys(txCopy).forEach((key) => {
            const standard_currency_code_len = 3;
            if (txCopy[key] && (0, common_1.isIssuedCurrency)(txCopy[key])) {
                const decodedAmount = decoded[key];
                const decodedCurrency = decodedAmount.currency;
                const txCurrency = txCopy[key].currency;
                if (txCurrency.length === standard_currency_code_len &&
                    txCurrency.toUpperCase() === 'XRP') {
                    throw new errors_1.XrplError(`Trying to sign an issued currency with a similar standard code to XRP (received '${txCurrency}'). XRP is not an issued currency.`);
                }
                const amount = txCopy[key];
                if (amount.currency.length !== decodedCurrency.length) {
                    if (decodedCurrency.length === standard_currency_code_len) {
                        decodedAmount.currency = isoToHex(decodedCurrency);
                    }
                    else {
                        txCopy[key].currency = isoToHex(txCopy[key].currency);
                    }
                }
            }
        });
        if (!(0, isEqual_1.default)(decoded, txCopy)) {
            const data = {
                decoded,
                tx,
            };
            const error = new errors_1.ValidationError('Serialized transaction does not match original txJSON. See error.data', data);
            throw error;
        }
    }
}
Wallet.fromSecret = Wallet.fromSeed;
function computeSignature(tx, privateKey, signAs) {
    if (signAs) {
        const classicAddress = (0, ripple_address_codec_1.isValidXAddress)(signAs)
            ? (0, ripple_address_codec_1.xAddressToClassicAddress)(signAs).classicAddress
            : signAs;
        return (0, ripple_keypairs_1.sign)((0, ripple_binary_codec_1.encodeForMultisigning)(tx, classicAddress), privateKey);
    }
    return (0, ripple_keypairs_1.sign)((0, ripple_binary_codec_1.encodeForSigning)(tx), privateKey);
}
function removeTrailingZeros(tx) {
    if (tx.TransactionType === 'Payment' &&
        typeof tx.Amount !== 'string' &&
        tx.Amount.value.includes('.') &&
        tx.Amount.value.endsWith('0')) {
        tx.Amount = Object.assign({}, tx.Amount);
        tx.Amount.value = new bignumber_js_1.default(tx.Amount.value).toString();
    }
}
function isoToHex(iso) {
    const bytes = Buffer.alloc(20);
    if (iso !== 'XRP') {
        const isoBytes = iso.split('').map((chr) => chr.charCodeAt(0));
        bytes.set(isoBytes, 12);
    }
    return bytes.toString('hex').toUpperCase();
}
exports.default = Wallet;
//# sourceMappingURL=index.js.map