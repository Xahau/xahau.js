/* eslint-disable max-lines-per-function -- need to work with a lot of Tx verifications */

import { ValidationError } from '../../errors'
import { IssuedCurrencyAmount, Memo } from '../common'
import { isHex } from '../utils'
import { setTransactionFlagsToNumber } from '../utils/flags'

import { AccountSet, validateAccountSet } from './accountSet'
import { CheckCancel, validateCheckCancel } from './checkCancel'
import { CheckCash, validateCheckCash } from './checkCash'
import { CheckCreate, validateCheckCreate } from './checkCreate'
import { BaseTransaction, isIssuedCurrency } from './common'
import { DepositPreauth, validateDepositPreauth } from './depositPreauth'
import { EnableAmendment } from './enableAmendment'
import { EscrowCancel, validateEscrowCancel } from './escrowCancel'
import { EscrowCreate, validateEscrowCreate } from './escrowCreate'
import { EscrowFinish, validateEscrowFinish } from './escrowFinish'
import { TransactionMetadata } from './metadata'
import { OfferCancel, validateOfferCancel } from './offerCancel'
import { OfferCreate, validateOfferCreate } from './offerCreate'
import { Payment, validatePayment } from './payment'
import {
  PaymentChannelClaim,
  validatePaymentChannelClaim,
} from './paymentChannelClaim'
import {
  PaymentChannelCreate,
  validatePaymentChannelCreate,
} from './paymentChannelCreate'
import {
  PaymentChannelFund,
  validatePaymentChannelFund,
} from './paymentChannelFund'
import { SetFee } from './setFee'
import { SetRegularKey, validateSetRegularKey } from './setRegularKey'
import { SignerListSet, validateSignerListSet } from './signerListSet'
import { TicketCreate, validateTicketCreate } from './ticketCreate'
import { TrustSet, validateTrustSet } from './trustSet'
import { UNLModify } from './UNLModify'

/**
 * Transactions that can be submitted by clients
 *
 * @category Transaction Models
 */
export type SubmittableTransaction =
  | AccountSet
  | CheckCancel
  | CheckCash
  | CheckCreate
  | DepositPreauth
  | EscrowCancel
  | EscrowCreate
  | EscrowFinish
  | OfferCancel
  | OfferCreate
  | Payment
  | PaymentChannelClaim
  | PaymentChannelCreate
  | PaymentChannelFund
  | SetRegularKey
  | SignerListSet
  | TicketCreate
  | TrustSet

/**
 * Transactions that can only be created by validators.
 *
 * @category Transaction Models
 */
export type PseudoTransaction = EnableAmendment | SetFee | UNLModify

/**
 * All transactions that can live on the XAHL
 *
 * @category Transaction Models
 */
export type Transaction = SubmittableTransaction | PseudoTransaction

/**
 * @category Transaction Models
 */
export interface TransactionAndMetadata<
  T extends BaseTransaction = Transaction,
> {
  transaction: T
  metadata: TransactionMetadata<T>
}

/**
 * Verifies various Transaction Types.
 * Encode/decode and individual type validation.
 *
 * @param transaction - A Transaction.
 * @throws ValidationError When the Transaction is malformed.
 * @category Utilities
 */
export function validate(transaction: Record<string, unknown>): void {
  const tx = { ...transaction }
  if (tx.TransactionType == null) {
    throw new ValidationError('Object does not have a `TransactionType`')
  }
  if (typeof tx.TransactionType !== 'string') {
    throw new ValidationError("Object's `TransactionType` is not a string")
  }

  /*
   * - Memos have exclusively hex data.
   */
  if (tx.Memos != null && typeof tx.Memos !== 'object') {
    throw new ValidationError('Memo must be array')
  }
  if (tx.Memos != null) {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- needed here
    ;(tx.Memos as Array<Memo | null>).forEach((memo) => {
      if (memo?.Memo == null) {
        throw new ValidationError('Memo data must be in a `Memo` field')
      }
      if (memo.Memo.MemoData) {
        if (!isHex(memo.Memo.MemoData)) {
          throw new ValidationError('MemoData field must be a hex value')
        }
      }

      if (memo.Memo.MemoType) {
        if (!isHex(memo.Memo.MemoType)) {
          throw new ValidationError('MemoType field must be a hex value')
        }
      }

      if (memo.Memo.MemoFormat) {
        if (!isHex(memo.Memo.MemoFormat)) {
          throw new ValidationError('MemoFormat field must be a hex value')
        }
      }
    })
  }

  Object.keys(tx).forEach((key) => {
    const standard_currency_code_len = 3
    if (tx[key] && isIssuedCurrency(tx[key])) {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- needed
      const txCurrency = (tx[key] as IssuedCurrencyAmount).currency

      if (
        txCurrency.length === standard_currency_code_len &&
        txCurrency.toUpperCase() === 'XAH'
      ) {
        throw new ValidationError(
          `Cannot have an issued currency with a similar standard code to XAH (received '${txCurrency}'). XAH is not an issued currency.`,
        )
      }
    }
  })

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- okay here
  setTransactionFlagsToNumber(tx as unknown as Transaction)
  switch (tx.TransactionType) {
    case 'AccountSet':
      validateAccountSet(tx)
      break

    case 'CheckCancel':
      validateCheckCancel(tx)
      break

    case 'CheckCash':
      validateCheckCash(tx)
      break

    case 'CheckCreate':
      validateCheckCreate(tx)
      break

    case 'DepositPreauth':
      validateDepositPreauth(tx)
      break

    case 'EscrowCancel':
      validateEscrowCancel(tx)
      break

    case 'EscrowCreate':
      validateEscrowCreate(tx)
      break

    case 'EscrowFinish':
      validateEscrowFinish(tx)
      break

    case 'OfferCancel':
      validateOfferCancel(tx)
      break

    case 'OfferCreate':
      validateOfferCreate(tx)
      break

    case 'Payment':
      validatePayment(tx)
      break

    case 'PaymentChannelClaim':
      validatePaymentChannelClaim(tx)
      break

    case 'PaymentChannelCreate':
      validatePaymentChannelCreate(tx)
      break

    case 'PaymentChannelFund':
      validatePaymentChannelFund(tx)
      break

    case 'SetRegularKey':
      validateSetRegularKey(tx)
      break

    case 'SignerListSet':
      validateSignerListSet(tx)
      break

    case 'TicketCreate':
      validateTicketCreate(tx)
      break

    case 'TrustSet':
      validateTrustSet(tx)
      break

    default:
      throw new ValidationError(
        `Invalid field TransactionType: ${tx.TransactionType}`,
      )
  }
}
