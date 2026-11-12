import { isValidClassicAddress, isValidXAddress } from 'xahau-address-codec'
import { TRANSACTION_TYPES } from 'xahau-binary-codec'

import { ValidationError } from '../../errors'
import {
  Amount,
  Currency,
  IssuedCurrency,
  IssuedCurrencyAmount,
  Memo,
  Signer,
} from '../common'
import { EmitDetails, HookParameter } from '../common/xahau'
import { isHex, onlyHasFields } from '../utils'

const MEMO_SIZE = 3

function isHexString(str: unknown): str is string {
  return isString(str) && isHex(str)
}

function isMemo(obj: unknown): obj is Memo {
  if (!isRecord(obj)) {
    return false
  }

  const memo = obj.Memo
  if (!isRecord(memo)) {
    return false
  }
  const size = Object.keys(memo).length
  const validData =
    memo.MemoData == null || (isString(memo.MemoData) && isHex(memo.MemoData))
  const validFormat =
    memo.MemoFormat == null ||
    (isString(memo.MemoFormat) && isHex(memo.MemoFormat))
  const validType =
    memo.MemoType == null || (isString(memo.MemoType) && isHex(memo.MemoType))

  return (
    size >= 1 &&
    size <= MEMO_SIZE &&
    validData &&
    validFormat &&
    validType &&
    onlyHasFields(memo, ['MemoFormat', 'MemoData', 'MemoType'])
  )
}

const SIGNER_SIZE = 3

function isSigner(obj: unknown): obj is Signer {
  if (!isRecord(obj)) {
    return false
  }

  const signer = obj.Signer
  if (!isRecord(signer)) {
    return false
  }

  return (
    Object.keys(signer).length === SIGNER_SIZE &&
    isString(signer.Account) &&
    isString(signer.TxnSignature) &&
    isString(signer.SigningPubKey)
  )
}

const XAH_CURRENCY_SIZE = 1
const ISSUE_SIZE = 2
const ISSUED_CURRENCY_SIZE = 3

// 4-16 bytes as hex
export const HOOK_NAME_REGEX = /^(?:[0-9A-Fa-f]{2}){4,16}$/u

/**
 * Verify the form and type of a Record/Object at runtime.
 *
 * @param value - The object to check the form and type of.
 * @returns Whether the Record/Object is properly formed.
 */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/**
 * Verify the form and type of a string at runtime.
 *
 * @param str - The object to check the form and type of.
 * @returns Whether the string is properly formed.
 */
export function isString(str: unknown): str is string {
  return typeof str === 'string'
}

/**
 * Verify the form and type of a number at runtime.
 *
 * @param num - The object to check the form and type of.
 * @returns Whether the number is properly formed.
 */
export function isNumber(num: unknown): num is number {
  return typeof num === 'number'
}

/**
 * Verify the form and type of a Currency at runtime.
 *
 * @param input - The input to check the form and type of.
 * @returns Whether the Currency is properly formed.
 */
export function isCurrency(input: unknown): input is Currency {
  return isString(input) || isIssuedCurrency(input)
}

/**
 * Verify the form and type of an IssuedCurrency at runtime.
 *
 * @param input - The input to check the form and type of.
 * @returns Whether the IssuedCurrency is properly formed.
 */
export function isIssuedCurrency(input: unknown): input is IssuedCurrency {
  return (
    isRecord(input) &&
    ((Object.keys(input).length === ISSUE_SIZE &&
      isString(input.issuer) &&
      isString(input.currency)) ||
      (Object.keys(input).length === XAH_CURRENCY_SIZE &&
        input.currency === 'XAH'))
  )
}

/**
 * Verify the form and type of an IssuedCurrencyAmount at runtime.
 *
 * @param input - The input to check the form and type of.
 * @returns Whether the IssuedCurrencyAmount is properly formed.
 */
export function isIssuedCurrencyAmount(
  input: unknown,
): input is IssuedCurrencyAmount {
  return (
    isRecord(input) &&
    Object.keys(input).length === ISSUED_CURRENCY_SIZE &&
    isString(input.value) &&
    isString(input.issuer) &&
    isString(input.currency)
  )
}

/**
 * Must be a valid account address
 */
export type Account = string

/**
 * Verify a string is in fact a valid account address.
 *
 * @param account - The object to check the form and type of.
 * @returns Whether the account is properly formed account for a transaction.
 */
export function isAccount(account: unknown): account is Account {
  return (
    typeof account === 'string' &&
    (isValidClassicAddress(account) || isValidXAddress(account))
  )
}

/**
 * Verify the form and type of an Amount at runtime.
 *
 * @param amount - The object to check the form and type of.
 * @returns Whether the Amount is properly formed.
 */
export function isAmount(amount: unknown): amount is Amount {
  return typeof amount === 'string' || isIssuedCurrencyAmount(amount)
}

/**
 * Verify the form and type of an Array at runtime.
 *
 * @param input - The object to check the form and type of.
 * @returns Whether the Array is properly formed.
 */
export function isArray<T = unknown>(input: unknown): input is T[] {
  return input != null && Array.isArray(input)
}

/* eslint-disable @typescript-eslint/restrict-template-expressions -- tx.TransactionType is checked before any calls */

/**
 * Verify the form and type of a required type for a transaction at runtime.
 *
 * @param tx - The object input to check the form and type of.
 * @param param - The object parameter.
 * @param checkValidity - The function to use to check the type.
 * @param errorOpts - Extra values to make the error message easier to understand.
 * @param errorOpts.txType - The transaction type throwing the error.
 * @param errorOpts.paramName - The name of the parameter in the transaction with the error.
 * @throws ValidationError if the parameter is missing or invalid.
 */
// eslint-disable-next-line max-params -- helper function
export function validateRequiredField<
  T extends Record<string, unknown>,
  K extends keyof T,
  V,
>(
  tx: T,
  param: K,
  checkValidity: (inp: unknown) => inp is V,
  errorOpts: {
    txType?: string
    paramName?: string
  } = {},
): asserts tx is T & { [P in K]: V } {
  const paramNameStr = errorOpts.paramName ?? param
  const txType = errorOpts.txType ?? tx.TransactionType
  if (tx[param] == null) {
    throw new ValidationError(
      `${txType}: missing field ${String(paramNameStr)}`,
    )
  }

  if (!checkValidity(tx[param])) {
    throw new ValidationError(
      `${txType}: invalid field ${String(paramNameStr)}`,
    )
  }
}

/**
 * Verify the form and type of an optional type for a transaction at runtime.
 *
 * @param tx - The transaction input to check the form and type of.
 * @param param - The object parameter.
 * @param checkValidity - The function to use to check the type.
 * @param errorOpts - Extra values to make the error message easier to understand.
 * @param errorOpts.txType - The transaction type throwing the error.
 * @param errorOpts.paramName - The name of the parameter in the transaction with the error.
 * @throws ValidationError if the parameter is invalid.
 */
// eslint-disable-next-line max-params -- helper function
export function validateOptionalField<
  T extends Record<string, unknown>,
  K extends keyof T,
  V,
>(
  tx: T,
  param: K,
  checkValidity: (inp: unknown) => inp is V,
  errorOpts: {
    txType?: string
    paramName?: string
  } = {},
): asserts tx is T & { [P in K]: V | undefined } {
  const paramNameStr = errorOpts.paramName ?? param
  const txType = errorOpts.txType ?? tx.TransactionType
  if (tx[param] !== undefined && !checkValidity(tx[param])) {
    throw new ValidationError(
      `${txType}: invalid field ${String(paramNameStr)}`,
    )
  }
}

/* eslint-enable @typescript-eslint/restrict-template-expressions -- checked before */

// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type -- no global flags yet
export interface GlobalFlags {}

/**
 * Every transaction has the same set of common fields.
 */
export interface BaseTransaction {
  /** The unique address of the transaction sender. */
  Account: Account
  /**
   * The type of transaction. Valid types include: `Payment`, `OfferCreate`,
   * `TrustSet`, and many others.
   */
  TransactionType: string
  /**
   * Integer amount of XAH, in drops, to be destroyed as a cost for
   * distributing this transaction to the network. Some transaction types have
   * different minimum requirements.
   */
  Fee?: string
  /**
   * The sequence number of the account sending the transaction. A transaction
   * is only valid if the Sequence number is exactly 1 greater than the previous
   * transaction from the same account. The special case 0 means the transaction
   * is using a Ticket instead.
   */
  Sequence?: number
  /**
   * Hash value identifying another transaction. If provided, this transaction
   * is only valid if the sending account's previously-sent transaction matches
   * the provided hash.
   */
  AccountTxnID?: string
  /** Set of bit-flags for this transaction. */
  Flags?: number | GlobalFlags
  /**
   * Highest ledger index this transaction can appear in. Specifying this field
   * places a strict upper limit on how long the transaction can wait to be
   * validated or rejected.
   */
  LastLedgerSequence?: number
  /**
   * Additional arbitrary information used to identify this transaction.
   */
  Memos?: Memo[]
  /**
   * Array of objects that represent a multi-signature which authorizes this
   * transaction.
   */
  Signers?: Signer[]
  /**
   * Milliseconds since the Ripple Epoch (2000-01-01T00:00:00Z) as a UInt64 hex
   * string (see `unixTimeToTransactionTime`). The transaction is only valid
   * while the parent ledger close time is within 120 seconds before and 300
   * seconds after this time. A transaction with a `Time`, `Sequence` 0 and no
   * `TicketSequence` is time-sequenced: the account `Sequence` is neither
   * checked nor consumed, and replay protection is `Time` being greater than
   * the account's `LastTxnTime`. Requires the JsonTx amendment.
   */
  Time?: string
  /**
   * Set by the server for a JsonTx submitted with `tx` and `sig`. Not a signing
   * field. Never set it yourself.
   */
  JsonTxDelta?: string
  /**
   * Arbitrary integer used to identify the reason for this payment, or a sender
   * on whose behalf this transaction is made. Conventionally, a refund should
   * specify the initial payment's SourceTag as the refund payment's
   * DestinationTag.
   */
  SourceTag?: number
  /**
   * Hex representation of the public key that corresponds to the private key
   * used to sign this transaction. If an empty string, indicates a
   * multi-signature is present in the Signers field instead.
   */
  SigningPubKey?: string
  /**
   * The sequence number of the ticket to use in place of a Sequence number. If
   * this is provided, Sequence must be 0. Cannot be used with AccountTxnID.
   */
  TicketSequence?: number
  /**
   * The signature that verifies this transaction as originating from the
   * account it says it is from.
   */
  TxnSignature?: string
  /**
   * The network id of the transaction.
   */
  NetworkID?: number
  /**
   *
   */
  FirstLedgerSequence?: number
  /**
   * The hook parameters of the transaction.
   */
  HookParameters?: HookParameter[]
  /**
   * The name of the hook to trigger, 4–16 bytes as hex. An empty value is
   * rejected (temMALFORMED since the fix20260929 amendment).
   */
  HookName?: string
  /**
   * The hook parameters of the transaction.
   */
  EmitDetails?: EmitDetails
}

function validateHookName(common: Record<string, unknown>): void {
  validateOptionalField(common, 'HookName', isString)
  const { HookName } = common
  if (isString(HookName) && !HOOK_NAME_REGEX.test(HookName)) {
    throw new ValidationError(
      'BaseTransaction: HookName must be a hex string of 8-32 hex characters',
    )
  }
}

/**
 * Verify the common fields of a transaction. The validate functionality will be
 * optional, and will check transaction form at runtime. This should be called
 * any time a transaction will be verified.
 *
 * @param common - An interface w/ common transaction fields.
 * @throws When the common param is malformed.
 */
// eslint-disable-next-line max-lines-per-function, max-statements -- one validator per common field
export function validateBaseTransaction(
  common: unknown,
): asserts common is BaseTransaction {
  if (!isRecord(common)) {
    throw new ValidationError(
      'BaseTransaction: invalid, expected a valid object',
    )
  }

  if (common.TransactionType === undefined) {
    throw new ValidationError('BaseTransaction: missing field TransactionType')
  }

  if (typeof common.TransactionType !== 'string') {
    throw new ValidationError('BaseTransaction: TransactionType not string')
  }

  if (!TRANSACTION_TYPES.includes(common.TransactionType)) {
    throw new ValidationError('BaseTransaction: Unknown TransactionType')
  }

  validateRequiredField(common, 'Account', isString)

  validateOptionalField(common, 'Fee', isString)

  validateOptionalField(common, 'Sequence', isNumber)

  validateOptionalField(common, 'AccountTxnID', isString)

  validateOptionalField(common, 'LastLedgerSequence', isNumber)

  const memos = common.Memos
  if (memos != null && (!isArray(memos) || !memos.every(isMemo))) {
    throw new ValidationError('BaseTransaction: invalid Memos')
  }

  const signers = common.Signers

  if (
    signers != null &&
    (!isArray(signers) || signers.length === 0 || !signers.every(isSigner))
  ) {
    throw new ValidationError('BaseTransaction: invalid Signers')
  }

  validateOptionalField(common, 'SourceTag', isNumber)

  validateOptionalField(common, 'SigningPubKey', isString)

  validateOptionalField(common, 'Time', isHexString)

  validateOptionalField(common, 'JsonTxDelta', isHexString)

  validateOptionalField(common, 'TicketSequence', isNumber)

  validateOptionalField(common, 'TxnSignature', isString)

  validateOptionalField(common, 'NetworkID', isNumber)

  validateHookName(common)
}

/**
 * Parse the value of an amount, expressed either in XAH or as an Issued Currency, into a number.
 *
 * @param amount - An Amount to parse for its value.
 * @returns The parsed amount value, or NaN if the amount count not be parsed.
 */
export function parseAmountValue(amount: unknown): number {
  if (!isAmount(amount)) {
    return NaN
  }
  if (typeof amount === 'string') {
    return parseFloat(amount)
  }
  return parseFloat(amount.value)
}
